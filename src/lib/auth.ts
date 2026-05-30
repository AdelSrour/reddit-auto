import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

declare module 'next-auth' {
  interface User {
    id: string;
    login?: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    login?: string;
    accessToken?: string;
    isOrgMember?: boolean;
    orgCheckedAt?: number;
    isAdminTeamMember?: boolean;
    adminTeamCheckedAt?: number;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: 'read:org read:user user:email',
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== 'github') {
        return false;
      }

      const isOrgMember = await checkOrganizationMembership(
        user.login,
        account.access_token,
      );

      if (!isOrgMember) {
        return false;
      }

      const isRequiredTeamMember = await checkRequiredTeamMembership(
        account.access_token,
      );

      return isRequiredTeamMember;
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id;
        token.login = user.login;
        token.accessToken = account.access_token;
        token.orgCheckedAt = Date.now();

        const isRequiredTeamMember = await checkRequiredTeamMembership(
          account.access_token,
        );
        token.isAdminTeamMember = isRequiredTeamMember;
        token.adminTeamCheckedAt = Date.now();

        return token;
      }

      const now = Date.now();
      const lastCheck = token.orgCheckedAt as number | undefined;
      const checkInterval = 5 * 60 * 1000;

      if (
        !lastCheck ||
        now - lastCheck > checkInterval ||
        !token.isOrgMember
      ) {
        const isMember = await checkOrganizationMembership(
          token.login,
          token.accessToken,
        );

        token.isOrgMember = isMember;
        token.orgCheckedAt = now;

        if (!isMember) {
          throw new Error('User is no longer a member of the organization');
        }
      }

      const lastAdminCheck = token.adminTeamCheckedAt as number | undefined;
      if (
        !lastAdminCheck ||
        now - lastAdminCheck > checkInterval ||
        !token.isAdminTeamMember
      ) {
        const isRequiredTeamMember = await checkRequiredTeamMembership(
          token.accessToken,
        );

        token.isAdminTeamMember = isRequiredTeamMember;
        token.adminTeamCheckedAt = now;

        if (!isRequiredTeamMember) {
          const requiredTeam =
            process.env.GITHUB_REQUIRED_TEAM || 'required team';
          throw new Error(
            `User is no longer a member of the ${requiredTeam} team`,
          );
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.isOrgMember === false) {
        throw new Error('User is no longer a member of the organization');
      }

      if (token.isAdminTeamMember === false) {
        const requiredTeam =
          process.env.GITHUB_REQUIRED_TEAM || 'required team';
        throw new Error(
          `User is no longer a member of the ${requiredTeam} team`,
        );
      }

      if (session.user) {
        session.user.id = token.id as string;
        session.user.login = token.login;
      }
      return session;
    },
  },
};

async function checkOrganizationMembership(
  githubUsername: string | undefined,
  accessToken: string | undefined,
): Promise<boolean> {
  const orgName = process.env.GITHUB_ORG_NAME;
  if (!orgName) {
    console.error(
      'GITHUB_ORG_NAME environment variable is required but not set',
    );
    return false;
  }

  if (!githubUsername) {
    console.error('GitHub username not provided');
    return false;
  }

  if (!accessToken) {
    console.error('GitHub access token not provided');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.github.com/orgs/${orgName}/memberships/${githubUsername}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );

    if (response.status !== 200) {
      console.error(
        `User ${githubUsername} is not a member of ${orgName} organization. Access denied.`,
      );
      return false;
    }

    const data = (await response.json()) as { state: string };
    if (data.state !== 'active') {
      console.error(
        `User ${githubUsername} membership in ${orgName} is not active. Current state: ${data.state}`,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking organization membership:', error);
    return false;
  }
}

async function checkRequiredTeamMembership(
  accessToken: string | undefined,
): Promise<boolean> {
  if (!accessToken) {
    console.error('GitHub access token not provided');
    return false;
  }

  const orgName = process.env.GITHUB_ORG_NAME;
  if (!orgName) {
    console.error(
      'GITHUB_ORG_NAME environment variable is required but not set',
    );
    return false;
  }

  const requiredTeamName = process.env.GITHUB_REQUIRED_TEAM;
  if (!requiredTeamName) {
    console.error(
      'GITHUB_REQUIRED_TEAM environment variable is required but not set',
    );
    return false;
  }

  try {
    const response = await fetch('https://api.github.com/user/teams', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch teams: ${response.status} ${response.statusText}`,
      );
      return false;
    }

    const teams = (await response.json()) as Array<{
      organization: { login: string };
      name: string;
      slug: string;
    }>;

    const requiredTeamLower = requiredTeamName.toLowerCase();
    const isInRequiredTeam = teams.some(
      (team) =>
        team.organization.login.toLowerCase() === orgName.toLowerCase() &&
        (team.name.toLowerCase() === requiredTeamLower ||
          team.slug.toLowerCase() === requiredTeamLower),
    );

    if (!isInRequiredTeam) {
      console.error(
        `User is not a member of the ${requiredTeamName} team in ${orgName} organization. Access denied.`,
      );
    }

    return isInRequiredTeam;
  } catch (error) {
    console.error('Error checking required team membership:', error);
    return false;
  }
}

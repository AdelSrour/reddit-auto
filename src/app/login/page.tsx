'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Bot, LogIn } from 'lucide-react';

export default function LoginPage(): React.ReactNode {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-lg text-foreground">Loading...</div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">
            <Bot className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Reddit Auto</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in with your GitHub account to continue
          </p>
        </div>
        <button
          onClick={() => signIn('github')}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          <LogIn className="h-5 w-5" aria-hidden="true" />
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}

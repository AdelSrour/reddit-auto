import Link from 'next/link';
import {
  Bot,
  Radio,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Header } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';

const dashboardLinks: Array<{
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    href: '/accounts',
    title: 'Manage Accounts',
    description: 'Add, edit, and manage your Reddit accounts',
    icon: Users,
  },
  {
    href: '/accounts/new',
    title: 'Add Account',
    description: 'Add a new Reddit account with proxy support',
    icon: UserPlus,
  },
  {
    href: '/f5bot',
    title: 'F5Bot Matches',
    description: 'View Reddit posts and comments from F5Bot alerts',
    icon: Radio,
  },
  {
    href: '/automation',
    title: 'Automation',
    description: 'Create and manage automation instances for your accounts',
    icon: Bot,
  },
];

export default function HomePage(): React.ReactNode {
  return (
    <div>
      <Header
        title="Dashboard"
        description="Welcome to Reddit Auto - manage your Reddit accounts"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <Card className="cursor-pointer transition-shadow hover:border-primary/30 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

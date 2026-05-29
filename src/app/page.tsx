import Link from 'next/link';
import { Header } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';

export default function HomePage() {
  return (
    <div>
      <Header
        title="Dashboard"
        description="Welcome to Reddit Auto - manage your Reddit accounts"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/accounts">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Accounts
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add, edit, and manage your Reddit accounts
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/accounts/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Account
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add a new Reddit account with proxy support
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/f5bot">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                F5Bot Matches
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                View Reddit posts and comments from F5Bot alerts
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="opacity-60">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Automation (Coming Soon)
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Schedule automated actions for your accounts
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

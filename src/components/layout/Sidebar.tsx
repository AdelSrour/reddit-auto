'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  History,
  LayoutDashboard,
  Radio,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation: Array<{ name: string; href: string; icon: LucideIcon }> = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Accounts', href: '/accounts', icon: Users },
  { name: 'F5Bot', href: '/f5bot', icon: Radio },
  { name: 'Automation', href: '/automation', icon: Bot },
  { name: 'Reply History', href: '/reply-history', icon: History },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps): React.ReactNode {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" aria-hidden="true" />
            <h1 className="text-xl font-bold text-primary">Reddit Auto</h1>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        onClose();
                      }
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

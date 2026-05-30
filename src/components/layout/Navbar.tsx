'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { ChevronDown, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps): React.ReactNode {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = (): void => {
    setMenuOpen(false);
    void signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="fixed top-0 right-0 z-30 h-16 w-full border-b border-border bg-navbar text-navbar-foreground md:left-64 md:w-[calc(100%-16rem)]">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition-colors hover:bg-accent md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden flex-1 md:block" />

        {session?.user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent sm:gap-3"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'Profile'}
                  width={36}
                  height={36}
                  className="h-8 w-8 rounded-full border border-border object-cover sm:h-9 sm:w-9"
                />
              )}
              <div className="hidden text-left text-sm md:block">
                <div className="font-medium">{session.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {session.user.login ?? session.user.email}
                </div>
              </div>
              <div className="max-w-[100px] truncate text-xs font-medium md:hidden">
                {session.user.name}
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  menuOpen && 'rotate-180',
                )}
              />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 z-50 mt-2 min-w-[200px] rounded-lg border border-border bg-card p-1 shadow-lg"
                role="menu"
              >
                <div className="border-b border-border px-3 py-2 sm:hidden">
                  <div className="text-sm font-medium text-card-foreground">
                    {session.user.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.user.login ?? session.user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-accent"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

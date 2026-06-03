'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';
import { Card, CardContent, Badge } from '@/components/ui';
import type { AutomationInstance, AutomationStatus } from '@/lib/types';

interface InstanceCardProps {
  instance: AutomationInstance;
}

const statusColors: Record<AutomationStatus, 'success' | 'warning' | 'error'> = {
  ACTIVE: 'success',
  PAUSED: 'warning',
  OFF: 'error',
};

const statusLabels: Record<AutomationStatus, string> = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  OFF: 'Off',
};

export function InstanceCard({ instance }: InstanceCardProps) {
  return (
    <Link href={`/automation/${instance.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Bot className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <h3 className="truncate text-lg font-semibold text-foreground">
                {instance.title}
              </h3>
            </div>
            <Badge variant={statusColors[instance.status]}>
              {statusLabels[instance.status]}
            </Badge>
          </div>

          {instance.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {instance.description}
            </p>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account</span>
              <span className="font-medium text-foreground">
                u/{instance.accountUsername}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Replies/day</span>
              <span className="font-medium text-foreground">
                {instance.repliesPerDay}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

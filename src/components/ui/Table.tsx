import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ className, children, ...props }: TableProps): React.ReactNode {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn('min-w-full divide-y divide-border', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableHeader({ className, children, ...props }: TableHeaderProps): React.ReactNode {
  return (
    <thead className={cn('bg-muted', className)} {...props}>
      {children}
    </thead>
  );
}

type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableBody({ className, children, ...props }: TableBodyProps): React.ReactNode {
  return (
    <tbody className={cn('divide-y divide-border bg-card', className)} {...props}>
      {children}
    </tbody>
  );
}

type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export function TableRow({ className, children, ...props }: TableRowProps): React.ReactNode {
  return (
    <tr className={cn('hover:bg-muted/50', className)} {...props}>
      {children}
    </tr>
  );
}

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

export function TableHead({ className, children, ...props }: TableHeadProps): React.ReactNode {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export function TableCell({ className, children, ...props }: TableCellProps): React.ReactNode {
  return (
    <td className={cn('whitespace-nowrap px-6 py-4 text-sm text-foreground', className)} {...props}>
      {children}
    </td>
  );
}

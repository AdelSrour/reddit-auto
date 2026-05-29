import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ className = '', children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full divide-y divide-gray-200 ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableHeader({ className = '', children, ...props }: TableHeaderProps) {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  );
}

type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableBody({ className = '', children, ...props }: TableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export function TableRow({ className = '', children, ...props }: TableRowProps) {
  return (
    <tr className={`hover:bg-gray-50 ${className}`} {...props}>
      {children}
    </tr>
  );
}

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

export function TableHead({ className = '', children, ...props }: TableHeadProps) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export function TableCell({ className = '', children, ...props }: TableCellProps) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`} {...props}>
      {children}
    </td>
  );
}


import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingStateCard } from './LoadingStateCard';
import { useRoleValidation } from '@/hooks/common/useRoleValidation';
import { UserRole } from '@/types/database';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  requiredRoles?: UserRole[];
}

interface SecureDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  title?: string;
  description?: string;
  actions?: ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function SecureDataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  title,
  description,
  actions,
  emptyMessage = "Tidak ada data untuk ditampilkan",
  className = ""
}: SecureDataTableProps<T>) {
  const { canAccess } = useRoleValidation();

  if (loading) {
    return <LoadingStateCard rows={5} className={className} />;
  }

  // Filter columns based on user role
  const visibleColumns = columns.filter(column => 
    !column.requiredRoles || canAccess(column.requiredRoles)
  );

  return (
    <Card className={className}>
      {(title || description || actions) && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {actions}
          </div>
        </CardHeader>
      )}
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.map((column) => (
                    <TableHead key={String(column.key)}>
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.id || index}>
                    {visibleColumns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render 
                          ? column.render(item)
                          : item[column.key as keyof T]
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

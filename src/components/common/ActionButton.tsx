
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useRoleValidation } from '@/hooks/common/useRoleValidation';
import { UserRole } from '@/types/database';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  requiredRoles: UserRole[];
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  disabledMessage?: string;
}

export function ActionButton({
  children,
  onClick,
  requiredRoles,
  variant = 'default',
  size = 'default',
  disabled = false,
  className = '',
  disabledMessage = 'Anda tidak memiliki akses untuk melakukan aksi ini'
}: ActionButtonProps) {
  const { canAccess } = useRoleValidation();
  
  const hasAccess = canAccess(requiredRoles);
  const isDisabled = disabled || !hasAccess;

  if (!hasAccess) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              disabled={true}
              className={className}
            >
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{disabledMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
}

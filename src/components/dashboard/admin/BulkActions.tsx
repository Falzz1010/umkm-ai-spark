
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Trash2, 
  Edit, 
  Download, 
  Mail, 
  MoreHorizontal,
  CheckSquare,
  Square
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkActionsProps {
  selectedItems: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalItems: number;
  itemType: 'users' | 'products' | 'ai' | 'analytics';
}

export function BulkActions({ 
  selectedItems, 
  onSelectAll, 
  onDeselectAll, 
  totalItems,
  itemType 
}: BulkActionsProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkAction = async (action: string) => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Bulk Action Completed",
      description: `${action} applied to ${selectedItems.length} items`,
    });
    
    setIsProcessing(false);
  };

  const getActions = () => {
    const commonActions = [
      { id: 'export', label: 'Export Selected', icon: Download },
      { id: 'delete', label: 'Delete Selected', icon: Trash2, variant: 'destructive' }
    ];

    switch (itemType) {
      case 'users':
        return [
          { id: 'email', label: 'Send Email', icon: Mail },
          { id: 'activate', label: 'Activate Users', icon: CheckSquare },
          ...commonActions
        ];
      case 'products':
        return [
          { id: 'activate', label: 'Activate Products', icon: CheckSquare },
          { id: 'deactivate', label: 'Deactivate Products', icon: Square },
          { id: 'edit', label: 'Bulk Edit', icon: Edit },
          ...commonActions
        ];
      default:
        return commonActions;
    }
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="font-medium">
          {selectedItems.length} selected
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={selectedItems.length === totalItems ? onDeselectAll : onSelectAll}
        >
          {selectedItems.length === totalItems ? 'Deselect All' : 'Select All'}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {getActions().slice(0, 2).map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant={action.variant as any || "outline"}
              size="sm"
              onClick={() => handleBulkAction(action.label)}
              disabled={isProcessing}
            >
              <Icon className="h-4 w-4 mr-1" />
              {action.label}
            </Button>
          );
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {getActions().slice(2).map((action) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => handleBulkAction(action.label)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

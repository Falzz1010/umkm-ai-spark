
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Trash2, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FilterPreset {
  id: string;
  name: string;
  filters: {
    category?: string;
    status?: string;
    dateRange?: string;
    type?: string;
  };
  createdAt: Date;
}

interface FilterPresetManagerProps {
  onApplyPreset: (preset: FilterPreset) => void;
  currentFilters: any;
}

export function FilterPresetManager({ onApplyPreset, currentFilters }: FilterPresetManagerProps) {
  const [presets, setPresets] = useState<FilterPreset[]>([
    {
      id: '1',
      name: 'Active Products',
      filters: { status: 'active', category: 'all' },
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'High AI Usage',
      filters: { type: 'ai', dateRange: 'last7days' },
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'New Users This Month',
      filters: { type: 'user', dateRange: 'thisMonth' },
      createdAt: new Date()
    }
  ]);
  
  const [newPresetName, setNewPresetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const { toast } = useToast();

  const saveCurrentFilters = () => {
    if (!newPresetName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a preset name",
        variant: "destructive"
      });
      return;
    }

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: newPresetName,
      filters: currentFilters,
      createdAt: new Date()
    };

    setPresets([...presets, newPreset]);
    setNewPresetName('');
    setShowSaveForm(false);
    
    toast({
      title: "Preset Saved",
      description: `Filter preset "${newPresetName}" has been saved`,
    });
  };

  const deletePreset = (presetId: string) => {
    setPresets(presets.filter(p => p.id !== presetId));
    toast({
      title: "Preset Deleted",
      description: "Filter preset has been removed",
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter Presets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <div key={preset.id} className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onApplyPreset(preset)}
              >
                {preset.name}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => deletePreset(preset.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {showSaveForm ? (
          <div className="flex gap-2">
            <Input
              placeholder="Enter preset name..."
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveCurrentFilters()}
              className="h-8"
            />
            <Button size="sm" onClick={saveCurrentFilters} className="h-8">
              <Save className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowSaveForm(false)}
              className="h-8"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSaveForm(true)}
            className="h-8"
          >
            <Save className="h-3 w-3 mr-1" />
            Save Current Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

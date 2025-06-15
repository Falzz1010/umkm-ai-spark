
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Users, Package, Bot, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  type: 'user' | 'product' | 'ai' | 'analytics';
  title: string;
  subtitle: string;
  data: any;
}

interface GlobalSearchProps {
  onResultSelect: (result: SearchResult) => void;
}

export function GlobalSearch({ onResultSelect }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filterOptions = [
    { id: 'user', label: 'Users', icon: Users, color: 'bg-blue-500' },
    { id: 'product', label: 'Products', icon: Package, color: 'bg-green-500' },
    { id: 'ai', label: 'AI Generations', icon: Bot, color: 'bg-purple-500' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [searchTerm, activeFilters]);

  const performSearch = async () => {
    setIsLoading(true);
    
    try {
      const searchResults: SearchResult[] = [];

      // Search users if filter allows
      if (activeFilters.length === 0 || activeFilters.includes('user')) {
        const { data: users } = await supabase
          .from('profiles')
          .select('*')
          .ilike('full_name', `%${searchTerm}%`)
          .limit(5);

        if (users) {
          users.forEach(user => {
            searchResults.push({
              id: user.id,
              type: 'user' as const,
              title: user.full_name || 'Unknown User',
              subtitle: user.business_name || 'No business',
              data: user
            });
          });
        }
      }

      // Search products if filter allows
      if (activeFilters.length === 0 || activeFilters.includes('product')) {
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${searchTerm}%`)
          .limit(5);

        if (products) {
          products.forEach(product => {
            searchResults.push({
              id: product.id,
              type: 'product' as const,
              title: product.name,
              subtitle: `${product.category || 'Uncategorized'} • Rp ${product.price?.toLocaleString() || '0'}`,
              data: product
            });
          });
        }
      }

      // Search AI generations if filter allows
      if (activeFilters.length === 0 || activeFilters.includes('ai')) {
        const { data: aiData } = await supabase
          .from('ai_generations')
          .select('*')
          .limit(5);

        if (aiData) {
          aiData.forEach(ai => {
            if (ai.generated_content.toLowerCase().includes(searchTerm.toLowerCase())) {
              searchResults.push({
                id: ai.id,
                type: 'ai' as const,
                title: `${ai.generation_type} Generation`,
                subtitle: `Generated ${new Date(ai.created_at).toLocaleDateString()}`,
                data: ai
              });
            }
          });
        }
      }

      // Add analytics if filter allows
      if (activeFilters.length === 0 || activeFilters.includes('analytics')) {
        if (searchTerm.toLowerCase().includes('sales') || searchTerm.toLowerCase().includes('revenue')) {
          searchResults.push({
            id: 'analytics-1',
            type: 'analytics' as const,
            title: 'Sales Analytics',
            subtitle: 'Revenue and sales data',
            data: { type: 'sales' }
          });
        }
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
    
    setIsLoading(false);
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  const getResultIcon = (type: string) => {
    const option = filterOptions.find(opt => opt.id === type);
    return option ? option.icon : Search;
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search users, products, AI generations..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-10"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border-2">
          <CardContent className="p-4">
            {/* Filters */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Filters:</span>
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = activeFilters.includes(filter.id);
                  return (
                    <Badge
                      key={filter.id}
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        isActive && filter.color
                      )}
                      onClick={() => toggleFilter(filter.id)}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {filter.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-2">
              {isLoading ? (
                <div className="py-4 text-center text-muted-foreground">
                  Searching...
                </div>
              ) : results.length > 0 ? (
                results.map((result) => {
                  const Icon = getResultIcon(result.type);
                  return (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => {
                        onResultSelect(result);
                        setIsOpen(false);
                      }}
                    >
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{result.title}</div>
                        <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                  );
                })
              ) : searchTerm ? (
                <div className="py-4 text-center text-muted-foreground">
                  No results found
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  Start typing to search...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

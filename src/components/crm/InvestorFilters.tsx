import { useState, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInvestorTags, type TagCategory } from '@/hooks/useInvestorTags';
import type { CRMFilters } from '@/hooks/useInvestorCRM';

interface InvestorFiltersProps {
  filters: CRMFilters;
  onFiltersChange: (filters: CRMFilters) => void;
}

const CATEGORY_LABELS: Record<TagCategory, string> = {
  funding_type: 'Funding Type',
  strategy: 'Strategy',
  rental_type: 'Rental Type',
  location: 'Location',
  budget: 'Budget',
  preference: 'Preferences',
};

export const InvestorFilters = ({ filters, onFiltersChange }: InvestorFiltersProps) => {
  const { data: tags } = useInvestorTags();
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);

  const tagsByCategory = useMemo(() => {
    if (!tags) return {};
    return tags.reduce((acc, tag) => {
      if (!acc[tag.category]) acc[tag.category] = [];
      acc[tag.category].push(tag);
      return acc;
    }, {} as Record<TagCategory, typeof tags>);
  }, [tags]);

  const selectedTags = useMemo(() => {
    if (!tags || !filters.tagIds) return [];
    return tags.filter(tag => filters.tagIds?.includes(tag.id));
  }, [tags, filters.tagIds]);

  const handleTagToggle = (tagId: string) => {
    const currentTagIds = filters.tagIds || [];
    const newTagIds = currentTagIds.includes(tagId)
      ? currentTagIds.filter(id => id !== tagId)
      : [...currentTagIds, tagId];
    
    onFiltersChange({ ...filters, tagIds: newTagIds.length > 0 ? newTagIds : undefined });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.tagIds?.length || filters.priorityLevel;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, location..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
            className="pl-10"
          />
        </div>

        {/* Priority Filter */}
        <Select
          value={filters.priorityLevel || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, priorityLevel: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Tag Filter Popover */}
        <Popover open={isTagFilterOpen} onOpenChange={setIsTagFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4">
                {(Object.keys(tagsByCategory) as TagCategory[]).map((category) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      {CATEGORY_LABELS[category]}
                    </h4>
                    <div className="space-y-2">
                      {tagsByCategory[category]?.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={tag.id}
                            checked={filters.tagIds?.includes(tag.id) || false}
                            onCheckedChange={() => handleTagToggle(tag.id)}
                          />
                          <Label
                            htmlFor={tag.id}
                            className="text-sm cursor-pointer flex items-center gap-2"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            {tag.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="gap-1 cursor-pointer"
              style={{ 
                backgroundColor: `${tag.color}20`,
                color: tag.color,
                borderColor: tag.color 
              }}
              onClick={() => handleTagToggle(tag.id)}
            >
              {tag.name}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

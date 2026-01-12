import { useState, useMemo } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useInvestorTags, useAssignTag, useRemoveTag, type TagCategory } from '@/hooks/useInvestorTags';
import type { InvestorTag } from '@/hooks/useInvestorTags';

interface QuickTagPopoverProps {
  investorId: string;
  assignedTags: InvestorTag[];
}

const CATEGORY_LABELS: Record<TagCategory, string> = {
  funding_type: 'Funding',
  strategy: 'Strategy',
  rental_type: 'Rental',
  location: 'Location',
  budget: 'Budget',
  preference: 'Preferences',
};

export const QuickTagPopover = ({ investorId, assignedTags }: QuickTagPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data: allTags } = useInvestorTags();
  const { mutate: assignTag, isPending: isAssigning } = useAssignTag();
  const { mutate: removeTag, isPending: isRemoving } = useRemoveTag();

  const assignedTagIds = useMemo(() => 
    new Set(assignedTags.map(t => t.id)), 
    [assignedTags]
  );

  const filteredTags = useMemo(() => {
    if (!allTags) return {};
    
    const filtered = search
      ? allTags.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase()))
      : allTags;

    return filtered.reduce((acc, tag) => {
      if (!acc[tag.category]) acc[tag.category] = [];
      acc[tag.category].push(tag);
      return acc;
    }, {} as Record<TagCategory, typeof allTags>);
  }, [allTags, search]);

  const handleToggleTag = (tag: InvestorTag) => {
    if (assignedTagIds.has(tag.id)) {
      removeTag({ investorId, tagId: tag.id });
    } else {
      assignTag({ investorId, tagId: tag.id });
    }
  };

  const isPending = isAssigning || isRemoving;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 h-7">
          <Plus className="h-3 w-3" />
          Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-2 border-b">
          <Input
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-2 space-y-3">
            {(Object.keys(filteredTags) as TagCategory[]).map((category) => (
              <div key={category}>
                <h4 className="text-xs font-medium text-muted-foreground mb-1.5 px-1">
                  {CATEGORY_LABELS[category]}
                </h4>
                <div className="space-y-0.5">
                  {filteredTags[category]?.map((tag) => {
                    const isAssigned = assignedTagIds.has(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleToggleTag(tag)}
                        disabled={isPending}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span>{tag.name}</span>
                        </div>
                        {isAssigned && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {Object.keys(filteredTags).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tags found
              </p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

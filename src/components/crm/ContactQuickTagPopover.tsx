import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tag, Check, Search } from 'lucide-react';
import { useInvestorTags, InvestorTag, TagCategory } from '@/hooks/useInvestorTags';
import { useAssignTagToContact, useRemoveTagFromContact } from '@/hooks/useCRMContacts';

interface ContactQuickTagPopoverProps {
  contactId: string;
  assignedTags: InvestorTag[];
}

const CATEGORY_LABELS: Record<TagCategory, string> = {
  funding_type: 'Funding Type',
  strategy: 'Strategy',
  rental_type: 'Rental Type',
  location: 'Location',
  budget: 'Budget',
  preference: 'Preference',
};

export const ContactQuickTagPopover = ({ contactId, assignedTags }: ContactQuickTagPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const { data: allTags } = useInvestorTags();
  const assignTag = useAssignTagToContact();
  const removeTag = useRemoveTagFromContact();

  const assignedTagIds = useMemo(() => new Set(assignedTags.map(t => t.id)), [assignedTags]);

  const filteredTags = useMemo(() => {
    if (!allTags) return {} as Record<TagCategory, InvestorTag[]>;
    
    const filtered = allTags.filter(tag => 
      tag.name.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.reduce((acc, tag) => {
      if (!acc[tag.category]) acc[tag.category] = [] as InvestorTag[];
      acc[tag.category].push(tag);
      return acc;
    }, {} as Record<TagCategory, InvestorTag[]>);
  }, [allTags, search]);

  const handleToggleTag = (tag: InvestorTag) => {
    if (assignedTagIds.has(tag.id)) {
      removeTag.mutate({ contactId, tagId: tag.id });
    } else {
      assignTag.mutate({ contactId, tagId: tag.id });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Tag className="h-3 w-3 mr-1" />
          Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {Object.entries(filteredTags).map(([category, tags]) => (
              <div key={category} className="mb-3">
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
                  {CATEGORY_LABELS[category as TagCategory] || category}
                </div>
                <div className="space-y-1">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleToggleTag(tag)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.name}</span>
                      </div>
                      {assignedTagIds.has(tag.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(filteredTags).length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">
                No tags found
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

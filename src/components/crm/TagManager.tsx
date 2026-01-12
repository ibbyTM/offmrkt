import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useInvestorTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
  type TagCategory,
  type InvestorTag,
} from '@/hooks/useInvestorTags';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CATEGORY_LABELS: Record<TagCategory, string> = {
  funding_type: 'Funding Type',
  strategy: 'Strategy',
  rental_type: 'Rental Type',
  location: 'Location',
  budget: 'Budget',
  preference: 'Preferences',
};

const PRESET_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f97316', '#ef4444', '#6366f1', '#0ea5e9',
];

export const TagManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<InvestorTag | null>(null);
  const [deleteTag, setDeleteTag] = useState<InvestorTag | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TagCategory>('funding_type');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const { data: tags } = useInvestorTags();
  const { mutate: createTag, isPending: isCreating } = useCreateTag();
  const { mutate: updateTag, isPending: isUpdating } = useUpdateTag();
  const { mutate: deleteTagMutation, isPending: isDeleting } = useDeleteTag();

  const tagsByCategory = useMemo(() => {
    if (!tags) return {};
    return tags.reduce((acc, tag) => {
      if (!acc[tag.category]) acc[tag.category] = [];
      acc[tag.category].push(tag);
      return acc;
    }, {} as Record<TagCategory, typeof tags>);
  }, [tags]);

  const resetForm = () => {
    setName('');
    setCategory('funding_type');
    setColor(PRESET_COLORS[0]);
    setEditingTag(null);
  };

  const handleEdit = (tag: InvestorTag) => {
    setEditingTag(tag);
    setName(tag.name);
    setCategory(tag.category);
    setColor(tag.color);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTag) {
      updateTag({ id: editingTag.id, name, category, color }, {
        onSuccess: () => resetForm(),
      });
    } else {
      createTag({ name, category, color }, {
        onSuccess: () => resetForm(),
      });
    }
  };

  const handleDelete = () => {
    if (deleteTag) {
      deleteTagMutation(deleteTag.id, {
        onSuccess: () => setDeleteTag(null),
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Manage Tags
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Investor Tags</DialogTitle>
          </DialogHeader>

          {/* Create/Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Label htmlFor="name">Tag Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., BRADFORD"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as TagCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CATEGORY_LABELS) as TagCategory[]).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-1 mt-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        color === c ? 'border-foreground scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={!name.trim() || isPending}>
                {editingTag ? 'Update Tag' : 'Create Tag'}
              </Button>
              {editingTag && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
            </div>
          </form>

          {/* Tags List */}
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-4">
              {(Object.keys(tagsByCategory) as TagCategory[]).map((cat) => (
                <div key={cat}>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    {CATEGORY_LABELS[cat]}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tagsByCategory[cat]?.map((tag) => (
                      <div
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-sm"
                        style={{
                          backgroundColor: `${tag.color}15`,
                          borderColor: tag.color,
                          color: tag.color,
                        }}
                      >
                        <span className="font-medium">{tag.name}</span>
                        <button
                          onClick={() => handleEdit(tag)}
                          className="ml-1 hover:opacity-70"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setDeleteTag(tag)}
                          className="hover:opacity-70"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTag} onOpenChange={() => setDeleteTag(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag "{deleteTag?.name}"? 
              This will remove it from all investors.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

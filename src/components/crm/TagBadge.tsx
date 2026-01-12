import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { InvestorTag } from '@/hooks/useInvestorTags';

interface TagBadgeProps {
  tag: InvestorTag;
  onRemove?: () => void;
  className?: string;
  size?: 'sm' | 'default';
}

export const TagBadge = ({ tag, onRemove, className, size = 'default' }: TagBadgeProps) => {
  return (
    <Badge
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1',
        className
      )}
      style={{ 
        backgroundColor: `${tag.color}20`,
        color: tag.color,
        borderColor: tag.color 
      }}
      variant="outline"
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};

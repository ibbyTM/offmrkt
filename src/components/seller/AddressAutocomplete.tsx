import { useState, useEffect, useRef } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface AddressSuggestion {
  id: string;
  address: string;
  street: string;
  city: string;
  postcode: string;
  county: string;
  country: string;
}

interface ResolvedAddress {
  street: string;
  city: string;
  postcode: string;
  county: string;
  country: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: ResolvedAddress) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing your address...",
  className,
  disabled,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value || value.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("address-lookup", {
          body: { query: value },
        });

        if (error) {
          console.error("Address lookup error:", error);
          setSuggestions([]);
        } else {
          setSuggestions(data.suggestions || []);
          setIsOpen(data.suggestions?.length > 0);
        }
      } catch (err) {
        console.error("Address lookup failed:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (suggestion: AddressSuggestion) => {
    setIsOpen(false);
    onChange(suggestion.street || suggestion.address.split(",")[0]);
    onAddressSelect({
      street: suggestion.street,
      city: suggestion.city,
      postcode: suggestion.postcode,
      county: suggestion.county,
      country: suggestion.country,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={cn("pr-10", className)}
          disabled={disabled}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id || index}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                  highlightedIndex === index
                    ? "bg-accent text-accent-foreground"
                    : "text-popover-foreground hover:bg-accent/50"
                )}
              >
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{suggestion.address}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

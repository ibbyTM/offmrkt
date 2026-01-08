import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface ComparisonContextType {
  selectedProperties: string[];
  addProperty: (id: string) => void;
  removeProperty: (id: string) => void;
  toggleProperty: (id: string) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  maxProperties: number;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_PROPERTIES = 4;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const addProperty = useCallback((id: string) => {
    setSelectedProperties((prev) => {
      if (prev.includes(id) || prev.length >= MAX_PROPERTIES) return prev;
      return [...prev, id];
    });
  }, []);

  const removeProperty = useCallback((id: string) => {
    setSelectedProperties((prev) => prev.filter((propId) => propId !== id));
  }, []);

  const toggleProperty = useCallback((id: string) => {
    setSelectedProperties((prev) => {
      if (prev.includes(id)) {
        return prev.filter((propId) => propId !== id);
      }
      if (prev.length >= MAX_PROPERTIES) return prev;
      return [...prev, id];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProperties([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedProperties.includes(id),
    [selectedProperties]
  );

  const canAddMore = selectedProperties.length < MAX_PROPERTIES;

  return (
    <ComparisonContext.Provider
      value={{
        selectedProperties,
        addProperty,
        removeProperty,
        toggleProperty,
        clearSelection,
        isSelected,
        maxProperties: MAX_PROPERTIES,
        canAddMore,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}

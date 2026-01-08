import { Link } from "react-router-dom";
import { Scale, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/contexts/ComparisonContext";
import { motion, AnimatePresence } from "framer-motion";

export function ComparisonBar() {
  const { selectedProperties, clearSelection, maxProperties } = useComparison();
  const count = selectedProperties.length;

  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-4 bg-card border border-border shadow-lg rounded-full px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Scale className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {count} of {maxProperties} selected
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
            
            <Button asChild size="sm" disabled={count < 2}>
              <Link to="/compare">
                Compare {count > 1 ? `(${count})` : ""}
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

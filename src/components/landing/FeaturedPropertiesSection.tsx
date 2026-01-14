import { Link } from "react-router-dom";
import { ArrowRight, Bed, Bath, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProperties } from "@/hooks/useProperties";
import { cn } from "@/lib/utils";
import {
  formatPrice,
  formatYield,
  strategyLabels,
  strategyColors,
  propertyTypeLabels,
} from "@/lib/propertyUtils";

export function FeaturedPropertiesSection() {
  const { data: properties, isLoading } = useProperties();

  const featuredProperties = properties?.slice(0, 3) || [];

  // Don't render if no properties and not loading
  if (!isLoading && featuredProperties.length === 0) {
    return null;
  }

  return (
    <section id="properties" className="py-20 bg-background">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Investment Opportunities
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked deals with verified documentation and strong rental yields
          </p>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/properties/${property.id}`} className="group block">
                    <Card className="overflow-hidden h-full border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-card">
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {property.photo_urls?.[0] ? (
                          <img
                            src={property.photo_urls[0]}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}

                        {/* Price Badge - Clean solid style */}
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-bold text-base px-3 py-1 shadow-md">
                          {formatPrice(property.asking_price)}
                        </Badge>

                        {/* Featured Badge (first property only) */}
                        {index === 0 && (
                          <Badge
                            variant="secondary"
                            className="absolute top-3 right-3 bg-background text-foreground shadow-md"
                          >
                            Top Pick
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-5 space-y-3">
                        {/* Title */}
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="w-4 h-4 mr-1.5 shrink-0" />
                          <span className="line-clamp-1">
                            {property.property_city}, {property.property_postcode}
                          </span>
                        </div>

                        {/* Details Row */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {property.bedrooms && (
                            <span className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              {property.bedrooms}
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              {property.bathrooms}
                            </span>
                          )}
                          <span className="capitalize">
                            {propertyTypeLabels[property.property_type] || property.property_type}
                          </span>
                        </div>

                        {/* Strategy Tags */}
                        {property.strategies && property.strategies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {property.strategies.slice(0, 3).map((strategy) => (
                              <Badge
                                key={strategy}
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium",
                                  strategyColors[strategy]
                                )}
                              >
                                {strategyLabels[strategy] || strategy}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Yield Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-sm text-muted-foreground">Gross Yield</span>
                          <span className="flex items-center font-semibold text-primary">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {formatYield(property.gross_yield_percentage)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button asChild size="lg" className="group">
            <Link to="/properties">
              View All Deals
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

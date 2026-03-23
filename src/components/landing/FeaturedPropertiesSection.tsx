import { Link } from "react-router-dom";
import { ArrowRight, Bed, Bath, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProperties } from "@/hooks/useProperties";
import { formatPrice, formatYield } from "@/lib/propertyUtils";
import { PropertyCardCarousel } from "@/components/properties/PropertyCardCarousel";
import { PropertyCardMenu } from "@/components/properties/PropertyCardMenu";

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
                <Card key={i} className="overflow-hidden rounded-xl">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
              : featuredProperties.map((property, index) => {
                const images = property.photo_urls || [];
                const monthlyRent = property.current_rental_income || property.estimated_rental_income || 0;
                const annualRent = monthlyRent * 12;
                const calculatedGrossYield = property.asking_price > 0 && annualRent > 0
                  ? (annualRent / property.asking_price) * 100
                  : null;
                const grossYield = property.gross_yield_percentage || calculatedGrossYield;
                const referenceId = property.property_reference || `OM${property.id.slice(-4).toUpperCase()}`;
                
                // Check if property was listed within last 7 days
                const isNew = property.created_at && 
                  new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                
                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/properties/${property.id}`} className="group block">
                      <Card className="overflow-hidden h-full rounded-xl border-border hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg bg-card">
                        {/* Image Container with interactive carousel */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          <PropertyCardCarousel images={images} alt={property.title} />

                          {/* Featured Badge (first property only) */}
                          {index === 0 && (
                            <Badge
                              className="absolute top-3 left-3 z-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg"
                            >
                              Top Pick
                            </Badge>
                          )}
                          
                          {/* New badge for recent listings (not on first card which has Top Pick) */}
                          {isNew && index !== 0 && (
                            <Badge 
                              className="absolute top-3 left-3 z-20 bg-success text-success-foreground text-xs font-semibold shadow-md"
                            >
                              New
                            </Badge>
                          )}

                          {/* Top-right: Options menu */}
                          <PropertyCardMenu propertyId={property.id} />
                        </div>

                        <CardContent className="p-4">
                          {/* Price row with reference ID */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-bold text-foreground">
                              {formatPrice(property.asking_price)}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              #{referenceId}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-medium text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                            {property.title}
                          </h3>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-muted-foreground mb-3">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">
                              {property.property_city}, {property.property_postcode}
                            </span>
                          </div>

                          {/* Specs row - compact */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            {property.bedrooms && (
                              <div className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                <span>{property.bedrooms}</span>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div className="flex items-center gap-1">
                                <Bath className="h-4 w-4" />
                                <span>{property.bathrooms}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-primary">
                                {formatYield(grossYield)}
                              </span>
                            </div>
                          </div>

                          {/* Action button - always visible */}
                          <Button className="w-full" variant="default">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
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

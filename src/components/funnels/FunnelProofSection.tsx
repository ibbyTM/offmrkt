import { Check, ArrowRight, Bed, MapPin, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProperties } from '@/hooks/useProperties';
import { formatPrice, formatYield } from '@/lib/propertyUtils';

import huddersfieldExterior from '@/assets/projects/huddersfield-exterior.png';
import huddersfieldBedroom from '@/assets/projects/huddersfield-bedroom.jpeg';
import huddersfieldKitchen from '@/assets/projects/huddersfield-kitchen.jpeg';
import huddersfieldBathroom from '@/assets/projects/huddersfield-bathroom.jpeg';
import specialistCareExterior from '@/assets/projects/specialist-care-exterior-clean.png';
import specialistCareKitchen from '@/assets/projects/specialist-care-kitchen.jpg';
import specialistCareBathroom from '@/assets/projects/specialist-care-bathroom.jpg';
import specialistCareGarden from '@/assets/projects/specialist-care-garden.jpg';

const completedProjects = [
  {
    title: '7 Units — Huddersfield',
    subtitle: 'Victorian building. Full refurbishment. 1 & 2 bed apartments on long-term, guaranteed-rent leases backed by the local authority.',
    tag: 'COMPLETED THIS WEEK',
    highlights: ['Guaranteed rent', 'Minimal voids', 'Long-term contracts', 'Social impact'],
    images: [huddersfieldExterior, huddersfieldBedroom, huddersfieldKitchen, huddersfieldBathroom],
  },
  {
    title: '4 Adapted Flats — Specialist Care',
    subtitle: 'Purpose-built for vulnerable residents. High-spec kitchens, safety-adapted hardware, and secure outdoor spaces. Council-backed tenants.',
    tag: 'HANDED OVER',
    highlights: ['High-spec throughout', 'Safety-adapted hardware', 'Secure outdoor spaces', 'Guaranteed rent'],
    images: [specialistCareExterior],
  },
];

export function DealStatsStrip() {
  return (
    <section className="bg-slate-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 divide-x divide-white/20 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-extrabold font-display">11</p>
            <p className="text-xs md:text-sm text-slate-400 mt-1">Units delivered this month</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold font-display">2</p>
            <p className="text-xs md:text-sm text-slate-400 mt-1">Projects in 7 days</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold font-display">100%</p>
            <p className="text-xs md:text-sm text-slate-400 mt-1">Guaranteed rent</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CompletedProjects() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">Recent completions</p>
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-10">
            Real projects. Real returns.
          </h2>

          <div className="space-y-8">
            {completedProjects.map((project, i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden md:grid md:grid-cols-2"
              >
                {/* Photo grid */}
                <div className={`grid ${project.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-0.5 bg-muted`}>
                  {project.images.slice(0, 4).map((img, j) => (
                    <img
                      key={j}
                      src={img}
                      alt={`${project.title} - photo ${j + 1}`}
                      className={`w-full object-cover ${project.images.length === 1 ? 'h-64 md:h-full' : 'h-40 md:h-48'}`}
                    />
                  ))}
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-3 text-[10px] tracking-wider font-semibold rounded-sm">
                    {project.tag}
                  </Badge>
                  <h3 className="text-xl font-bold font-display mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {project.subtitle}
                  </p>
                  <ul className="space-y-2">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedLiveDeal({ onCtaClick }: { onCtaClick: () => void }) {
  const { data: properties, isLoading } = useProperties();

  const deal = properties?.find(p => p.listing_status === 'available');
  if (isLoading || !deal) return null;

  const photo = deal.photo_urls?.[0];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">Currently available</p>
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-8">
            Live deal on the platform
          </h2>

          <div className="border rounded-lg overflow-hidden md:grid md:grid-cols-5 bg-background">
            {photo && (
              <div className="md:col-span-2 relative">
                <img src={photo} alt={deal.title} className="w-full h-56 md:h-full object-cover" />
                <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-600 text-white text-[10px] tracking-wider font-semibold rounded-sm">
                  LIVE DEAL
                </Badge>
              </div>
            )}

            <div className={`${photo ? 'md:col-span-3' : 'md:col-span-5'} p-6 md:p-8`}>
              <h3 className="text-lg font-bold font-display mb-1">{deal.title}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <MapPin className="h-3.5 w-3.5" />
                {deal.property_city}, {deal.property_postcode}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <p className="text-lg font-bold font-display">{formatPrice(deal.asking_price)}</p>
                  <p className="text-xs text-muted-foreground">Price</p>
                </div>
                {deal.gross_yield_percentage && (
                  <div>
                    <p className="text-lg font-bold font-display text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {formatYield(deal.gross_yield_percentage)}
                    </p>
                    <p className="text-xs text-muted-foreground">Gross Yield</p>
                  </div>
                )}
                {deal.bedrooms && (
                  <div>
                    <p className="text-lg font-bold font-display flex items-center gap-1">
                      <Bed className="h-4 w-4 text-muted-foreground" />
                      {deal.bedrooms}
                    </p>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                  </div>
                )}
              </div>

              <Button onClick={onCtaClick} size="sm">
                See deals like this
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

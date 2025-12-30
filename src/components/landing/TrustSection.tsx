const partners = [
  { name: "Property Partner 1", logo: "PP1" },
  { name: "Investment Group", logo: "IG" },
  { name: "Finance Solutions", logo: "FS" },
  { name: "Legal Services", logo: "LS" },
  { name: "Property Management", logo: "PM" },
  { name: "Banking Partner", logo: "BP" },
];

export function TrustSection() {
  return (
    <section className="py-16 bg-background-secondary border-y border-border">
      <div className="container">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          TRUSTED BY LEADING PROPERTY INVESTMENT COMPANIES
        </p>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex h-12 w-24 items-center justify-center rounded-lg bg-muted text-muted-foreground font-semibold text-sm transition-colors hover:text-foreground"
              title={partner.name}
            >
              {partner.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface PropertyDescriptionProps {
  description: string | null;
}

export default function PropertyDescription({ description }: PropertyDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-xl font-bold text-foreground mb-4">Property Description</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground">
        {description.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-3 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  const rounded = Math.round(rating);
  return (
    <span className={`text-accent ${className}`} aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rounded)}
      <span className="text-border">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}

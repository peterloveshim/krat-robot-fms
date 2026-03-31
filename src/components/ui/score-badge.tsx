type ScoreBadgeProps = {
  value: number;
  suffix?: string;
};

export function ScoreBadge({ value, suffix = "%" }: ScoreBadgeProps) {
  let colorClass: string;
  if (value >= 90) {
    colorClass = "text-green-400";
  } else if (value >= 50) {
    colorClass = "text-amber-400";
  } else {
    colorClass = "text-destructive";
  }

  return (
    <span className={`font-semibold font-mono text-sm ${colorClass}`}>
      {value}
      {suffix}
    </span>
  );
}

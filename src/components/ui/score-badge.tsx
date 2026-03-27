type ScoreBadgeProps = {
  value: number;
  suffix?: string;
};

export function ScoreBadge({ value, suffix = "%" }: ScoreBadgeProps) {
  let colorClass: string;
  if (value >= 90) {
    colorClass = "text-krat-green";
  } else if (value >= 50) {
    colorClass = "text-krat-amber";
  } else {
    colorClass = "text-krat-red";
  }

  return (
    <span className={`font-semibold font-mono text-sm ${colorClass}`}>
      {value}
      {suffix}
    </span>
  );
}

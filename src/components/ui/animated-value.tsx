type Props = {
  value: string | number;
  className?: string;
};

export function AnimatedValue({ value, className = "" }: Props) {
  return <span className={className}>{value}</span>;
}

type SectionHeaderProps = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <h2 className="text-[15px] font-semibold text-krat-tx">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="text-[12px] font-medium text-krat-accent hover:text-krat-accent2 transition-colors cursor-pointer"
        >
          {action}
        </button>
      )}
    </div>
  );
}

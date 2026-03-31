import type { JSX } from "react";
import { ChevronRight } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, action, onAction }: SectionHeaderProps): JSX.Element {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        {/* 강조 바 — 솔리드 흰색 */}
        <div className="w-[2px] h-4 rounded-full bg-white/30" />
        <h2 className="text-[15px] font-bold text-foreground tracking-[-0.01em]">
          {title}
        </h2>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        >
          <span>{action.replace(" →", "")}</span>
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      )}
    </div>
  );
}

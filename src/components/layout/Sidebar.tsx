"use client";

import type { JSX } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MqttStatusIndicator } from "@/components/layout/MqttStatusIndicator";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Bot,
  ClipboardList,
  AlertTriangle,
  Wrench,
  Map,
  BarChart2,
  Users,
  Zap,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: { count: number; variant: "blue" | "red" };
  phase2?: boolean;
};

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "모니터링",
    items: [
      {
        label: "대시보드",
        icon: <LayoutDashboard size={18} />,
        href: "/",
      },
      {
        label: "로봇 현황",
        icon: <Bot size={18} />,
        href: "/robots",
        badge: { count: 15, variant: "blue" },
      },
      {
        label: "미션 기록",
        icon: <ClipboardList size={18} />,
        href: "/missions",
      },
    ],
  },
  {
    title: "운영",
    items: [
      {
        label: "인시던트",
        icon: <AlertTriangle size={18} />,
        href: "/incidents",
        badge: { count: 3, variant: "red" },
      },
      {
        label: "소모품",
        icon: <Wrench size={18} />,
        href: "/consumables",
      },
    ],
  },
  {
    title: "Phase 2 (예정)",
    items: [
      { label: "구역별 현황", icon: <Map size={18} />, href: "/zones", phase2: true },
      { label: "차트/리포트", icon: <BarChart2 size={18} />, href: "/reports", phase2: true },
      { label: "상호작용 이벤트", icon: <Users size={18} />, href: "/interactions", phase2: true },
      { label: "에너지 분석", icon: <Zap size={18} />, href: "/energy", phase2: true },
      { label: "설정", icon: <Settings size={18} />, href: "/settings", phase2: true },
    ],
  },
];

function SidebarContent({ user, onLogout }: { user: User | null; onLogout: () => void }): JSX.Element {
  // full_name 메타데이터 -> 이메일 prefix -> "사용자" 순으로 폴백
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "사용자";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const role = (user?.user_metadata?.role as string | undefined) ?? "USER";

  return (
    <div className="flex flex-col h-full">
      {/* 로고 */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-black text-sm font-extrabold flex-shrink-0">
          K
        </div>
        <div>
          <div className="text-[15px] font-extrabold tracking-[-0.02em]">KRAT FMS</div>
          <div className="text-[9px] text-muted-foreground font-mono tracking-wider">v2.2 PHASE 1</div>
        </div>
      </div>

      <Separator className="bg-white/5 mb-1" />

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-1">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.12em] px-3 py-2 mt-4">
              {group.title}
            </div>
            {group.items.map((item) => (
              <NavItemButton key={item.label} item={item} />
            ))}
          </div>
        ))}
      </nav>

      <Separator className="bg-white/5" />

      {/* MQTT 연결 상태 */}
      <div className="px-5 py-2">
        <MqttStatusIndicator />
      </div>

      {/* 사용자 정보 + 로그아웃 */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1a1a1a] border border-border">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 bg-[#333]">
            {avatarInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold truncate">{displayName}</div>
            <div className="text-[10px] text-muted-foreground font-mono">{role}</div>
          </div>
          {/* 로그아웃 버튼 — optimistic: 즉시 /login 이동 */}
          <button
            type="button"
            onClick={onLogout}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
            title="로그아웃"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItemButton({ item }: { item: NavItem }): JSX.Element {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  if (item.phase2) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-muted-foreground opacity-30 pointer-events-none select-none">
        <span className="opacity-60 flex-shrink-0">{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-muted-foreground tracking-wider">
          P2
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
        isActive
          ? "bg-white/[0.06] text-foreground font-semibold"
          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
      }`}
    >
      {/* Active 인디케이터 — 좌측 바 */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full bg-white" />
      )}

      <span className={`flex-shrink-0 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>

      {item.badge ? (
        <Badge
          className={`text-[10px] px-1.5 py-0 rounded-md font-bold min-w-[20px] justify-center ${
            item.badge.variant === "red"
              ? "bg-transparent text-destructive border border-destructive/40 hover:bg-transparent"
              : "bg-transparent text-foreground border border-white/20 hover:bg-transparent"
          }`}
        >
          {item.badge.count}
        </Badge>
      ) : (
        isActive && (
          <ChevronRight size={14} className="text-muted-foreground" />
        )
      )}
    </Link>
  );
}

// 모바일 햄버거 포함 래퍼 — glass 사이드바
export function Sidebar(): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-[#111] border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setMobileOpen(true)}
        aria-label="메뉴 열기"
      >
        <Menu size={18} />
      </button>

      {/* 데스크톱 사이드바 */}
      <aside className="hidden lg:flex flex-col w-[230px] h-screen sticky top-0 bg-[#080808] border-r border-sidebar-border flex-shrink-0">
        <SidebarContent user={user} onLogout={logout} />
      </aside>

      {/* 모바일 오버레이 */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[230px] h-full bg-[#080808] border-r border-sidebar-border flex flex-col z-50">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="메뉴 닫기"
            >
              <X size={18} />
            </button>
            <SidebarContent user={user} onLogout={logout} />
          </aside>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MqttStatusIndicator } from "@/components/layout/MqttStatusIndicator";
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

function SidebarContent() {
  return (
    <div className="flex flex-col h-full">
      {/* 로고 */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="w-8 h-8 rounded-lg bg-krat-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          K
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-tight">KRAT FMS</div>
          <div className="text-[10px] text-krat-tx3 font-mono">v2.2 Phase 1</div>
        </div>
      </div>

      <Separator className="bg-krat-border mb-2" />

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-1">
            <div className="text-[10px] font-semibold text-krat-tx3 uppercase tracking-[0.08em] px-3 py-2 mt-3">
              {group.title}
            </div>
            {group.items.map((item) => (
              <NavItemButton key={item.label} item={item} />
            ))}
          </div>
        ))}
      </nav>

      <Separator className="bg-krat-border" />

      {/* MQTT 연결 상태 */}
      <div className="px-5 py-2">
        <MqttStatusIndicator />
      </div>

      {/* 사용자 정보 */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-krat-accent to-krat-purple flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0">
            강
          </div>
          <div>
            <div className="text-[13px] font-medium">강민수</div>
            <div className="text-[11px] text-krat-tx3">ADMIN</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItemButton({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  if (item.phase2) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-krat-tx2 opacity-35 pointer-events-none select-none">
        <span className="opacity-70 flex-shrink-0">{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-krat-bg3 text-krat-tx3">
          Phase 2
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
        isActive
          ? "bg-[rgba(59,130,246,0.12)] text-krat-accent"
          : "text-krat-tx2 hover:bg-[rgba(255,255,255,0.04)] hover:text-krat-tx"
      }`}
    >
      <span className={`flex-shrink-0 ${isActive ? "opacity-100" : "opacity-70"}`}>
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <Badge
          className={`text-[11px] px-1.5 py-0 rounded-full border-0 font-semibold ${
            item.badge.variant === "red"
              ? "bg-krat-red-bg text-krat-red hover:bg-krat-red-bg"
              : "bg-[rgba(59,130,246,0.15)] text-krat-accent hover:bg-[rgba(59,130,246,0.15)]"
          }`}
        >
          {item.badge.count}
        </Badge>
      )}
    </Link>
  );
}

// 모바일 햄버거 포함 래퍼
export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-krat-bg2 border border-krat-border flex items-center justify-center text-krat-tx2 hover:text-krat-tx"
        onClick={() => setMobileOpen(true)}
        aria-label="메뉴 열기"
      >
        <Menu size={18} />
      </button>

      {/* 데스크톱 사이드바 */}
      <aside className="hidden lg:flex flex-col w-[220px] h-screen sticky top-0 bg-krat-bg border-r border-krat-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* 모바일 오버레이 */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[220px] h-full bg-krat-bg border-r border-krat-border flex flex-col z-50">
            <button
              className="absolute top-4 right-4 text-krat-tx3 hover:text-krat-tx"
              onClick={() => setMobileOpen(false)}
              aria-label="메뉴 닫기"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}

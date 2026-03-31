import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { SensorTemperatureListener } from "@/components/layout/SensorTemperatureListener";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 미들웨어가 처리하지만 방어 코드로 추가
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative flex h-screen bg-background overflow-hidden">
      <SensorTemperatureListener />

      {/* 배경 오브 — 네뷸라 레이어 (더 크고 선명하게) */}
<div className="orb orb-violet orb-animate" style={{ bottom: '-20%', right: '-8%', width: '900px', height: '900px', animationDelay: '-8s' }} />
      <div className="orb orb-teal orb-animate" style={{ top: '35%', left: '25%', width: '600px', height: '600px', animationDelay: '-16s' }} />
      <div className="orb orb-magenta orb-animate" style={{ top: '10%', right: '15%', width: '500px', height: '500px', animationDelay: '-22s' }} />

      <Sidebar user={user} />
      <main className="relative z-10 flex-1 min-w-0 overflow-y-auto px-8 py-7 lg:pl-8 pl-16 pb-16">
        {children}
      </main>
    </div>
  );
}

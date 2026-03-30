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
    <div className="flex min-h-screen bg-krat-bg">
      <SensorTemperatureListener />
      <Sidebar user={user} />
      <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 lg:pl-8 pl-16 pb-16">
        {children}
      </main>
    </div>
  );
}

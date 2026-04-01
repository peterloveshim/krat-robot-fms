import { AuthGuard } from "@/components/layout/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { SensorTemperatureListener } from "@/components/layout/SensorTemperatureListener";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AuthProvider>
        <div className="relative flex h-screen bg-background overflow-hidden">
          <SensorTemperatureListener />
          <Sidebar />
          <main className="relative z-10 flex-1 min-w-0 overflow-y-auto px-8 py-7 lg:pl-8 pl-16 pb-16">
            {children}
          </main>
        </div>
      </AuthProvider>
    </AuthGuard>
  );
}

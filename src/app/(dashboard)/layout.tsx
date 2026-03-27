import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-krat-bg">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 lg:pl-8 pl-16 pb-16">
        {children}
      </main>
    </div>
  );
}

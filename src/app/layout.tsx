import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "KRAT FMS — 크라트로보틱스 로봇 관제",
  description: "아파트 단지 자율 서비스 로봇 통합 관제 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[var(--krat-bg)] text-[var(--krat-tx)] antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

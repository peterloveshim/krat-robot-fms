import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        heartbeatIntervalMs: 60000,       // 기본 25초 → 60초
        reconnectAfterMs: (tries: number) => Math.min(tries * 3000, 30000), // 3s→6s→...최대 30초
        timeout: 15000,                   // 기본 10초 → 15초
      },
    }
  );

# 에러 처리 및 서비스 안정성 규칙

## Next.js 16 Proxy (미들웨어)

### proxy.ts 기본 구조
Next.js 16에서 `middleware.ts`는 deprecated, `src/proxy.ts` 사용 (`proxy` 함수명으로 export).

```ts
export async function proxy(request: NextRequest) { ... }
export const config = { matcher: [...] };
```

### getUser() 반드시 try/catch로 감싸기

Supabase API 오류 시 proxy 함수가 throw → Next.js가 오류 루프 진입 → 빈 화면 발생.
**반드시 try/catch로 감싸고, 오류 시 login 페이지로 안내해야 한다.**

```ts
// ✅ Good
let user = null;
try {
  const result = await supabase.auth.getUser();
  user = result.data.user;
} catch {
  if (!isPublicPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("error", "service_unavailable");
    return NextResponse.redirect(loginUrl);
  }
  return supabaseResponse;
}

// ❌ Bad — throw 시 proxy 전체 crash
const { data: { user } } = await supabase.auth.getUser();
```

---

## 서버 컴포넌트에서 Supabase 쿼리 금지

대시보드 레이아웃 포함 모든 대시보드 페이지에서 서버 컴포넌트가 Supabase 쿼리를 실행하면
페이지 이동 시 네트워크 콜이 완료될 때까지 네비게이션이 블로킹된다.

```ts
// ❌ Bad — (dashboard)/layout.tsx에서 getUser() 호출 (블로킹)
export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser(); // 블로킹!
  return <Sidebar user={user} />;
}

// ✅ Good — layout은 동기 함수, user 정보는 클라이언트에서 fetch
export default function DashboardLayout({ children }) {
  return <Sidebar />; // Sidebar 내부 useEffect에서 클라이언트 fetch
}
```

### 클라이언트 컴포넌트에서 유저 정보 가져오기

```ts
// Sidebar.tsx 등 클라이언트 컴포넌트
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const supabase = createClient();
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
  });
}, []);
```

---

## 클라이언트 데이터 fetch 에러 처리

### Promise.all에 반드시 .catch() 추가

catch 없이 throw되면 unhandled rejection → React가 빈 화면 렌더링.

```ts
// ✅ Good
Promise.all([fetchRobotsClient(), ...])
  .then(([robots, ...]) => {
    setData({ robots, ..., isLoading: false, fetchError: null });
  })
  .catch((err: unknown) => {
    console.error("[Dashboard] 데이터 fetch 실패:", err);
    setData((prev) => ({
      ...prev,
      isLoading: false,
      fetchError: "서비스에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.",
    }));
  });

// ❌ Bad — catch 없음, 오류 시 빈 화면
Promise.all([...]).then(([robots, ...]) => {
  setData({ robots, ... });
});
```

### 데이터 훅에 isLoading / fetchError 상태 포함

데이터 fetch 훅은 항상 로딩/에러 상태를 노출해야 한다.

```ts
type DashboardData = {
  // ... 데이터 필드
  isLoading: boolean;
  fetchError: string | null;
};

const initialEmpty: DashboardData = {
  // ... 빈 초기값
  isLoading: true,
  fetchError: null,
};
```

### 컴포넌트에서 에러 상태 처리

```tsx
// ✅ Good — fetchError 시 안내 UI 표시
if (data.fetchError) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <AlertTriangle className="text-krat-red" size={24} />
      <p className="text-muted-foreground text-sm">{data.fetchError}</p>
      <button onClick={() => window.location.reload()}>새로고침</button>
    </div>
  );
}
```

---

## URL 파라미터 에러 메시지

login 페이지는 URL `?error=` 파라미터로 에러 메시지를 표시한다.
새로운 에러 케이스 추가 시 `CALLBACK_ERRORS` 맵에 추가할 것.

```ts
const CALLBACK_ERRORS: Record<string, string> = {
  callback_failed: "이메일 인증 링크가 만료되었거나 올바르지 않습니다.",
  service_unavailable: "서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  // 새 케이스 추가 시 여기에 등록
};
```

---

## Realtime 구독 에러 처리

구독 실패 시 반드시 채널을 닫아야 한다. 에러 핸들러 없으면 재시도 루프 발생.

```ts
// ✅ Good
channel.subscribe((status, err) => {
  if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
    console.error("[Realtime] error:", err);
    supabase.removeChannel(channel);
  }
});

// ❌ Bad
channel.subscribe();
```

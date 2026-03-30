// Supabase Auth 에러 메시지 → 한국어 변환
export function mapAuthError(message: string): string {
  if (message.includes("Email not confirmed"))
    return "이메일을 확인해주세요. 받은편지함의 인증 링크를 클릭해야 로그인이 가능합니다.";
  if (message.includes("Invalid login credentials"))
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (message.includes("User already registered"))
    return "이미 사용중인 이메일입니다.";
  if (message.includes("Email rate limit exceeded"))
    return "이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
  if (message.includes("Password should be at least"))
    return "비밀번호는 8자 이상이어야 합니다.";
  if (message.includes("over_email_send_rate_limit"))
    return "이메일 발송 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

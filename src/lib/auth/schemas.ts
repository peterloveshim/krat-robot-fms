import { z } from "zod";

// 공통 이메일 필드
const emailField = z
  .string()
  .min(1, "이메일을 입력해주세요.")
  .email("올바른 이메일 형식이 아닙니다.");

// 회원가입 비밀번호 (강도 검증 포함)
const signupPasswordField = z
  .string()
  .min(1, "비밀번호를 입력해주세요.")
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .regex(/[A-Z]/, "대문자를 1개 이상 포함해야 합니다.")
  .regex(/[a-z]/, "소문자를 1개 이상 포함해야 합니다.")
  .regex(/[0-9]/, "숫자를 1개 이상 포함해야 합니다.")
  .regex(/[^A-Za-z0-9]/, "특수문자를 1개 이상 포함해야 합니다.");

// 로그인 스키마 (서버에서 강도 검증)
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// 회원가입 스키마
export const signupSchema = z
  .object({
    email: emailField,
    password: signupPasswordField,
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

// 비밀번호 조건 체크 (회원가입 힌트 UI용)
export type PasswordCondition = {
  label: string;
  test: (pw: string) => boolean;
};

export const passwordConditions: PasswordCondition[] = [
  { label: "8자 이상", test: (pw) => pw.length >= 8 },
  { label: "대문자 1개 이상", test: (pw) => /[A-Z]/.test(pw) },
  { label: "소문자 1개 이상", test: (pw) => /[a-z]/.test(pw) },
  { label: "숫자 1개 이상", test: (pw) => /[0-9]/.test(pw) },
  { label: "특수문자 1개 이상", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Turnstile } from "@marsidev/react-turnstile";
import { Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const turnstileRef = useRef<any>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("AuthForm");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Custom validation
    if (!email) {
      setError(t("errors.emailRequired"));
      resetCaptcha();
      return;
    }
    // Custom email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("errors.emailInvalid"));
      resetCaptcha();
      return;
    }
    if (!password) {
      setError(t("errors.passwordRequired"));
      resetCaptcha();
      return;
    }
    if (!repeatPassword) {
      setError(t("errors.repeatPasswordRequired"));
      resetCaptcha();
      return;
    }
    if (password !== repeatPassword) {
      setError(t("errors.passwordsDoNotMatch"));
      resetCaptcha();
      return;
    }
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/dashboard`,
          captchaToken,
        },
      });
      debugger;
      if (error) throw error;
      router.push(`/${locale}/auth/sign-up-success`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("errors.unknown"));
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }

    function resetCaptcha() {
      setCaptchaToken(undefined);
      if (
        turnstileRef.current &&
        typeof turnstileRef.current.reset === "function"
      ) {
        turnstileRef.current.reset();
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("signup.title")}</CardTitle>
          <CardDescription>{t("signup.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("fields.email.label")}</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={t("fields.email.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={
                    !!error &&
                    (error === t("errors.emailRequired") ||
                      error === t("errors.emailInvalid"))
                  }
                  autoComplete="email"
                  className={cn(
                    error &&
                      (error === t("errors.emailRequired") ||
                        error === t("errors.emailInvalid")) &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t("fields.password.label")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!error && !password}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={
                      showPassword
                        ? t("fields.password.hide")
                        : t("fields.password.show")
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                    style={{ background: "none", border: "none" }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">
                  {t("fields.repeatPassword.label")}
                </Label>
                <div className="relative">
                  <Input
                    id="repeat-password"
                    type={showRepeatPassword ? "text" : "password"}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    aria-invalid={!!error && !repeatPassword}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={
                      showRepeatPassword
                        ? t("fields.password.hide")
                        : t("fields.password.show")
                    }
                    onClick={() => setShowRepeatPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                    style={{ background: "none", border: "none" }}
                  >
                    {showRepeatPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div className="min-h-[18px]">
                {error && (
                  <p
                    className="text-sm text-destructive font-medium"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>
              <div className="flex justify-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  options={{ language: locale }}
                  onSuccess={(token) => {
                    setCaptchaToken(token);
                  }}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("buttons.signupLoading") : t("buttons.signup")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("footer.loginPrompt")}{" "}
              <Link
                href={`/${locale}/auth/login`}
                className="underline underline-offset-4"
              >
                {t("footer.loginAction")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

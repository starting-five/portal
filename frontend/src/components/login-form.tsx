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
import { useCreateUser } from "@/hooks/useCreateUser";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { setAuthUser } from "@/store/authUserSlice";
import { getUserById } from "@/lib/api/users";
import { Turnstile } from "@marsidev/react-turnstile";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const turnstileRef = useRef<any>(null);
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const t = useTranslations("AuthForm");
  const createUserMutation = useCreateUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError(t("errors.emailRequired"));
      resetCaptcha();
      return;
    }
    // Custom email format validation (corrected regex)
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
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken,
        },
      });
      if (error) throw error;

      if (data.user) {
        // Create user in local database if needed
        try {
          const accessToken = data.session?.access_token;
          if (accessToken) {
            await createUserMutation.mutateAsync({
              id: data.user.id,
              email: data.user.email || "",
              name: data.user.user_metadata?.name || "",
              role: "user",
              phone: data.user.phone || "",
              avatar_url: data.user.user_metadata?.avatar_url || "",
              accessToken,
            });
          }
        } catch (userCreationError) {
          console.error(
            "Failed to create user in local database:",
            userCreationError
          );
          throw userCreationError;
        }

        // Fetch full user info from backend and update Redux state
        try {
          const accessToken = data.session?.access_token;
          const userId = data.user.id;
          if (accessToken && userId) {
            const fullUser = await getUserById(userId, accessToken);
            dispatch(setAuthUser(fullUser));
          } else {
            // Fallback to Supabase user info if backend fetch fails
            dispatch(
              setAuthUser({
                id: data.user.id,
                email: data.user.email || "",
                name: data.user.user_metadata?.name || "",
                role: "user",
                phone: data.user.phone || "",
                avatar_url: data.user.user_metadata?.avatar_url || "",
                watermark_url: null,
              })
            );
          }
        } catch (fetchError) {
          console.error("Failed to fetch full user info:", fetchError);
        }
      }

      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : t("errors.unknown"));
      resetCaptcha();
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
          <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
          <CardDescription>{t("login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
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
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("fields.password.label")}</Label>
                  <Link
                    href={`/${locale}/auth/forgot-password`}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error && !password}
                />
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
                  options={{
                    language: locale,
                    execution: "render",
                  }}
                  onSuccess={(token) => {
                    setCaptchaToken(token);
                  }}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("buttons.loginLoading") : t("buttons.login")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("footer.signupPrompt")}{" "}
              <Link
                href={`/${locale}/auth/sign-up`}
                className="underline underline-offset-4"
              >
                {t("footer.signupAction")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

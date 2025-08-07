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
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const t = useTranslations("AuthForm");
  const locale = useLocale();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(t("errors.emailRequired"));
      return;
    }
    // Custom email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("errors.emailInvalid"));
      return;
    }
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        captchaToken,
        redirectTo: `${window.location.origin}/${locale}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("forgotPasswordPage.successTitle")}
            </CardTitle>
            <CardDescription>
              {t("forgotPasswordPage.successDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("forgotPasswordPage.successBody")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("forgotPasswordPage.title")}
            </CardTitle>
            <CardDescription>
              {t("forgotPasswordPage.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
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
                    aria-describedby="email-error"
                    autoComplete="email"
                    className={cn(
                      error &&
                        (error === t("errors.emailRequired") ||
                          error === t("errors.emailInvalid")) &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                </div>
                <div className="min-h-[18px]">
                  {error && (
                    <p
                      id="email-error"
                      className="text-sm text-destructive font-medium"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </div>
                <div className="flex justify-center">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                    options={{ language: locale }}
                    onSuccess={(token) => {
                      setCaptchaToken(token);
                    }}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? t("buttons.sendResetLoading")
                    : t("buttons.sendReset")}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t("footer.loginPrompt")}{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  {t("footer.loginAction")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

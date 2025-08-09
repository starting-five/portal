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
import { Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const router = useRouter();
  const t = useTranslations("AuthForm");
  const locale = useLocale();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError(t("errors.passwordRequired"));
      return;
    }
    if (!repeatPassword) {
      setError(t("errors.repeatPasswordRequired"));
      return;
    }
    if (password !== repeatPassword) {
      setError(t("errors.passwordsDoNotMatch"));
      return;
    }
    const supabase = createClient();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Redirect to dashboard after successful password update, respecting locale.
      router.push(`/${locale}/dashboard`);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : t("updatePasswordPage.error")
      );
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("updatePasswordPage.title")}
          </CardTitle>
          <CardDescription>
            {t("updatePasswordPage.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">
                  {t("updatePasswordPage.passwordLabel")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby="password-error"
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
                    autoComplete="new-password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby="password-error"
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
                    id="password-error"
                    className="text-sm text-destructive font-medium"
                  >
                    {error}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? t("updatePasswordPage.buttonLoading")
                  : t("updatePasswordPage.button")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

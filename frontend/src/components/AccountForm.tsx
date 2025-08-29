"use client";

import SupabaseImageManager, {
    SupabaseImage,
} from "@/components/SupabaseImageManager";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

const accountSchema = z.object({
  name: z.string().min(1, "Name is required").optional().or(z.literal("")),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^$|^\+?[0-9\-\s]{7,20}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

export default function AccountForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: Partial<AccountFormValues>;
  onSubmit: (values: AccountFormValues) => void;
}) {
  const t = useTranslations();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: initialValues || {
      name: "",
      email: "",
      phone: "",
      avatarUrl: "",
    },
  });
  const [watermarkImage, setWatermarkImage] = React.useState<SupabaseImage[]>(
    []
  );
  const user = useSelector((state: any) => state.authUser?.user);
  const updateUser = useUpdateUser();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-6 space-y-6 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-slate-800">
          {t("AccountForm.account_settings")}
        </h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("AccountForm.name.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("AccountForm.name.placeholder")}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("AccountForm.email.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("AccountForm.email.placeholder")}
                  {...field}
                  disabled
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("AccountForm.phone.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("AccountForm.phone.placeholder")}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Watermark upload at the bottom */}
        <div>
          <FormLabel>{t("AccountForm.watermark_label")}</FormLabel>
          <SupabaseImageManager
            bucket={process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET}
            folder={user ? `uploads/${user.id}/watermark` : undefined}
            maxFiles={1}
            maxFileSize={2 * 1024 * 1024}
            initialImages={watermarkImage}
            onChange={setWatermarkImage}
            isWatermark={true}
            onUploadSuccess={(url) => {
              if (user) {
                console.log("creating watermark");
                const supabase = createClient();
                supabase.auth.getSession().then(({ data }) => {
                  const accessToken = data.session?.access_token;
                  if (accessToken) {
                    updateUser.mutate({
                      id: user.id,
                      watermark_url: url,
                      accessToken,
                    });
                  }
                });
              }
            }}
            onDeleteSuccess={() => {
              if (user) {
                const supabase = createClient();
                supabase.auth.getSession().then(({ data }) => {
                  const accessToken = data.session?.access_token;
                  if (accessToken) {
                    updateUser.mutate({
                      id: user.id,
                      watermark_url: null,
                      accessToken,
                    });
                  }
                });
              }
            }}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {t("AccountForm.save_changes")}
        </button>
      </form>
    </Form>
  );
}

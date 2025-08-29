"use client";

import AccountForm, { AccountFormValues } from "@/components/AccountForm";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { createClient } from "@/lib/supabase/client";
import { setAuthUser } from "@/store/authUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AccountFormWrapper() {
  const t = useTranslations();
  const user = useSelector((state: any) => state.authUser?.user);
  const dispatch = useDispatch();
  const updateUser = useUpdateUser();
  const supabase = createClient();

  if (!user) return null;

  async function handleAccountSubmit(values: AccountFormValues) {
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      if (!accessToken)
        throw new Error(t("AccountFormWrapper.no_access_token"));
      const result = await updateUser.mutateAsync({
        id: user.id,
        name: values.name,
        phone: values.phone,
        avatar_url: values.avatarUrl,
        accessToken,
      });
      dispatch(
        setAuthUser({ ...user, ...result, watermark_url: result.watermark_url })
      );
      toast.success(t("AccountFormWrapper.profile_updated"));
    } catch (err: any) {
      toast.error(t("AccountFormWrapper.update_failed", { error: err.message }));
    }
  }

  return (
    <div
      className="flex flex-col items-start px-8 w-full max-w-2xl"
      style={{ marginTop: "-6rem" }}
    >
      <AccountForm
        initialValues={{
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          avatarUrl: user.avatar_url || "",
        }}
        onSubmit={handleAccountSubmit}
      />
    </div>
  );
}

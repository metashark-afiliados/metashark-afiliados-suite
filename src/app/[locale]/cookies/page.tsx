// src/app/[locale]/cookies/page.tsx
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "pages.CookiePolicyPage",
  });
  return { title: t("title") };
}

export default async function CookiePolicyPage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations("pages.CookiePolicyPage");
  return (
    <LegalPageLayout
      icon="Cookie"
      title={t("title")}
      content={t.raw("content")}
    />
  );
}

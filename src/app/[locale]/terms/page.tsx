// src/app/[locale]/terms/page.tsx
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
    namespace: "pages.TermsOfServicePage",
  });
  return { title: t("title") };
}

export default async function TermsOfServicePage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations("pages.TermsOfServicePage");
  return (
    <LegalPageLayout
      icon="FileText"
      title={t("title")}
      content={t.raw("content")}
    />
  );
}

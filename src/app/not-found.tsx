// src/app/not-found.tsx
/**
 * @file src/app/not-found.tsx
 * @description Manejador de Errores 404 Global. Ha sido refactorizado a un
 *              Server Component puro y estático para máxima simplicidad y
 *              robustez, garantizando un build exitoso en Vercel.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

/**
 * @public
 * @async
 * @component NotFound
 * @description Renderiza la página 404. Obtiene los textos desde el servidor
 *              y no utiliza hooks de cliente.
 * @returns {Promise<React.ReactElement>} El componente de página 404.
 */
export default async function NotFound(): Promise<React.ReactElement> {
  const tFallback = {
    title: "Error 404: Page Not Found",
    description:
      "The page you are looking for does not exist or has been moved. Let's get you back on track.",
    backToHome: "Back to Home",
    goToDashboard: "Go to Dashboard",
  };

  let t;
  try {
    const intl = await getTranslations("pages.NotFoundPage");
    t = {
      title: intl("title"),
      description: intl("description"),
      backToHome: intl("backToHome"),
      goToDashboard: intl("goToDashboard"),
    };
  } catch (error) {
    t = tFallback;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-16 w-16 text-primary" />
        <h1 className="mt-8 text-4xl font-extrabold tracking-tighter md:text-6xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">{t.description}</p>
        <div className="mt-10 flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToHome}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              {t.goToDashboard}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
// src/app/not-found.tsx

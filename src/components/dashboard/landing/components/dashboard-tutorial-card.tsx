// src/components/dashboard/landing/components/dashboard-tutorial-card.tsx
/**
 * @file dashboard-tutorial-card.tsx
 * @description Componente de UI que renderiza una tarjeta estática con un
 *              llamado a la acción para ver tutoriales o documentación.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
import { ArrowUpRight } from "lucide-react";
import Link from "next/link"; // Usar Link de Next.js para rutas estáticas

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardTutorialCard() {
  // En una versión futura, los textos serían consumidos desde i18n
  const texts = {
    title: "Tutorials & Docs",
    description:
      "Learn how to get the most out of ConvertiKit's tools and master affiliate marketing.",
    button: "Explore Guides",
  };

  return (
    <Card className={"bg-background/50 backdrop-blur-[24px] border-border p-6"}>
      <CardHeader className="p-0 space-y-0">
        <CardTitle className="flex justify-between items-center text-xl mb-2 font-medium">
          {texts.title}
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-0 flex flex-col gap-6"}>
        <div className="text-base leading-6 text-muted-foreground">
          {texts.description}
        </div>
        <div>
          <Button
            asChild={true}
            size={"sm"}
            variant={"outline"}
            className={"flex gap-2 text-sm rounded-sm border-border"}
          >
            <Link href="/docs">
              {texts.button}
              <ArrowUpRight size={16} className={"text-muted-foreground"} />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Soporte al Usuario**: ((Implementada)) Añade un punto de entrada claro hacia la documentación, mejorando la experiencia de onboarding y reduciendo la carga de soporte.
 *
 * @subsection Melhorias Futuras
 * 1. **Full Internacionalización**: ((Vigente)) Refactorizar el componente para que reciba sus textos (`title`, `description`, `button`) a través de props, permitiendo que la página principal lo ensamble con contenido de `next-intl`.
 * 2. **Enlace Dinámico**: ((Vigente)) El `href="/docs"` podría ser obtenido desde una variable de entorno o un manifiesto de rutas para una mayor flexibilidad.
 *
 * =====================================================================
 */

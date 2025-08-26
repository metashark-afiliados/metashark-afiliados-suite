// src/app/[locale]/dashboard/sites/loading.tsx
/**
 * @file loading.tsx
 * @description Esqueleto de carga de alta fidelidad para la página "Mis Sitios".
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { Card } from "@/components/ui/card";

export default function SitesPageSkeleton(): React.ReactElement {
  return (
    <div className="space-y-6 relative animate-pulse">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-32 bg-muted rounded-md" />
          <div className="h-5 w-72 bg-muted rounded-md mt-2" />
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="h-10 w-full md:w-64 bg-muted rounded-md" />
          <div className="h-10 w-32 bg-muted rounded-md" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-40 bg-muted" />
        ))}
      </div>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Convención de Next.js:** Sigue la convención canónica para UI de carga.
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/loading.tsx

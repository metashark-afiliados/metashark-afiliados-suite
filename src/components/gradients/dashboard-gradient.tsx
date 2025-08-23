// src/components/gradients/dashboard-gradient.tsx
/**
 * @file dashboard-gradient.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza las capas
 *              de fondo (grano y desenfoques) para el layout del dashboard.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
export function DashboardGradient() {
  return (
    <>
      <div className={"dashboard-shared-top-grainy-blur"} />
      <div className={"dashboard-shared-bottom-grainy-blur"} />
      <div
        className={"grain-background dashboard-background-base h-full"}
      ></div>
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación**: ((Implementada)) La creación de este aparato resuelve el error `TS2307` en `dashboard-layout.tsx`.
 * 2. **Componente Visual Atómico**: ((Implementada)) Aísla la lógica de renderizado del fondo, manteniendo el layout principal más limpio.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación de Fondo Sutil**: ((Vigente)) Se podría utilizar `framer-motion` para animar sutilmente la opacidad o posición de los elementos de desenfoque, añadiendo un toque dinámico al fondo.
 *
 * =====================================================================
 */

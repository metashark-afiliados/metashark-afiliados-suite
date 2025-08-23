// src/components/gradients/login-gradient.tsx
/**
 * @file login-gradient.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza las capas
 *              de fondo (gradiente, grano, rejilla) para la página de autenticación.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
export function LoginGradient() {
  return (
    <div>
      <div
        className={
          "login-background-base login-gradient-background min-h-screen md:min-h-[919px]"
        }
      ></div>
      <div
        className={
          "login-background-base grain-background min-h-screen md:min-h-[919px]"
        }
      ></div>
      <div
        className={
          "login-background-base grid-bg min-h-screen md:min-h-[919px]"
        }
      ></div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente Visual Atómico**: ((Implementada)) Aísla la lógica de renderizado del fondo, manteniendo la página `LoginPage` más limpia y enfocada en el layout.
 *
 * @subsection Melhorias Futuras
 * 1. **Props de Configuración**: ((Vigente)) El componente podría aceptar props para controlar la opacidad o la intensidad de los efectos, permitiendo su reutilización en otros contextos con diferentes estéticas.
 *
 * =====================================================================
 */

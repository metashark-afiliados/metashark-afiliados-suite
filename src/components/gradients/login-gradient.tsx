// src/components/gradients/login-gradient.tsx
/**
 * @file login-gradient.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza las capas
 *              de fondo (gradiente, grano, rejilla) para la página de autenticación.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
 * 1. ((Implementada)) Componente visual atómico que aísla la lógica de renderizado del fondo, manteniendo la página de autenticación más limpia.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) El componente podría aceptar props para controlar la opacidad o la intensidad de los efectos, permitiendo su reutilización.
 *
 * =====================================================================
 */

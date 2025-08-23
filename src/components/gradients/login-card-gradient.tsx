// src/components/gradients/login-card-gradient.tsx
/**
 * @file login-card-gradient.tsx
 * @description Componente de UI atómico y de presentación puro. Renderiza los
 *              efectos visuales de desenfoque y resaltado para la tarjeta de autenticación.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
export function LoginCardGradient() {
  return (
    <>
      <div className={"login-background-base login-card-hard-blur"} />
      <div className={"login-background-base login-card-vertical-hard-blur"} />
      <div
        className={
          "login-background-base login-card-small-soft-blur md:login-card-medium-soft-blur login-card-soft-blur"
        }
      />
      <div
        className={
          "login-background-base login-card-yellow-highlight login-card-small-yellow-highlight md:login-card-medium-yellow-highlight"
        }
      />
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Visual**: ((Implementada)) Encapsula los complejos efectos de estilo de la tarjeta, simplificando el JSX del componente `LoginPage`.
 *
 * @subsection Melhorias Futuras
 * 1. **Animación con Framer Motion**: ((Vigente)) Las opacidades y posiciones de estos elementos de desenfoque podrían ser animadas sutilmente con `framer-motion` en respuesta a interacciones del usuario, como el foco en un campo de entrada.
 *
 * =====================================================================
 */

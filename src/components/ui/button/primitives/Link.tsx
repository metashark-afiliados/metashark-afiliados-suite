// src/components/ui/button/primitives/Link.tsx
import * as React from "react";
import { SlottableLink, type SlottableLinkProps } from "../../SlottableLink";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantsProps } from "../variants";

// --- CORRECCIÓN: El contrato ahora incluye las variantes de estilo ---
export type ButtonLinkProps = SlottableLinkProps & ButtonVariantsProps;

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, colorScheme, ...props }, ref) => (
    <SlottableLink
      ref={ref}
      className={cn(buttonVariants({ variant, size, colorScheme, className }))}
      {...props}
    />
  )
);
ButtonLink.displayName = "ButtonLink";
// src/components/ui/button/primitives/Link.tsx

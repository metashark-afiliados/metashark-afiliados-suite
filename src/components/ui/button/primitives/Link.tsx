// src/components/ui/button/primitives/Link.tsx
import * as React from "react";
import { SlottableLink, type SlottableLinkProps } from "../../SlottableLink";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantsProps } from "../variants";

export type ButtonLinkProps = SlottableLinkProps & ButtonVariantsProps;

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, ...props }, ref) => (
    <SlottableLink
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
ButtonLink.displayName = "ButtonLink";

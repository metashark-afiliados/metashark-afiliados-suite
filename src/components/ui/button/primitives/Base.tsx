// src/components/ui/button/primitives/Base.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantsProps } from "../variants";

export type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantsProps;

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
ButtonBase.displayName = "ButtonBase";

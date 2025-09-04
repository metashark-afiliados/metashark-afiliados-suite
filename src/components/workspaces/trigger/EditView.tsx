// src/components/workspaces/trigger/EditView.tsx
/**
 * @file EditView.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza el
 *              formulario para la edición en línea del nombre del workspace.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { type UpdateWorkspaceNameSchema } from "@/lib/validators";
import { WorkspaceNameInputField } from "../form-fields/WorkspaceNameInputField";

type FormData = z.infer<typeof UpdateWorkspaceNameSchema>;

interface EditViewProps {
  form: UseFormReturn<FormData>;
  isApiPending: boolean;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLFormElement>) => void;
}

export function EditView({
  form,
  isApiPending,
  handleBlur,
  handleKeyDown,
}: EditViewProps): React.ReactElement {
  return (
    <motion.div
      key="edit"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.15 }}
    >
      <FormProvider {...form}>
        <form
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onSubmit={(e) => e.preventDefault()}
          className="w-full"
        >
          <WorkspaceNameInputField
            register={form.register}
            errors={form.formState.errors}
            isPending={isApiPending}
            fieldName="name"
          />
        </form>
      </FormProvider>
    </motion.div>
  );
}
// src/components/workspaces/trigger/EditView.tsx

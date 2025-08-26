// src/components/sites/ViewSwitcher.tsx
/**
 * @file ViewSwitcher.tsx
 * @description Aparato de UI atómico y soberano para cambiar entre vistas.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 */
"use client";

import { LayoutGrid, List } from "lucide-react";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ viewMode, onViewChange }: ViewSwitcherProps) {
  const { tSitesPage } = useDashboardTranslations();
  return (
    <div className="hidden md:flex items-center gap-1 bg-muted p-1 rounded-md">
      <Button
        variant={viewMode === "grid" ? "background" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => onViewChange("grid")}
        aria-label={tSitesPage("header.viewGridAria")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "background" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => onViewChange("list")}
        aria-label={tSitesPage("header.viewListAria")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

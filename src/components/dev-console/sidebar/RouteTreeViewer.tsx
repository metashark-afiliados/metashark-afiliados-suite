// src/components/dev-console/sidebar/RouteTreeViewer.tsx
/**
 * @file RouteTreeViewer.tsx
 * @description Componente de presentación puro para renderizar el árbol de rutas.
 *              Recibe los datos como props.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import React from "react";
import { useTranslations } from "next-intl";
import { File, Folder } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface RouteNode {
  name: string;
  path: string;
  isPage: boolean;
  children: RouteNode[];
}

const RouteTree = ({ node }: { node: RouteNode }) => (
  <div className="pl-4 text-xs">
    <div className="flex items-center gap-2 py-1">
      {node.children.length > 0 ? (
        <Folder className="h-3 w-3" />
      ) : (
        <File className="h-3 w-3" />
      )}
      <span className={cn(node.isPage && "font-semibold text-primary/80")}>
        {node.name}
      </span>
    </div>
    <div className="border-l border-dashed border-border ml-1.5 pl-2">
      {node.children.map((child) => (
        <RouteTree key={child.path} node={child} />
      ))}
    </div>
  </div>
);

export const RouteTreeViewer = ({ routes }: { routes: RouteNode | null }) => {
  const t = useTranslations("components.dev-console.DevSidebar");

  return (
    <div className="pt-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="routes">
          <AccordionTrigger className="text-sm font-semibold">
            {t("routeViewer")}
          </AccordionTrigger>
          <AccordionContent>
            {routes ? (
              <RouteTree node={routes} />
            ) : (
              <p className="text-xs text-muted-foreground p-2">
                {t("loadingRoutes")}
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// src/components/dashboard/landing/components/dashboard-usage-card-group.tsx
/**
 * @file dashboard-usage-card-group.tsx
 * @description Componente de UI que renderiza un grupo de tarjetas con métricas
 *              de uso clave para el usuario.
 * @author Raz Podestá (adaptado de paddle-nextjs-starter-kit)
 * @version 1.0.0
 */
"use client"; // Este componente puede ser de cliente si las métricas se actualizan en tiempo real

import { Bolt, Image, Shapes, Timer } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Datos de placeholder, análogos al proyecto de referencia
const cards = [
  {
    title: "Sitios Activos",
    icon: <Shapes className={"text-muted-foreground"} size={18} />,
    value: "2",
    change: "3 disponibles en el plan Free",
  },
  {
    title: "Campañas Publicadas",
    icon: <Bolt className={"text-muted-foreground"} size={18} />,
    value: "7",
    change: "+12% este mes",
  },
  {
    title: "Visitantes Únicos (30d)",
    icon: <Timer className={"text-muted-foreground"} size={18} />,
    value: "1,234",
    change: "+5.2% desde el último período",
  },
  {
    title: "Créditos de IA Restantes",
    icon: <Image className={"text-muted-foreground"} size={18} />, // Image no es un icono válido, usaremos Sparkles
    value: "850",
    change: "Se renuevan el próximo mes",
  },
];

export function DashboardUsageCardGroup() {
  return (
    <div className={"grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2"}>
      {cards.map((card) => (
        <Card
          key={card.title}
          className={"bg-background/50 backdrop-blur-[24px] border-border p-6"}
        >
          <CardHeader className="p-0 space-y-0">
            <CardTitle className="flex justify-between items-center mb-6">
              <span className={"text-base leading-4"}>{card.title}</span>{" "}
              {card.icon}
            </CardTitle>
            <CardDescription
              className={"text-[32px] leading-[32px] text-primary"}
            >
              {card.value}
            </CardDescription>
          </CardHeader>
          <CardContent className={"p-0"}>
            <div className="text-sm leading-[14px] pt-2 text-muted-foreground">
              {card.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Métrica Atómico**: ((Implementada)) Crea la base para mostrar métricas clave en el nuevo "Hub Creativo".
 * 2. **Adaptación a Nuestro Contexto**: ((Implementada)) Los títulos y textos de las tarjetas han sido adaptados para que sean relevantes para `convertikit`.
 *
 * @subsection Melhorias Futuras
 * 1. **Datos Dinámicos**: ((Vigente)) Este componente debe ser refactorizado para aceptar un array de `cards` como prop, que será construido en la página del dashboard a partir de los datos del `DashboardContext`.
 * 2. **Icono Correcto**: ((Pendiente)) El icono `Image` de lucide-react no existe. Debe ser reemplazado por un icono apropiado como `Sparkles` para "Créditos de IA".
 *
 * =====================================================================
 */

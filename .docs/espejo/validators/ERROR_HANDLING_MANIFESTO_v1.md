// .docs/espejo/validators/ERROR_HANDLING_MANIFESTO.md
/**
 * @file .docs/espejo/validators/ERROR_HANDLING_MANIFESTO.md
 * @description Manifiesto de Arquitectura de Élite v1.0 para el Dominio de Errores.
 *              Esta es la Única Fuente de Verdad (SSoT) que define la estrategia
 *              canónica para la atomización y estandarización de los schemas de
 *              validación y los mensajes de error de i18n en ConvertiKit.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 */
# Manifiesto del Dominio de Errores: Arquitectura Atómica v1.0

## 1. Filosofía y Visión: "Composición sobre Monolitos"

La gestión de errores es un pilar de la robustez y la experiencia de desarrollador (DX) de una aplicación de élite. El monolito `ValidationErrors.schema.ts` y su correspondiente `ValidationErrors.json` son cuellos de botella arquitectónicos que violan el Principio de Responsabilidad Única (SRP) y la "Filosofía LEGO".

Nuestra visión es un sistema de errores donde cada dominio lógico (autenticación, sitios, workspaces) gestiona su propio contrato de errores de forma atómica. Estos átomos se ensamblan en una SSoT global, pero se mantienen y desarrollan de forma independiente.

## 2. La Nueva Arquitectura Canónica del Dominio de Errores

La nueva arquitectura se basa en una estructura de tres capas: Schemas Atómicos, un Ensamblador de Schemas y JSONs Atómicos.

```mermaid
graph TD
    subgraph "Capa de Contrato (Zod Schemas)"
        A1[AuthErrors.schema.ts] --> Z;
        A2[SiteErrors.schema.ts] --> Z;
        A3[WorkspaceErrors.schema.ts] --> Z;
        A4["...otros.schema.ts"] --> Z;
        Z(ValidationErrors.schema.ts);
    end

    subgraph "Capa de Contenido (i18n JSONs)"
        B1[AuthErrors.json] --> Y;
        B2[SiteErrors.json] --> Y;
        B3[WorkspaceErrors.json] --> Y;
        B4["...otros.json"] --> Y;
        Y(ValidationErrors.json);
    end
    
    subgraph "Capa de Consumo (Código)"
        Z -- Valida --> Y;
        Y -- Es consumido por --> C{useTypedTranslations('shared.ValidationErrors')};
    end
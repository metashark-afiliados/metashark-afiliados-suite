// .docs/espejo/db/manifesto-v4.md
/**
 * @file .docs/espejo/db/manifesto-v4.md
 * @description Manifiesto Canónico de la Base de Datos: Arquitectura de Élite v4.1.
 *              Este documento es la Única Fuente de Verdad (SSoT) para la estructura,
 *              lógica y filosofía de la base de datos del proyecto `metashark-afiliados`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */

# Manifiesto Canónico de la Base de Datos: Arquitectura de Élite v4.1

## 1. Filosofía Arquitectónica

La base de datos es el núcleo lógico y de seguridad de la aplicación, regida por tres principios no negociables:

1.  **Seguridad por Defecto (Zero Trust):** RLS activado en todas las tablas. El acceso se deniega por defecto y se concede explícitamente.
2.  **Integridad Relacional Absoluta:** Uso riguroso de claves foráneas, `CHECK constraints`, y `ENUMs`. Los datos huérfanos son arquitectónicamente imposibles.
3.  **Rendimiento Escalable Proactivo:** `UUIDs` para entidades públicas, indexación estratégica y lógica transaccional en RPCs.

## 2. Diagrama de Flujo Lógico: El Viaje Completo del Usuario y sus Datos

Este diagrama visualiza la arquitectura relacional completa y el flujo de creación de entidades, desde el registro del usuario hasta la publicación de una campaña.

```mermaid
graph TD
    subgraph "Flujo de Usuario (UI/Actions)"
        A[Registro / Login] --> B(Perfil Creado);
        B --> C{Crea/Selecciona Workspace};
        C --> D{Crea Sitio};
        D --> E{Crea Campaña};
        E --> F[Publica Campaña];
    end

    subgraph "Capa de Base de Datos (Entidades y Relaciones)"
        U(auth.users) -- 1:1 --> P(profiles);
        P -- 1:N (Propietario) --> W(workspaces);
        P -- M:N --> WM(workspace_members) -- M:N --> W;
        W -- 1:N --> S(sites);
        S -- 1:N --> Campaigns(campaigns);
        Campaigns -- 1:N --> VL(visitor_logs);
        S -- 1:N --> VL;
    end

    subgraph "Lógica Automatizada (Triggers y RPCs)"
        T1(on_auth_user_created) -- on INSERT --> U;
        T1 -- invokes --> RPC1(handle_new_user_setup);
        RPC1 -- crea --> P & W & WM;
    end

    style P fill:#ADFF2F,stroke:#010816,color:#010816
    style W fill:#ADFF2F,stroke:#010816,color:#010816
    style S fill:#ADFF2F,stroke:#010816,color:#010816
    style Campaigns fill:#ADFF2F,stroke:#010816,color:#010816
Análisis del Flujo y Relaciones:
Usuario a Workspace: La relación fundamental es a través de workspace_members. Un profile puede ser owner de muchos workspaces y member de muchos otros.
Workspace a Sitio: Un workspace actúa como un "tenant" que contiene múltiples sites.
Sitio a Campaña: Un site es el host para múltiples campaigns.
Automatización de Onboarding: El trigger on_auth_user_created automatiza el flujo de bienvenida, garantizando que cada nuevo usuario tenga una experiencia inicial coherente.
3. Hacia Dónde Vamos: La Próxima Evolución de Élite
La arquitectura v4.1 es la fundación. El roadmap de la base de datos debe incluir:
Billing y Monetización (Prioridad Alta):
Cómo: Introducir las tablas products, prices, subscriptions y customers para reflejar los datos de Stripe.
Por qué: Es el pilar para la monetización, permitiendo el feature gating a nivel de aplicación.
Sistema de Gamificación y Engagement:
Cómo: Implementar las tablas achievements y user_achievements.
Por qué: Aumenta la retención y el engagement del usuario.
Marketplace de Afiliados (Visión a Largo Plazo):
Cómo: Añadir affiliate_products y product_categories.
Por qué: Crea un nuevo flujo de ingresos y un foso competitivo (moat).
Optimización de visitor_logs con Particionado de Tablas:
Cómo: Implementar el particionado de tablas nativo de PostgreSQL (ej. por mes) a medida que la tabla crezca a millones de filas.
Por qué: Es la única estrategia de rendimiento viable a largo plazo para tablas de tipo log.
4. Implementación Canónica
El script src/db/schema-v4-elite.sql es la implementación canónica de la fundación de esta arquitectura. Contiene:
Infraestructura de Tablas v4.1: Todas las tablas core con sus CHECK constraints, relaciones (FK) y soft deletes.
Lógica de Onboarding Automatizada: El trigger handle_new_user_setup.
Triggers de Auditoría: La función update_updated_at_column.
Seguridad RLS Base: Políticas de seguridad a nivel de fila que protegen cada entidad.
Próximos Pasos Inmediatos:
Ejecución Exitosa: Confirmar que el script schema-v4-elite.sql se ejecuta sin errores.
Generación de Tipos: Ejecutar pnpm db:types:gen para sincronizar el código TypeScript.
Reconstrucción del Flujo de Autenticación: Proceder con la reconstrucción de la UI y la lógica de login/signup.
---

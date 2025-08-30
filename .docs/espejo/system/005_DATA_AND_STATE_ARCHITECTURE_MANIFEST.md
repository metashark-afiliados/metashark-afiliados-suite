// .docs/espejo/system/005_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/espejo/system/005_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto de Arquitectura de Datos y Estado.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Arquitectura de Datos y Estado v1.0

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que detalla la implementación técnica de la filosofía **"El Cliente es Soberano del Estado, la Base de Datos es la Guardiana de la Verdad"**, correspondiente a los **Pilares 1 y 2 de la Constitución Arquitectónica**. Su propósito es servir como una guía técnica profunda para los ingenieros sobre la arquitectura holística para la persistencia de datos, la gestión de estado en el cliente y la sincronización entre ambos.

## 2. Arquitectura del Contenido
El manifiesto se estructura en los tres pilares técnicos del ecosistema de datos:
1.  **La Base de Datos "Lean" (El Guardián):** Detalla los principios de diseño de la capa de persistencia en PostgreSQL.
2.  **La Capa de Datos del Servidor (El Intérprete):** Explica el rol del directorio `src/lib/data/` como única interfaz con la base de datos.
3.  **El Cliente Inteligente e Hiper-Resiliente (El Soberano del Estado):** Documenta la estrategia de gestión de estado con Zustand y sus middlewares para una UX de élite.

## 3. Contrato de API
- **Formato de Entrada:** Contenido consolidado del manifiesto de datos y estado obsoleto y las directivas de los Pilares 1 y 2.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT técnica detallada para la arquitectura de datos y estado.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Estrategia de Migración de Esquemas:** Documentar el proceso canónico para realizar y desplegar migraciones de esquemas de base de datos (`supabase/migrations`).
 * 2.  **Diagrama de Flujo de Datos Holístico:** Incluir el diagrama de Mermaid que ilustra el flujo completo desde la UI hasta la DB.
 * 3.  **Patrones de Cacheo Avanzado:** Detallar patrones específicos para `React.cache` y `unstable_cache`, incluyendo estrategias de revalidación por etiquetas (`revalidateTag`).
 * 4.  **Gestión de Estado Local vs. Global:** Proveer una guía sobre cuándo usar estado local de React (`useState`) versus estado global de Zustand.
 * 5.  **Offline-First con `IndexedDB`:** Esbozar una futura arquitectura que podría usar `IndexedDB` para una persistencia local más robusta y de mayor capacidad que `localStorage`.
 * 6.  **Sincronización de Estado en Tiempo Real:** Documentar el patrón para usar Supabase Realtime para sincronizar el estado entre múltiples clientes sin necesidad de recargar la página.
 * 7.  **Validación de Datos en la Capa de Datos:** Detallar cómo la capa de datos (`src/lib/data/`) puede usar schemas Zod para validar los datos que devuelve la base de datos, garantizando la integridad antes de que lleguen a las Server Actions.
 * 8.  **Manejo de Errores de Conexión a DB:** Documentar el patrón de `try/catch` y `createPersistentErrorLog` que debe ser usado en toda la capa de datos.
 * 9.  **Modelo de Datos Físico vs. Lógico:** Incluir una sección que diferencie el modelo de datos físico (tablas SQL) del modelo de datos lógico (tipos TypeScript), explicando el rol de `_supabase.generated.ts`.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/system/005_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md
PROTOCOLO DE EXCELENCIA: PLAN DE ACCIÓN DETALLADO (Revisión Holística)
Objetivo General: Nivelar todos los aparatos del proyecto "ConvertiKit" a un estándar de élite, implementando una arquitectura flexible y personalizable para la UI, consolidando la coherencia y eliminando la deuda técnica, todo ello bajo los principios de Atomicidad Radical, DRY, SOLID, Full Observabilidad y Full Internacionalización.
Filosofía de Ejecución: Cada "Tarea de Ejecución" se centrará en un aparato (o un conjunto de aparatos lógicamente acoplados) y realizará todas las mejoras pertinentes de forma holística en ese momento.
FASE 1: Cimientos de Robustez y Coherencia (CRÍTICA - Desbloqueadores Arquitectónicos)
Esta fase aborda las inconsistencias y duplicaciones más críticas en los manifiestos de esquema y configuración, que son fundamentales para la estabilidad y la seguridad de tipos de toda la aplicación.
1.1. Limpieza y Consolidación de la Capa de Base de Datos (db/)
Tarea de Ejecución: Eliminación de archivos SQL redundantes/inconsistentes en db/
Estado: ((Completada))
Archivos Afectados: db/03*types/01_enums_additive.sql, db/03_types/01_enums.sql, db/04_tables/01_profiles.sql, db/04_tables/02_workspaces.sql, db/04_tables/03_workspace_members.sql, db/04_tables/04_invitations.sql, db/04_tables/05_sites.sql, db/04_tables/06_campaigns.sql, db/04_tables/07_visitor_logs.sql, db/04_tables/08_audit_logs.sql, db/05_functions/01_handle_new_user_setup-1.sql, db/05_functions/01_handle_new_user_setup.sql, db/05_functions/02_create_site_with_owner.sql, db/05_functions/03_get_system_diagnostics_v2.sql, db/05_functions/03_get_system_diagnostics.sql, db/06_triggers/00_cleanup_auth_trigger.sql, db/06_triggers/01_on_auth_user_created_secure_wrapper_v3.sql, db/06_triggers/01_on_auth_user_created-1.sql, db/06_triggers/01_on_auth_user_created-2.sql, db/06_triggers/01_on_auth_user_created.sql, db/07_rls/01_enable_rls_and_policies.sql, db/08_migrations/01_add_plan_type_to_profiles.sql, db/00_reset_schema.sql.
Mejoras Aplicadas: Eliminación de 23 archivos SQL.
Justificación: Centraliza src/db/schema.sql como la SSoT canónica, transaccional e idempotente, eliminando redundancias, inconsistencias y riesgos de desincronización.
1.2. Consolidación y Corrección de Schemas de i18n (src/lib/validators/i18n)
Tarea de Ejecución: Normalización src/lib/validators/i18n/ContactPage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/lib/validators/i18n/ContactPage.schema.ts, src/lib/validators/i18n.schema.ts.
Mejoras Aplicadas: Sincronización completa con messages/pages/ContactPage.json (estructura anidada completa), robustez de validación (.min(1)), documentación TSDoc de élite.
Tarea de Ejecución: Normalización src/lib/validators/i18n/CookiePolicyPage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/lib/validators/i18n/CookiePolicyPage.schema.ts, src/lib/validators/i18n.schema.ts.
Mejoras Aplicadas: Sincronización completa con messages/pages/CookiePolicyPage.json (estructura anidada completa), robustez de validación (.min(1)), documentación TSDoc de élite.
Tarea de Ejecución: Normalización src/lib/validators/i18n/DisclaimerPage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/lib/validators/i18n/DisclaimerPage.schema.ts, src/lib/validators/i18n.schema.ts, src/lib/validators/i18n/ValidationErrors.schema.ts, src/messages/shared/ValidationErrors.json.
Mejoras Aplicadas: Sincronización completa con messages/pages/DisclaimerPage.json, localización y clasificación de errores de Zod (ValidationErrors.disclaimer_page*...), robustez de validación, documentación TSDoc de élite.
Tarea de Ejecución: Normalización src/lib/validators/i18n/DocsPage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/lib/validators/i18n/DocsPage.schema.ts, src/lib/validators/i18n.schema.ts, src/lib/validators/i18n/ValidationErrors.schema.ts, src/messages/shared/ValidationErrors.json. También se creó src/messages/pages/DocsPage.json
Mejoras Aplicadas: Sincronización completa con messages/pages/DocsPage.json, localización y clasificación de errores de Zod (ValidationErrors.docs*page*...), sistema de versionado de esquemas de contenido (version: z.number().default(...), .transform()), robustez de validación, documentación TSDoc de élite, campos opcionales para previsión de UI.
Tarea de Ejecución: Normalización src/lib/validators/i18n/LegalNoticePage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/lib/validators/i18n/LegalNoticePage.schema.ts, src/lib/validators/i18n.schema.ts, src/lib/validators/i18n/ValidationErrors.schema.ts, src/messages/shared/ValidationErrors.json.
Mejoras Aplicadas: Sincronización completa con messages/pages/LegalNoticePage.json, localización y clasificación de errores de Zod (ValidationErrors.legal*notice_page*...), robustez de validación, documentación TSDoc de élite.
Tarea de Ejecución: Normalización src/lib/validators/i18n/PrivacyPolicyPage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/lib/validators/i18n/PrivacyPolicyPage.schema.ts, src/lib/validators/i18n.schema.ts, src/lib/validators/i18n/ValidationErrors.schema.ts, src/messages/shared/ValidationErrors.json.
Mejoras Aplicadas: Sincronización completa con messages/pages/PrivacyPolicyPage.json, localización y clasificación de errores de Zod (ValidationErrors.privacy*policy_page*...), robustez de validación, documentación TSDoc de élite.
Tarea de Ejecución: Normalización src/lib/validators/i18n/SupportPage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/messages/pages/SupportPage.json (creado), src/lib/validators/i18n/SupportPage.schema.ts, src/lib/validators/i18n.schema.ts, src/lib/validators/i18n/ValidationErrors.schema.ts, src/messages/shared/ValidationErrors.json.
Mejoras Aplicadas: Creación y sincronización completa de schema y JSON con una estructura rica para página de soporte, localización y clasificación de errores de Zod (ValidationErrors.support*page*...), robustez de validación, documentación TSDoc de élite, campos opcionales para flexibilidad de UI.
Tarea de Ejecución: Normalización src/lib/validators/i18n/TermsOfServicePage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/lib/validators/i18n/TermsOfServicePage.schema.ts, src/lib/validators/i18n.schema.ts, src/lib/validators/i18n/ValidationErrors.schema.ts, src/messages/shared/ValidationErrors.json.
Mejoras Aplicadas: Sincronización completa con messages/pages/TermsOfServicePage.json, localización y clasificación de errores de Zod (ValidationErrors.terms*of_service_page*...), robustez de validación, documentación TSDoc de élite.
Tarea de Ejecución: Normalización src/lib/validators/i18n/UnauthorizedPage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/lib/validators/i18n/UnauthorizedPage.schema.ts, src/lib/validators/i18n.schema.ts, src/lib/validators/i18n/ValidationErrors.schema.ts, src/messages/shared/ValidationErrors.json.
Mejoras Aplicadas: Sincronización completa con una estructura rica para página de no autorizado (con contenido opcional), localización y clasificación de errores de Zod (ValidationErrors.unauthorized*page*...), robustez de validación, documentación TSDoc de élite.
Tarea de Ejecución: Normalización src/lib/validators/i18n/WikiPage.schema.ts
Estado: ((Completada))
Archivos Afectados: src/messages/pages/WikiPage.json (creado), src/lib/validators/i18n/WikiPage.schema.ts, src/lib/validators/i18n.schema.ts, src/lib/validators/i18n/ValidationErrors.schema.ts, src/messages/shared/ValidationErrors.json.
Mejoras Aplicadas: Creación y sincronización completa de schema y JSON con una estructura rica para página Wiki (con contenido y categorías opcionales), localización y clasificación de errores de Zod (ValidationErrors.wiki*page*...), robustez de validación, documentación TSDoc de élite.
Tarea de Ejecución: Eliminación de Schemas Duplicados y Obsoletos
Estado: ((Completada))
Archivos Afectados: src/lib/validators/i18n/DevSidebar.schema.ts, src/lib/validators/i18n/FeaturesSection.schema.ts, src/lib/validators/i18n/HeroSection.schema.ts, src/lib/validators/i18n/LoginForm.schema.ts, src/lib/validators/i18n/OAuthButton.schema.ts, src/lib/validators/i18n/SmartLink.schema.ts, src/lib/validators/i18n/WelcomePage.schema.ts, y src/lib/validators/i18n.schema.ts (para remover referencias).
Mejoras Aplicadas: Eliminación de 7 schemas redundantes/obsoletos, y actualización del ensamblador principal.
1.3. Normalización de Archivos de Entorno y Configuración
Tarea de Ejecución: Normalización y Unificación de archivos .env
Estado: ((Completada))
Archivos Afectados: Creación de production.env.local, eliminación de .env.local.txt.
Mejoras Aplicadas: Unificación de todas las claves en production.env.local (operativas activas, otras comentadas), sincronización con env.example, centralización de DEV_MODE_AUTH_BYPASS y DEV_MODE_BUILDER_BYPASS.
Tarea de Ejecución: Normalización public/manifest.json
Estado: ((Completada))
Archivos Afectados: public/manifest.json, creación de public/icons/icon-192x192.png y public/icons/icon-512x512.png.
Mejoras Aplicadas: Creación de íconos placeholder, sincronización de colores con tema base, documentación.
Tarea de Ejecución: Revisión package.json y pnpm-workspace.yaml
Estado: ((Pendiente))
Archivos Afectados: package.json, pnpm-workspace.yaml.
Mejoras a Aplicar:
package.json:
Sincronización de Versiones de Sentry: Verificar la compatibilidad de @sentry/nextjs (v10) con devDependencies (@sentry/cli, @sentry/webpack-plugin). Actualizar si es necesario, documentando la justificación de las versiones elegidas para asegurar una integración de Sentry de élite.
Consistencia en Autores: Asegurar que author y contributors reflejen los estándares de la empresa (Raz Podestá, L.I.A. Legacy).
pnpm-workspace.yaml:
Análisis de Monorepo: Determinar si el proyecto realmente necesita ser un monorepo. Si no, eliminar este archivo y su entrada en .gitignore (si existe). Si lo necesita, asegurar que esté configurado correctamente.
Justificación: Eliminar redundancias, asegurar la integridad de las dependencias y la configuración del proyecto.
1.4. Refactorización de Código Muerto y Redundante (Prioridad ALTA)
Tarea de Ejecución: Eliminación del ecosistema UserMenu
Estado: ((Pendiente))
Archivos Afectados: src/components/layout/sidebar/user-menu/index.ts, src/components/layout/sidebar/user-menu/UserMenu.tsx, src/components/layout/sidebar/user-menu/UserMenuContent.tsx, src/components/layout/sidebar/user-menu/UserMenuSkeleton.tsx, src/components/layout/sidebar/user-menu/UserMenuTrigger.tsx.
Mejoras a Aplicar: Eliminación de estos 5 archivos.
Justificación: Código muerto, su funcionalidad ha sido reemplazada por SidebarUserInfo.
Tarea de Ejecución: Eliminación src/components/dashboard/RecentCampaigns.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/dashboard/RecentCampaigns.tsx.
Mejoras a Aplicar: Eliminación del archivo.
Justificación: Componente redundante con RecentActivity.tsx.
Tarea de Ejecución: Eliminación de archivos UI vacíos
Estado: ((Pendiente))
Archivos Afectados: src/components/ui/FormSubmitButton.tsx, src/components/builder/panels/GlobalStylesPanel.tsx.
Mejoras a Aplicar: Eliminación de estos 2 archivos.
Justificación: Archivos vacíos, código muerto.
Tarea de Ejecución: Consolidación de componentes de Sidebar
Estado: ((Pendiente))
Archivos Afectados: src/components/layout/sidebar/NavList.tsx, src/components/dashboard/layout/sidebar.tsx, src/components/layout/DashboardSidebar.tsx.
Mejoras a Aplicar:
Análisis: Determinar la SSoT para la lista de navegación del dashboard y para la barra lateral en sí. DashboardSidebar.tsx ya es un ensamblador. src/components/dashboard/layout/sidebar.tsx parece ser la versión "legacy" del DashboardSidebarClient.
Consolidación: El objetivo es tener un único componente para la barra lateral principal y un único componente para la lista de navegación que se renderiza dentro.
Si DashboardSidebar.tsx se refiere a src/components/layout/DashboardSidebar.tsx (que actualmente es un ensamblador), entonces el conflicto es src/components/dashboard/layout/sidebar.tsx vs src/components/layout/sidebar/NavList.tsx.
Propuesta: src/components/dashboard/layout/sidebar.tsx debe ser eliminado. src/components/layout/sidebar/NavList.tsx debe ser el componente canónico para la lista de enlaces de navegación principal.
src/components/layout/DashboardSidebar.tsx (el ensamblador) consumirá SidebarLogo, WorkspaceSwitcher y NavList.
Justificación: Eliminar una brecha arquitectónica crítica por duplicación, consolidar la lógica de navegación y garantizar una única fuente de verdad.
Tarea de Ejecución: Refactorización src/components/builder/BlocksPalette.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/builder/BlocksPalette.tsx, src/components/builder/panels/PaletteItem.tsx.
Mejoras a Aplicar: BlocksPalette.tsx debe dejar de definir internamente PaletteItemPreview y PaletteItem. En su lugar, importará PaletteItem y PaletteItemPreview desde src/components/builder/panels/PaletteItem.tsx, consolidando sus definiciones canónicas.
Justificación: Eliminar duplicación y mejorar la atomicidad de BlocksPalette.tsx.
Tarea de Ejecución: Extracción JsonViewerDialog de src/components/dev-console/components/VisitorLogsTable.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/dev-console/components/VisitorLogsTable.tsx, creación de src/components/dev-console/components/JsonViewerDialog.tsx.
Mejoras a Aplicar: Mover la definición de JsonViewerDialog a su propio archivo atómico src/components/dev-console/components/JsonViewerDialog.tsx y ajustar la importación en VisitorLogsTable.tsx.
Justificación: Aumentar la atomicidad y reutilización del diálogo.
Tarea de Ejecución: Refactorización src/components/sites/DeleteSiteDialog.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/sites/DeleteSiteDialog.tsx.
Mejoras a Aplicar: Refactorizar para reutilizar el componente genérico ConfirmationDialogContent.tsx, eliminando la duplicación de código y centralizando la lógica de diálogos de confirmación.
Justificación: Reducción de código duplicado y mejora de la coherencia de la UI.
FASE 2: Personalización de UI y Experiencia de Usuario Global (ALTA - Valor Directo al Usuario)
Esta fase se centrará en implementar los mecanismos para la personalización de la UI (fuentes, disposición, iconos, apariencia), y en corregir brechas funcionales clave en el dashboard.
2.1. Implementación de Sistema de Iconos Intercambiable y Control de Estilos
Tarea de Ejecución: Abstracción de DynamicIcon para librerías intercambiables
Estado: ((Pendiente))
Archivos Afectados: src/components/ui/DynamicIcon.tsx, nuevos archivos de configuración/contexto para librerías.
Mejoras a Aplicar:
src/components/ui/DynamicIcon.tsx: Refactorizar para que, en lugar de importar lucide-react directamente, consuma un mapa de iconos/cargador de iconos de un IconLibraryContext.
Nuevo src/lib/context/IconLibraryContext.tsx: Crear un contexto para proveer el mapa de iconos activo (ej. { icons: Record<string, React.ElementType> }).
Nueva Configuración src/config/icon-libraries.config.ts: Definir un manifiesto de librerías de iconos soportadas (ej. [{ id: 'lucide', packageName: 'lucide-react', ... }]).
Nuevo src/lib/hooks/useIconLibrary.ts: Hook que cargue dinámicamente la librería de iconos seleccionada y exponga un mapa de sus iconos.
Implementar IconLibrarySwitcher: Un componente en la UI (ej. en DashboardHeader o Settings) que permita al usuario seleccionar la librería de iconos activa, persistiendo la preferencia (ej. en profiles.dashboard_layout).
Justificación: Permitir al usuario cambiar la apariencia del sitio web y los "aparatos" a voluntad, empezando por la selección de la librería de iconos. Preparación para migrar a otras librerías de iconos como @tabler/icons-react o react-icons.
2.2. Conexión de Datos Reales al Dashboard (Prioridad CRÍTICA)
Tarea de Ejecución: Refactorización src/components/layout/dashboard.loader.ts
Estado: ((Pendiente))
Archivos Afectados: src/components/layout/dashboard.loader.ts, src/middleware/handlers/auth/index.ts (para desactivar bypass), src/middleware/lib/routing-manifest-edge.ts (para desactivar bypass).
Mejoras a Aplicar:
Eliminar Bypass de Seguridad: Remover process.env.DEV_MODE_AUTH_BYPASS === "true" y DEV_MODE_BUILDER_BYPASS === "true". En su lugar, el dashboard.loader.ts realizará verificaciones de autenticación reales. Los bypass se gestionarán exclusivamente desde production.env.local.
Obtención de Datos Reales: Implementar la lógica para:
Obtener la lista de workspace_members para el activeWorkspace.
Obtener el conteo de sitios activos y campañas publicadas.
Obtener logs de visitantes para calcular métricas de uso (ej. visitantes únicos en 30 días).
Obtener el balance de créditos de IA del usuario.
Asegurar que DashboardLayoutData se hidrate con estos datos reales.
Justificación: El dashboard mostrará información relevante y funcional, crucial para la utilidad del producto. Elimina un riesgo de seguridad.
Tarea de Ejecución: Actualización src/components/dashboard/landing/components/dashboard-team-members-card.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/dashboard/landing/components/dashboard-team-members-card.tsx.
Mejoras a Aplicar: Refactorizar para consumir la lista de miembros de useDashboard(), reemplazando los datos mockeados hardcodeados. Mostrar el rol de cada miembro.
Justificación: Mostrar información real del equipo, mejorando la utilidad.
Tarea de Ejecución: Actualización src/components/dashboard/landing/components/dashboard-usage-card-group.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/dashboard/landing/components/dashboard-usage-card-group.tsx.
Mejoras a Aplicar: Refactorizar para consumir las métricas reales (sitios, campañas, visitantes, créditos) desde useDashboard(). Implementar animación de contador para los valores.
Justificación: El dashboard mostrará métricas reales y dinámicas.
2.3. Implementación de Lógica de Chat con IA (src/components/feedback/LiaChatInterface.tsx) (Prioridad CRÍTICA)
Tarea de Ejecución: Implementación completa del Chat de L.I.A.
Estado: ((Pendiente))
Archivos Afectados: src/components/feedback/LiaChatInterface.tsx, creación de src/lib/actions/lia.actions.ts, potencial src/lib/data/lia.data.ts.
Mejoras a Aplicar:
src/components/feedback/LiaChatInterface.tsx: Implementar useState para el historial de mensajes. Conectar handleSubmit a sendLiaMessageAction. Renderizar burbujas de chat.
src/lib/actions/lia.actions.ts: Crear una Server Action que interactúe con un modelo de IA (ej. Vercel AI SDK, OpenAI/Gemini API).
Justificación: Activar una funcionalidad central del asistente L.I.A.
2.4. Internacionalización Completa de Textos Quemados (Prioridad ALTA)
Tarea de Ejecución: Internacionalización src/components/blog/BlogPostCard.tsx y src/components/blog/FeaturedPost.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/blog/BlogPostCard.tsx, src/components/blog/FeaturedPost.tsx, src/lib/validators/i18n/BlogPage.schema.ts, src/messages/pages/BlogPage.json.
Mejoras a Aplicar: Reemplazar textos hardcodeados ("Read More", "Featured Post", "Read Full Story") con claves de i18n y actualizar schemas y JSON.
Justificación: Cumplir el protocolo de i18n completa.
Tarea de Ejecución: Internacionalización src/components/dashboard/WelcomeHero.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/dashboard/WelcomeHero.tsx, src/lib/validators/i18n/WelcomeHero.schema.ts, src/messages/components/dashboard/WelcomeHero.json.
Mejoras a Aplicar: Reemplazar clearAriaLabel hardcodeado con clave de i18n y actualizar schemas y JSON.
Justificación: Cumplir el protocolo de i18n completa.
Tarea de Ejecución: Internacionalización de mensajes de error en Server Actions
Estado: ((Pendiente))
Archivos Afectados: src/lib/actions/auth.actions.ts, src/lib/actions/admin.actions.ts, src/lib/actions/invitations.actions.ts, src/lib/actions/onboarding.actions.ts, src/lib/actions/password.actions.ts, src/lib/actions/sites.actions.ts, src/lib/actions/workspaces.actions.ts, y src/lib/validators/i18n/ValidationErrors.schema.ts, src/messages/shared/ValidationErrors.json (para agregar claves).
Mejoras a Aplicar: Reemplazar todos los strings de error quemados con claves de i18n (ej. ValidationErrors.error_cannot_impersonate_self). Esto implica definir nuevas claves de error para cada mensaje hardcodeado.
Justificación: Cumplir el protocolo de i18n completa y mejorar la mantenibilidad de los mensajes de error, usando el patrón de clasificación por dominio ya establecido.
2.5. Optimización de Rendimiento en UI con Listas Grandes (Prioridad ALTA)
Tarea de Ejecución: Virtualización src/components/resources/IconGalleryClient.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/resources/IconGalleryClient.tsx.
Mejoras a Aplicar: Implementar virtualización de la cuadrícula con @tanstack/react-virtual para manejar miles de iconos de forma eficiente.
Justificación: Mejora crítica de rendimiento para la UX.
FASE 3: Refinamientos y Mejoras Acumulativas (MEDIA/BAJA - Perfeccionamiento Continuo)
Esta fase aborda las mejoras restantes, refinamientos de DX y optimizaciones incrementales, propagando las mejores prácticas a lo largo del proyecto.
3.1. Nivelación de Componentes de Formulario (src/components/contact/ContactForm.tsx)
Tarea de Ejecución: Refactorización src/components/contact/ContactForm.tsx
Estado: ((Pendiente))
Archivos Afectados: src/components/contact/ContactForm.tsx, creación de componentes atómicos de campos de formulario (ej. src/components/shared/form-fields/TextInputField.tsx, SelectField.tsx).
Mejoras a Aplicar: Utilizar componentes de UI de Shadcn/UI (Input, Select, Textarea) y abstraer los campos a componentes atómicos reutilizables (siguiendo el patrón EmailInputField de workspaces).
Justificación: Mejorar la consistencia visual, reducir la verbosidad y adherirse al DRY.
3.2. Propagación de Mejoras Específicas
Tarea de Ejecución: Implementación de EditableText en componentes de Builder
Estado: ((Pendiente))
Archivos Afectados: src/components/builder/BuilderHeader.tsx (para el título de creación), src/components/sites/SiteCardHeader.tsx (para el nombre del sitio).
Mejoras a Aplicar: Reemplazar los elementos de texto con EditableText para permitir la edición en línea.
Justificación: Mejora directa de la UX de edición.
Tarea de Ejecución: Abstracción JsonViewerDialog
Estado: ((Pendiente))
Archivos Afectados: src/components/dev-console/components/VisitorLogsTable.tsx, src/components/dev-console/components/JsonViewerDialog.tsx (creado).
Mejoras a Aplicar: Extraer la definición de JsonViewerDialog a su propio archivo atómico, ajustando la importación.
Justificación: Mayor atomicidad y reutilización.
Tarea de Ejecución: Implementación de Tooltips e Iconos Dinámicos
Estado: ((Pendiente))
Archivos Afectados: Varios componentes de UI (ej. ActionCard.tsx, PasswordStrengthMeter.tsx, IconCard.tsx).
Mejoras a Aplicar: Implementar Tooltip donde se sugirió en la auditoría y asegurar el consumo de DynamicIcon con flexibilidad.
Justificación: Mejorar la UX y la información contextual.
3.3. Refinamientos de Tipado y Observabilidad
Tarea de Ejecución: Eliminación as any restantes
Estado: ((Pendiente))
Archivos Afectados: Varios hooks y Server Actions.
Mejoras a Aplicar: Revisar y, si es posible, eliminar aserciones de tipo as any restantes, especialmente para claves de errores de i18n (una vez completada la Fase 2.4).
Justificación: Aumentar la seguridad y pureza de tipos.
La presentación del "PROTOCOLO DE EXCELENCIA: PLAN DE ACCIÓN DETALLADO (Revisión Holística)" ha finalizado.

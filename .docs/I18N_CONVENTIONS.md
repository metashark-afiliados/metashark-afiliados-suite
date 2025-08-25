Manifiesto Canónico de Internacionalización: Arquitectura IMAS v3.0 (Definitiva)
1. Filosofía Arquitectónica
La arquitectura de internacionalización (i18n) de ConvertiKit, IMAS, se rige por los siguientes principios no negociables, alineados con SOLID, DRY y la "Filosofía LEGO":
Soberanía de Namespace: Cada aparato (.tsx) que necesite texto debe ser responsable de cargar únicamente su propio namespace. Un namespace se define por la ruta del archivo espejo en src/messages/ (ej. components.layout.LandingHeader para LandingHeader.tsx).
Cero Acoplamiento Cruzado: Se prohíbe explícitamente que un aparato (ej. login/page.tsx) cargue el namespace de otro aparato (ej. signup/page.tsx). Esta es la causa raíz de los errores y la deuda técnica.
Inyección de Dependencia Textual (IDT): Si un componente Orquestador (ej. src/app/[locale]/dashboard/layout.tsx) renderiza un componente Hijo (ej. PrimarySidebar.tsx) que necesita textos, el Orquestador es responsable de cargar todos los namespaces necesarios (DashboardSidebar.json) y pasar las funciones t o los textos pre-renderizados como props al componente Hijo.
SSoT Múltiple y Cohesionada: La integridad del sistema se mantiene mediante un conjunto de SSoT que trabajan en conjunto:
SSoT de Estructura: La estructura de directorios en src/messages/.
SSoT de Carga: El manifiesto src/messages/manifest.ts.
SSoT de Contrato: Los schemas de Zod en src/lib/validators/i18n/.
SSoT de Consumo: El hook useTranslations (o useTypedTranslations) como única vía de acceso.
2. El Patrón de Élite: Reglas de Implementación Canónicas
Regla 1: El Componente de UI Primitivo (Átomo Puro)
Ejemplos: Button.tsx, Input.tsx, ConfirmationDialog.tsx, OAuthButtonGroup.tsx.
Implementación:
NUNCA debe llamar a useTranslations.
DEBE recibir todo su contenido textual (etiquetas, placeholders, etc.) a través de props.
Debe ser 100% agnóstico a la i18n.
Regla 2: El Componente de UI Atómico / Ensamblador
Ejemplos: SignUpEmailField.tsx, LiaChatWidget.tsx, WorkspaceTrigger.tsx.
Implementación:
PUEDE y DEBE llamar a useTranslations para cargar su propio y único namespace (ej. useTranslations("components.feedback.LiaChatWidget")).
NUNCA debe cargar namespaces de otros componentes o páginas.
Regla 3: El Orquestador de UI / Página
Ejemplos: src/app/[locale]/login/page.tsx, src/components/layout/DashboardLayout.tsx.
Implementación:
PUEDE y DEBE llamar a useTranslations para cargar su propio namespace Y los namespaces de los componentes hijos que orquesta.
DEBE construir objetos de props (ej. signupFormTexts) y pasarlos a los componentes hijos, cumpliendo con el principio de IDT.
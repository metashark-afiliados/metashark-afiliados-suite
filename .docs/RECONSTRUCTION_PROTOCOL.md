// .docs/RECONSTRUCTION_PROTOCOL.md

# Protocolo de Reconstrucción de Élite: Operación "Phoenix"

**ID del Documento:** LIA-DOC-PHOENIX-1.0
**Fecha:** 2025-08-11
**Autor:** L.I.A. Legacy
**Estado:** En Ejecución

---

## 1. Resumen Ejecutivo de la Misión

Este documento sirve como la **Única Fuente de Verdad** para la operación de reconstrucción del proyecto `metashark-afiliados`. Tras un incidente de pérdida de datos del repositorio, estamos ejecutando una transcripción controlada y de alta fidelidad desde un snapshot canónico del proyecto primitivo.

El objetivo no es simplemente recuperar el código, sino **reconstruirlo a un estándar de élite**, aplicando los principios de nuestro protocolo de excelencia en cada paso. Este proceso garantiza que el producto final no solo sea funcionalmente idéntico, sino arquitectónicamente superior, más robusto y preparado para la escalabilidad.

## 2. El Protocolo de Reconstrucción (Prompt Canónico)

_Este es el conjunto de directivas que rigen mi operación. Debe ser incluido en cada interacción para mantener el estado y el contexto._

---

**PROMPT DE SISTEMA: L.I.A. LEGACY - PROTOCOLO DE RECONSTRUCCIÓN DE ÉLITE**

**IDENTIDAD Y CONTEXTO:**
Eres L.I.A. Legacy, la ingeniera de software a cargo de la reconstrucción del proyecto "metashark-afiliados". Tu fuente de verdad canónica es el snapshot `2025-08-10-15-48-22_marketing-afiliados-snapshot.txt`. El estado actual del proyecto recuperado es tu punto de partida. La misión es transcribir y mejorar, nunca degradar.

**FILOSOFÍA Y MENTALIDAD (INQUEBRANTABLE):**

1.  **Principio de No Regresión Absoluta:** La nueva versión de un archivo debe ser 100% compatible con su versión primitiva. Toda la funcionalidad y contratos de exportación deben ser preservados. Cualquier desviación debe ser una mejora explícita y documentada.
2.  **Principio de Atomicidad Radical (Filosofía LEGO):** Cada aparato (componente, hook, acción) debe ser una "pieza de Lego" autocontenida, reutilizable y con una única responsabilidad, cumpliendo los principios DRY y SOLID.
3.  **Análisis Profundo y Persistente (SSoT):** El snapshot primitivo es la fuente de verdad para la lógica. El snapshot actual es la fuente de verdad para el progreso. Antes de transcribir, se deben entender las dependencias para asegurar una integración perfecta.
4.  **Mejora Continua Incansable:** Cada aparato transcrito debe ser elevado a un estándar de élite. Esto incluye:
    - **Full Observabilidad:** Instrumentación completa con `logger` para `trace`, `info`, `warn` y `error`.
    - **Full Internacionalización (i18n):** Cero texto codificado en duro. Todo el contenido visible por el usuario debe provenir de la capa de `next-intl`.
    - **Documentación TSDoc de Élite:** Documentación verbosa y precisa para cada aparato exportado.
5.  **Adopción de la Nueva Arquitectura `src/`:** Todas las rutas de archivo deben ser transcritas a la nueva estructura canónica `src/`, actualizando todas las importaciones relativas y absolutas para que coincidan.

**PROTOCOLO DE OPERACIÓN:**

1.  **Auditoría Continua:** En cada interacción, analizar el estado actual y los errores reportados para validar el progreso y recalibrar el plan si es necesario.
2.  **Ejecución Secuencial Atómica:** Entregar siempre un único "aparato" (archivo de código) a la vez, listo para ser copiado y pegado, siguiendo un plan lógico basado en dependencias.
3.  **Reporte Post-Código Mandatorio:** Cada entrega de código debe ir seguida de un reporte estructurado que incluya:
    - **Análisis de Impacto:** Cómo el nuevo aparato afecta al sistema.
    - **Métrica LOC:** `LOC Anterior: XX | LOC Atual: YY`, con justificación para cualquier cambio.
    - **Declaración de Errores Resueltos:** Indicar explícitamente qué errores de compilación reportados resuelve el nuevo aparato.

---

## 3. Estado Actual de la Reconstrucción (2025-08-11)

Hemos establecido con éxito una base renderizable (`pnpm run dev` es funcional). La "Operación First Render" ha sido un éxito.

**Progreso Detallado:**

- **[✅] Capa de Tipos (`src/lib/types`):** 100% Reconstruida.
- **[✅] Capa de Lógica de Servidor (`src/lib/`):**
  - **[✅] `supabase`:** 100% Reconstruido.
  - **[✅] `logging`:** 100% Reconstruido.
  - **[✅] `auth`:** 100% Reconstruido.
  - **[✅] `data`:** 100% Reconstruido.
  - **[✅] `actions`:** 100% Reconstruido.
  - **[✅] `i18n` (lógica):** 100% Reconstruido.
  - **[✅] `hooks`:** 100% Reconstruido.
  - **[⏳] `builder`:** 50% Reconstruido (solo tipos y definiciones).
- **[✅] Capa de Componentes de UI Base (`src/components/ui`):** 100% Reconstruida.
- **[✅] Capa de Estilos (`src/styles`):** 100% Reconstruida.
- **[✅] Estructura de `app` Mínima:** `RootLayout`, `LocaleLayout`, y `HomePage` mínima renderizable.
- **[⏳] Capa de Componentes Lógicos (`src/components/`):**
  - **[✅] `workspaces`:** 100% Reconstruido.
  - **[✅] `dashboard`:** 100% Reconstruido.
  - **[✅] `landing`:** 66% Reconstruido (`Hero`, `Features`).
- **[❌] Infraestructura de Pruebas (`tests/`):** 0% Reconstruida.

## 4. Roadmap de Élite (Secuencia Priorizada)

El foco inmediato es completar la reconstrucción de la UI para tener paridad funcional con el snapshot primitivo. Las pruebas se abordarán como una fase dedicada una vez que la funcionalidad esté restaurada.

**Fase 1: Completar la UI de la Landing Page (2 aparatos restantes)**

1.  **`src/components/layout/LandingFooter.tsx`:** Reconstruir el pie de página.
2.  **`src/app/[locale]/page.tsx` (Actualización):** Ensamblar la `HomePage` completa.

**Fase 2: Reconstruir el Flujo de Autenticación (4 aparatos restantes)**

1.  **`src/app/[locale]/auth/layout.tsx`**
2.  **`src/components/auth/LoginForm.tsx`**
3.  **`src/app/[locale]/auth/login/page.tsx`**
4.  Reconstruir el flujo de `signup` análogamente.

**Fase 3: Reconstruir el Dashboard y Flujos Internos (Prioridad Alta)**

1.  **`src/app/[locale]/dashboard/layout.tsx`**
2.  **`src/components/layout/DashboardHeader.tsx` y `DashboardSidebar.tsx`**
3.  **Flujo de `sites` y `campaigns`**

**Fase 4: Reconstruir el Constructor de Campañas (El Núcleo)**
_Esta es la fase más compleja y se abordará una vez que el resto de la aplicación esté estable._

**Fase 5: Blindaje con Pruebas de Élite**
_Una vez restaurada la funcionalidad, se reconstruirá la infraestructura de pruebas y se crearán suites para cada aparato._

---

Este documento establece el plan. Procederé con la **Fase 1: Completar la UI de la Landing Page**, comenzando con el `LandingFooter`.

Solicitud de continuación.

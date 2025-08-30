// .docs/system/008_ROUTING_AND_NAVIGATION_MANIFEST.md
/\*\*

- @file .docs/system/008_ROUTING_AND_NAVIGATION_MANIFEST.md
- @description Manifiesto de Rutas y Navegación v2.0.
-              Esta es la SSoT que define todas las rutas de la aplicación,
-              tanto las actuales como las futuras, listas para navegación
-              directa en un entorno de desarrollo local.
- @author RaZ Podestá (Arquitecto)
- @version 2.0.0
  \*/

# Manifiesto de Rutas y Navegación v2.0

## 1. Filosofía de Enrutamiento

Nuestra estructura de rutas es semántica y predecible, siguiendo las convenciones del `App Router` de Next.js. Este documento proporciona una lista exhaustiva de endpoints para facilitar el desarrollo, las pruebas y la navegación directa sin necesidad de recorrer el flujo de la UI.

**Nota:** Todas las rutas incluyen el `locale` `pt-BR` como ejemplo. Reemplazar según sea necesario. Para rutas dinámicas, se utilizan IDs del estado mockeado (`database-state.ts`).

---

## 2. Rutas Públicas y Legales

### 2.1. Navegación Principal

- **Página de Inicio:** `http://localhost:3000/pt-BR/`
- **Sobre Nosotros:** `http://localhost:3000/pt-BR/about`
- **Blog:** `http://localhost:3000/pt-BR/blog`
- **Contacto:** `http://localhost:3000/pt-BR/contact`

### 2.2. Documentos Legales

- **Términos de Servicio:** `http://localhost:3000/pt-BR/terms`
- **Política de Privacidad:** `http://localhost:3000/pt-BR/privacy`
- **Política de Cookies:** `http://localhost:3000/pt-BR/cookies`
- **Descargo de Responsabilidad:** `http://localhost:3000/pt-BR/disclaimer`

---

## 3. Flujo de Autenticación

- **Inicio de Sesión:** `http://localhost:3000/pt-BR/login`
- **Registro:** `http://localhost:3000/pt-BR/signup`
- **Aviso Post-Registro:** `http://localhost:3000/pt-BR/auth-notice`
- **Olvido de Contraseña:** `http://localhost:3000/pt-BR/forgot-password`
- **Restablecer Contraseña:** `http://localhost:3000/pt-BR/reset-password`

---

## 4. Ecosistema del "Workspace Creativo" (Dashboard)

### 4.1. Vistas Principales

- **Hub Creativo (Inicio):** `http://localhost:3000/pt-BR/dashboard`
- **Gestión de Sitios:** `http://localhost:3000/pt-BR/dashboard/sites`
- **Gestión de Campañas (de un Sitio):** `http://localhost:3000/pt-BR/dashboard/sites/site-001/campaigns`

### 4.2. El Constructor Visual (`Builder`)

- **Editor de `Creation`:** `http://localhost:3000/pt-BR/builder/creation-001`
- **Flujo de Nueva `Creation` (Boilerplate):** `http://localhost:3000/pt-BR/builder/new?type=landing-page`

### 4.3. Gestión de Cuenta y Workspace (Rutas Futuras)

- **Ajustes del Perfil:** `http://localhost:3000/pt-BR/dashboard/settings/profile`
- **Ajustes del Workspace:** `http://localhost:3000/pt-BR/dashboard/settings/workspace`
- **Gestión de Facturación (Billing):** `http://localhost:3000/pt-BR/dashboard/settings/billing`
- **Gestión de Brand Kits:** `http://localhost:3000/pt-BR/dashboard/brand`

---

## 5. Herramientas de Desarrollo y Administración (`Dev Console`)

- **Página Principal:** `http://localhost:3000/pt-BR/dev-console`
- **Gestión de Usuarios:** `http://localhost:3000/pt-BR/dev-console/users`
- **Visor de Campañas Global:** `http://localhost:3000/pt-BR/dev-console/campaigns`
- **Visor de Telemetría:** `http://localhost:3000/pt-BR/dev-console/telemetry`
- **Librería de Recursos (Iconos):** `http://localhost:3000/pt-BR/dashboard/resources/icons`
- **Visor de Logs de Auditoría (Ruta Futura):** `http://localhost:3000/pt-BR/dev-console/audit-logs`
- **Gestión de Feature Flags (Ruta Futura):** `http://localhost:3000/pt-BR/dev-console/feature-flags`

// .docs/system/008_ROUTING_AND_NAVIGATION_MANIFEST.md

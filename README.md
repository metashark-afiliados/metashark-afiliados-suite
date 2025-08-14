// README.md
<p align="center">
  <a href="https://convertikit.com" target="_blank">
    <img src="https://raw.githubusercontent.com/razpodesta/marketing-afiliados/main/public/images/logo.png" alt="Logo de ConvertiKit" width="150"/>
  </a>
</p>

<h1 align="center">ConvertiKit: Plataforma SaaS de Marketing de Afiliados con IA</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.3.0-blue.svg" alt="Version 1.3.0">
  <img src="https://img.shields.io/badge/Status-Active%20Development-green.svg" alt="Status: Active Development">
  <img src="https://img.shields.io/badge/Architecture-Remote--First-purple.svg" alt="Architecture: Remote-First">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey.svg" alt="License: MIT">
</p>

> **Nuestra Misión:** Transformar fundamentalmente el marketing de afiliados, pasando de un juego de volumen y conjeturas a una disciplina de precisión, velocidad e inteligencia. ConvertiKit no es solo una herramienta; es el copiloto estratégico para la próxima generación de marketers.

---

### **1. Resumen Ejecutivo del Proyecto**

**ConvertiKit** es una plataforma SaaS (Software as a Service) multi-tenant de nivel de producción, construida sobre un stack tecnológico de élite (Next.js, Supabase, Vitest). Sirve como una base de código canónica que demuestra la implementación robusta y escalable de funcionalidades complejas como subdominios dinámicos, un constructor visual de páginas, autenticación segura con RLS, e internacionalización completa.

---

### **2. Arquitectura y Filosofía Técnica**

Nuestra visión de producto está respaldada por una arquitectura de software de nivel empresarial, diseñada para la velocidad, la seguridad y la escalabilidad masiva.

> #### **Filosofía Canónica: "Remote-First"**
>
> Este proyecto opera exclusivamente con entornos de base de datos **remotos** gestionados por Supabase. **No se utiliza ni se soporta una base de datos local.** Esta decisión estratégica garantiza la paridad total entre los entornos de desarrollo, pruebas y producción, eliminando la clase entera de bugs de "funciona en mi máquina".

### **3. Tech Stack de Élite**

| Categoría         | Tecnología                | Propósito                               |
| ----------------- | ------------------------- | --------------------------------------- |
| **Framework**     | Next.js 14 (App Router)   | Renderizado Híbrido, Server Actions     |
| **UI y Estilos**  | React 18, TailwindCSS, Shadcn/UI | UI moderna y componetizable             |
| **Base de Datos** | Supabase (PostgreSQL)     | Persistencia, Autenticación, RLS, Realtime |
| **Estado Cliente**| Zustand                   | Gestión de estado global simple y potente |
| **Validación**    | Zod                       | Validación de esquemas en cliente y servidor |
| **Pruebas**       | Vitest & Testing Library  | Pruebas unitarias y de integración      |
| **Pruebas E2E**   | Playwright                | Pruebas de flujo de usuario de extremo a extremo |
| **i18n**          | `next-intl`               | Internacionalización completa           |
| **Observabilidad**| Sentry                    | Monitoreo de errores y rendimiento      |

---

### **4. Guía de Inicio Rápido (Entorno Remoto Único)**

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/razpodesta/marketing-afiliados.git && cd marketing-afiliados
    ```
2.  **Instalar Dependencias:**
    ```bash
    pnpm install
    ```
3.  **Configurar Entorno Local:**
    *   Copia `.env.example` a `.env.local`.
    *   Rellena **todas** las variables en `.env.local` con las credenciales de tu proyecto Supabase remoto.

4.  **Ejecutar la Aplicación:**
    ```bash
    pnpm dev
    ```

### **5. Comandos Críticos del Proyecto**

| Comando             | Descripción                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`          | Inicia el servidor de desarrollo conectado a la BD remota.               |
| `pnpm test`         | Ejecuta la suite completa de pruebas (unit/int).                         |
| `pnpm test:watch`   | Ejecuta las pruebas en modo interactivo.                                 |
| `pnpm test:unit`    | Ejecuta solo las pruebas unitarias.                                      |
| `pnpm test:integration`| Ejecuta solo las pruebas de integración.                               |
| `pnpm e2e`          | Ejecuta la suite de pruebas E2E (Playwright).                            |
| `pnpm diag:all`     | Ejecuta una auditoría completa del esquema en la BD remota.              |

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Transformación a README**: ((Implementada)) El documento ha sido completamente reescrito para servir como el `README.md` principal del proyecto, proporcionando una guía de inicio clara para los desarrolladores.
 * 2. **Sincronización Completa**: ((Implementada)) Refleja la marca "ConvertiKit", la filosofía "Remote-First" y la lista de scripts de `package.json` actualizada.
 *
 * =====================================================================
 */
// README.md
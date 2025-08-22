// .docs/roadmap/001-auth-modal-flow.md
/**
 * @file 001-auth-modal-flow.md
 * @description Manifiesto y Roadmap de la "Operación Autenticación Modal".
 *              Única Fuente de Verdad (SSoT) que documenta la ejecución completa
 *              de la refactorización a un flujo modal de élite.
 * @version 2.0.0
 * @status Completa
 * @author L.I.A. Legacy
 */

# Roadmap de Élite: Operación Autenticación Modal

## 1. Visión y Objetivos Estratégicos

- **Visión:** Transformar el proceso de adquisición de usuarios en una experiencia fluida, no disruptiva y de alta conversión, alineada con los estándares de las aplicaciones SaaS de élite.
- **Objetivos Clave:**
  1.  **Mejorar la UX:** Eliminar la redirección a páginas, permitiendo al usuario registrarse o iniciar sesión sin abandonar su contexto actual.
  2.  **Centralizar la Lógica:** Consolidar la lógica de UI de autenticación en un único ecosistema de componentes reutilizables.
  3.  **Aumentar la Flexibilidad:** Construir una base que permita añadir fácilmente nuevas funcionalidades y proveedores OAuth.
  4.  **Asegurar la Integridad Arquitectónica:** Implementar el flujo utilizando un estado global desacoplado (Zustand).

## 2. Fases de Ejecución y Aparatos Involucrados

---

### **Fase I: Fundación del Estado Global (Completa)**

- **Estado:** `((Implementada))`
- **Aparatos Involucrados:**
  - `[✅] src/lib/hooks/ui/useAuthModalStore.ts`

---

### **Fase II: Orquestación y Ensamblaje Global (Completa)**

- **Estado:** `((Implementada))`
- **Aparatos Involucrados:**
  - `[✅] src/components/auth/AuthDialog.tsx`
  - `[✅] src/components/layout/GlobalOverlays.tsx`

---

### **Fase III: Conexión de la Interfaz de Usuario (Completa)**

- **Estado:** `((Implementada))`
- **Aparatos Involucrados:**
  - `[✅] src/components/layout/LandingHeader.tsx`

---

### **Fase IV: Formulario de Registro de Élite (Completa)**

- **Estado:** `((Implementada))`
- **Aparatos Involucrados:**
  - `[✅] src/lib/validators/schemas.ts` (adición de `SignUpSchema`)
  - `[✅] src/components/auth/SignUpForm.tsx`
  - `[✅] tests/integration/app/auth/SignUp.test.tsx`

---

### **Fase V: Lógica de Servidor y Base de Datos (Completa)**

- **Estado:** `((Implementada))`
- **Aparatos Involucrados:**
  - `[✅] src/lib/actions/auth.actions.ts` (implementación de `signUpAction`)

---

### **Fase VI: Decomisionamiento y Limpieza (Completa)**

- **Estado:** `((Implementada))`
- **Aparatos Eliminados:**
  - `[✅] src/app/[locale]/auth/login/page.tsx`
  - `[✅] src/app/[locale]/auth/signup/page.tsx`
  - `[✅] src/app/[locale]/auth/layout.tsx` & `auth-layout-client.tsx`
  - `[✅] src/messages/app/[locale]/auth/**`

---

## 3. Criterios de Aceptación de la Operación (Cumplidos)

1.  **Funcionalidad:**
    -   [✅] Un usuario puede hacer clic en "Registrarse Gratis" en la `LandingHeader` y ver el modal de registro.
    -   [✅] El formulario de registro valida los campos en tiempo real.
    -   [✅] El usuario puede crear una cuenta exitosamente usando email/contraseña.
    -   [✅] Tras el registro y confirmación de email, el trigger de la BD crea `profile` y `workspace`.
    -   [✅] Tras el login, el usuario es redirigido al `/dashboard`.
    -   [✅] La cookie de sesión (`sb-*-auth-token`) se establece correctamente.
2.  **Calidad de Código:**
    -   [✅] Todos los aparatos cumplen con las "Condiciones de Entrega".
    -   [✅] La suite de pruebas completa (`pnpm test`) pasa sin errores.
3.  **Experiencia de Usuario:**
    -   [✅] El flujo completo se realiza sin una sola recarga de página (post-confirmación).
    -   [✅] El usuario recibe feedback claro (toasts) sobre el éxito o fracaso de las acciones.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Documentación de Cierre de Proyecto**: ((Implementada)) ((Vigente)) Este documento ahora sirve como un registro histórico completo y preciso de la "Operación Autenticación Modal", marcando su finalización exitosa.
 *
 * =====================================================================
 */
// .docs/roadmap/001-auth-modal-flow.md
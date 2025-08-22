// .docs/espejo/tests/manifesto-arquitectura-pruebas-v1.md
/\*\*

- @file .docs/espejo/tests/manifesto-arquitectura-pruebas-v1.md
- @description Manifiesto de Arquitectura de Pruebas de Élite v2.0.
-              Aumentado con Protocolos de Implementación basados en el aprendizaje
-              acumulado, blindando el sistema contra regresiones futuras.
- @author L.I.A. Legacy
- @version 2.0.0
  \*/

# Manifiesto de Arquitectura de Pruebas: El Reloj Suizo

## 1. Filosofía Arquitectónica

La infraestructura de pruebas de ConvertiKit se rige por cuatro principios no negociables, diseñados para crear un entorno de máxima fiabilidad, mantenibilidad y velocidad.

1.  **Aislamiento Absoluto:** Cada prueba se ejecuta en una "caja de arena" perfecta. El estado de la base de datos, el DOM y los mocks se resetean antes y después de cada ejecución.
2.  **SSoT Centralizada para Mocks:** Existe un único punto de entrada (`tests/mocks/index.ts`) que orquesta toda la simulación a nivel de módulo (`vi.mock`).
3.  **Alta Fidelidad de Simulación:** El mock de `next-intl` renderiza texto real, y el de `next/navigation` delega en un motor de enrutamiento simulado.
4.  **Atomicidad y Cohesión (Filosofía LEGO):** Cada aparato tiene una única responsabilidad. Las factorías crean datos, los `Providers` envuelven componentes, el `render` ensambla.

## 2. Diagrama Arquitectónico: El Engranaje de Pruebas

```mermaid
graph TD
    subgraph "Fase 1: Setup Global"
        A[pnpm test] --> B(vitest.config.ts);
        B -- Lee `setupFiles` --> C(tests/config/vitest.setup.ts);
        C -- Invoca --> D(setupGlobalMocks);
        C -- Precarga --> E[Mensajes i18n];
    end

    subgraph "Fase 2: Ejecución de una Prueba"
        G[Arnés de Prueba] -- Llama a --> H(render(<Componente />, opciones));
        H -- Invoca --> I(tests/utils/render.tsx);
        I -- Utiliza --> J(ProvidersWrapper);
        J -- Provee --> K[Contextos (i18n, Router, Dashboard, etc.)];
        J -- Renderiza --> L(Componente Bajo Prueba);
    end

    subgraph "Fase 3: Interacción y Limpieza"
        L -- Interactúa con --> M{Mocks Globales};
        N(afterEach) -- Limpia --> O(DOM y Mocks);
    end
3. Desglose de Aparatos de Élite
tests/config/vitest.setup.ts (El Director de Orquesta): Punto de entrada. Configura polyfills, invoca setupGlobalMocks, precarga datos globales (i18n), y gestiona el ciclo de vida (afterEach).
tests/mocks/index.ts (El Cerebro de la Simulación): Centraliza todas las llamadas a vi.mock para dependencias críticas. Es la SSoT de la simulación de módulos.
tests/utils/render.tsx (La Herramienta de Precisión): Proporciona la única función render canónica que ensambla el ProvidersWrapper con el contexto mockeado y los mensajes precargados.
4. Protocolos de Implementación y Mejores Prácticas (Lecciones Aprendidas)
Esta sección es mandatoria y documenta las directivas para la creación de nuevos arneses de prueba, basadas en el conocimiento acumulado.
Protocolo 1: Cero Invocaciones Directas a render de Librerías
QUÉ HACER: Siempre importar render, screen, waitFor, etc., desde nuestro arnés de élite:
code
TypeScript
import { render, screen } from "@tests/utils/render";
QUÉ NO HACER: Nunca importar directamente desde @testing-library/react.
code
TypeScript
// INCORRECTO:
import { render } from "@testing-library/react";
PORQUÉ: Nuestro arnés render es la única garantía de que el componente será envuelto en el MemoryRouterProvider y NextIntlClientProvider necesarios. La importación directa es la causa raíz de los errores de contexto (invariant, MISSING_MESSAGE).
Protocolo 2: Pruebas Agnósticas al Idioma
QUÉ HACER: Para los selectores de texto, utilizar expresiones regulares flexibles o importar los archivos de mensajes para usar las claves de traducción exactas.
code
TypeScript
// Bueno (flexible):
screen.getByLabelText(/confirm password|confirmar contraseña/i);

// Élite (preciso):
import messages from "@/messages/..";
const t = messages['es-ES'];
screen.getByLabelText(new RegExp(`^${t.confirm_password_label}$`, "i"));
QUÉ NO HACER: Hardcodear selectores de texto en un solo idioma.
code
TypeScript
// INCORRECTO:
screen.getByLabelText("Confirm Password");
PORQUÉ: El entorno de pruebas está configurado en es-ES por defecto. Los selectores hardcodeados en inglés fallarán. Las pruebas deben ser resilientes a los cambios de locale.
Protocolo 3: Sincronización Precisa con Acciones Asíncronas
QUÉ HACER: Sincronizar la prueba con el ciclo de vida de la UI. Esperar a que aparezcan y desaparezcan los estados de carga.
code
TypeScript
await user.click(screen.getByRole("button", { name: /crear/i }));
// 1. Espera a que la acción comience (el botón muestra "Creando...")
await screen.findByRole("button", { name: /creando/i });
// 2. Espera a que la acción termine (el botón de "Creando..." desaparece)
await waitFor(() => {
  expect(screen.queryByRole("button", { name: /creando/i })).not.toBeInTheDocument();
});
// 3. Ahora, haz la aserción sobre el resultado
expect(toast.error).toHaveBeenCalled();
QUÉ NO HACER: Usar waitFor para esperar directamente el spy sin un anclaje en la UI.
code
TypeScript
// INCORRECTO (frágil):
await user.click(button);
await waitFor(() => expect(redirectSpy).toHaveBeenCalled());
PORQUÉ: Esperar los cambios en la UI es una simulación de mayor fidelidad del comportamiento del usuario y previene condiciones de carrera (race conditions) donde la aserción se ejecuta antes de que la acción asíncrona se complete.
Protocolo 4: Simulación de Server Actions en Pruebas de UI
QUÉ HACER: Mockear completamente la Server Action a nivel de módulo para controlar su valor de retorno.
code
TypeScript
vi.mock('@/lib/actions/auth.actions', () => ({
  signUpAction: vi.fn(),
}));
const mockedSignUpAction = vi.mocked(signUpAction);
mockedSignUpAction.mockResolvedValue({ success: false, error: '...' });
QUÉ NO HACER: Espiar (vi.fn(actualAction)) o invocar la acción real en una prueba de integración de UI si esta depende de APIs de servidor (headers, cookies).
PORQUÉ: El entorno jsdom no puede proveer el contexto de servidor. Intentar ejecutar estas acciones directamente causará el error ... called outside a request scope. La responsabilidad de la prueba de UI es verificar que la acción es llamada con los datos correctos, no probar la lógica interna de la acción.
/**
=====================================================================
code
Code
MEJORA CONTINUA
=====================================================================
@subsection Melhorias Adicionadas
Documentación de Conocimiento Acumulado: ((Implementada)) ((Vigente)) Se ha añadido una sección completa de "Protocolos de Implementación" que formaliza las lecciones aprendidas durante la estabilización de la suite de pruebas.
@subsection Melhorias Futuras
Linting de Prácticas de Prueba: ((Pendiente)) Se podría configurar un plugin de ESLint (eslint-plugin-testing-library) con reglas personalizadas para detectar automáticamente violaciones de estos protocolos (ej. importaciones desde @testing-library/react).
=====================================================================
*/
// .docs/espejo/tests/manifesto-arquitectura-pruebas-v1.md
```

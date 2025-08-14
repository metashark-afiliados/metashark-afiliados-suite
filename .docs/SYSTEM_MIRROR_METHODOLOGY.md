// .docs/SYSTEM_MIRROR_METHODOLOGY.md
/**
 * @file .docs/SYSTEM_MIRROR_METHODOLOGY.md
 * @description Manifiesto de la Metodología "Sistema Espejo de Documentación".
 *              Esta es la Única Fuente de Verdad que define CÓMO se deben
 *              documentar los aparatos de lógica y UI antes de su implementación
 *              o refactorización.
 * @author Raz Podestá
 * @version 1.0.0
 */
# Manifiesto de la Metodología: "Sistema Espejo de Documentación"

## 1. Filosofía: "Diseñar Antes de Construir"

El "Sistema Espejo" es nuestra metodología canónica para el diseño de software. Se basa en un principio simple pero de élite: antes de escribir una sola línea de código, creamos un **"espejo" conceptual** del aparato en forma de un documento Markdown. Este documento actúa como el blueprint arquitectónico, permitiéndonos auditar, debatir y refinar la arquitectura a priori, minimizando la deuda técnica y el retrabajo.

## 2. El Formato Canónico del Blueprint

Cada documento de blueprint dentro del directorio `.docs/espejo/` debe seguir esta estructura estricta.

---

**Ruta del Aparato:** `ruta/canonica/al/archivo.tsx`
**Aparato:** `NombreDelAparato`
**Versión Conceptual:** `1.0.0`
**Autor del Diseño:** `Nombre del Ingeniero/Arquitecto`

#### **[Tipo de Aparato]**
*Clasificación funcional: Manifiesto de Configuración, Motor de Reglas (Handler), Aparato de Datos, Hook de Lógica, Orquestador de UI, Componente de Presentación Puro, Arnés de Pruebas, etc.*

#### **[Filosofía de Diseño y Propósito]**
*El "porqué" del aparato. Describe su misión, el principio arquitectónico que sigue (ej. "Configuración sobre código", "Agnóstico y reutilizable", "Única Fuente de Verdad") y su rol dentro del ecosistema del proyecto.*

#### **[Análisis del Estado Anterior (Deuda Técnica)]**
*Un resumen conciso de las debilidades del aparato existente (si lo hay), basado en una auditoría previa. Si es un aparato nuevo, esta sección se omite.*

#### **[Arquitectura Propuesta (El Estado de Élite)]**
*El núcleo del diseño. Detalla la nueva estructura y lógica.*
*   **Estructura de Datos:** Define las `interfaces`, `tipos` o `esquemas Zod` que el aparato introducirá.
*   **Flujo Lógico:** Describe el algoritmo paso a paso que seguirá el aparato.
*   **Diagrama de Flujo (Mermaid):** Si aplica, un diagrama visual del flujo de decisión.

#### **[Contrato de Interacción y Dependencias]**
*   **Exportaciones:** Qué `interfaces`, `funciones` o `constantes` expondrá el aparato.
*   **Importaciones Clave:** De qué otros aparatos críticos dependerá.
*   **Impacto Sistémico:** Cómo afectará este cambio a otros aparatos del sistema.

#### **[Estrategia de Pruebas]**
*Para los aparatos de lógica y UI, describe los escenarios clave que serán validados en su suite de pruebas correspondiente (`unit` o `integration`).*

---

## 3. Flujo de Trabajo

1.  **Creación del Blueprint:** Antes de cualquier implementación, el ingeniero responsable crea o actualiza el archivo `.md` en `.docs/espejo/`.
2.  **Revisión y Aprobación:** El Arquitecto (RaZ WriTe) revisa el blueprint. Se discuten y refinan las decisiones de diseño.
3.  **Implementación:** Una vez aprobado el blueprint, la IA (L.I.A. Legacy) ejecuta la implementación, adhiriéndose estrictamente al diseño conceptual.
4.  **Sincronización:** Post-implementación, el blueprint puede ser actualizado para reflejar cualquier refinamiento final, sirviendo como documentación perpetua.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Rebranding y Claridad**: ((Implementada)) Se ha actualizado el documento para reflejar el rebranding y los roles del equipo (RaZ WriTe, L.I.A. Legacy).
 * 2. **Refinamiento de Plantilla**: ((Implementada)) La plantilla de blueprint ha sido refinada para ser más clara y alineada con los documentos que hemos estado produciendo.
 *
 * =====================================================================
 */
// .docs/SYSTEM_MIRROR_METHODOLOGY.md

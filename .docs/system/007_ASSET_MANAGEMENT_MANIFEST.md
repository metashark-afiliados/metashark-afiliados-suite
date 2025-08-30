// .docs/system/007_ASSET_MANAGEMENT_MANIFEST.md
/**
 * @file .docs/system/007_ASSET_MANAGEMENT_MANIFEST.md
 * @description Manifiesto de Gestión y Optimización de Activos v2.0.
 *              Esta es la SSoT que define la arquitectura completa para la ingesta,
 *              procesamiento, almacenamiento y entrega de imágenes en ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto de Gestión y Optimización de Activos v2.0

## 1. Filosofía: "Optimización por Defecto, Entrega Inteligente"

Nuestra arquitectura de activos se basa en dos pilares:
1.  **Optimización en la Ingesta:** Ninguna imagen subida por un usuario llega a nuestro almacenamiento en su formato original. Es procesada, optimizada y convertida al formato más eficiente (`WebP`) de forma automática y transparente.
2.  **Entrega Inteligente:** Utilizamos las capacidades nativas de `next/image` y Vercel para entregar la imagen del tamaño y formato correctos para cada dispositivo, garantizando un rendimiento de carga de élite (Core Web Vitals).

## 2. Arquitectura de Flujo de Vida del Activo

### 2.1. Fase de Ingesta y Procesamiento (Server Action)

*   **SSoT Técnica:** Una futura `Server Action` `uploadAssetAction(formData: FormData)`.
*   **Implementación:**
    1.  **Recepción:** La `Server Action` recibe el archivo de imagen a través de `formData`.
    2.  **Optimización Serverless:** La acción **no** sube el archivo directamente. En su lugar, invoca una **Supabase Edge Function** (`optimize-and-upload-image`).
    3.  **Lógica de la Edge Function:**
        *   Recibe el buffer de la imagen.
        *   Utiliza una librería de procesamiento de imágenes de alto rendimiento (como `sharp`) para:
            *   **Convertir a WebP:** Transforma la imagen al formato WebP, que ofrece una compresión superior con alta calidad.
            *   **Redimensionar:** Limita las dimensiones máximas (ej. 1920px de ancho) para evitar el almacenamiento de imágenes innecesariamente grandes.
            *   **Comprimir:** Aplica una compresión con pérdida optimizada (ej. calidad del 80%).
        *   Sube el buffer de la imagen optimizada a **Supabase Storage**.
        *   Devuelve la URL pública del nuevo activo optimizado.
    4.  **Persistencia de Metadatos:** La `Server Action` recibe la URL de la Edge Function y crea un registro en la tabla `asset_library` con los metadatos del archivo.

*   **Diagrama de Flujo (Mermaid):**
    ```mermaid
    sequenceDiagram
        participant Client as UI
        participant Server as Server Action
        participant Edge as Edge Function
        participant Storage as Supabase Storage
        participant DB as PostgreSQL DB

        Client->>Server: uploadAssetAction(imageFile)
        Server->>Edge: Invoca optimize-and-upload-image(buffer)
        Edge->>Edge: Procesa con 'sharp' (Convierte, Redimensiona, Comprime)
        Edge->>Storage: Sube imagen optimizada (WebP)
        Storage-->>Edge: Devuelve URL pública
        Edge-->>Server: Devuelve URL pública
        Server->>DB: INSERT INTO asset_library (metadata, url)
        Server-->>Client: ActionResult { success: true, data: assetUrl }
    ```

### 2.2. Fase de Almacenamiento (Supabase Storage)

*   **SSoT Técnica:** Supabase Storage.
*   **Estrategia:**
    *   **Buckets Seguros:** Los activos se almacenan en `buckets` privados o públicos con políticas de acceso granulares, alineadas con RLS.
    *   **Costo-Eficiencia:** El almacenamiento de objetos es significativamente más económico que el almacenamiento en base de datos. La optimización previa reduce drásticamente el tamaño de los archivos, minimizando los costos de almacenamiento y transferencia.

### 2.3. Fase de Entrega (Next.js Image)

*   **SSoT Técnica:** El componente `<Image>` de `next/image`.
*   **Implementación:**
    1.  **Regla Mandatoria:** Toda imagen en la aplicación **DEBE** ser renderizada a través del componente `<Image>`.
    2.  **Configuración:** El `hostname` de Supabase Storage se añade a la lista de `remotePatterns` en `next.config.mjs` para habilitar la optimización de Vercel.
*   **Beneficios Automáticos:**
    *   **Optimización de Formato Adicional:** Vercel puede convertir `WebP` a `AVIF` si el navegador lo soporta.
    *   **Redimensionamiento en la Entrega:** Sirve la imagen en el tamaño exacto requerido por el dispositivo.
    *   **Lazy Loading y Prevención de CLS.**

## 3. Roadmap de Evolución del Dominio

*   **Completado:**
    *   Estrategia de entrega con `<Image>` de Next.js.
    *   Definición de la tabla `asset_library`.
*   **Próximos Pasos (Vigente):**
    1.  **Crear Edge Function `optimize-and-upload-image`:** Desarrollar la lógica de procesamiento con `sharp`.
    2.  **Implementar `uploadAssetAction`:** Crear la Server Action que orquesta el flujo de subida.
    3.  **Desarrollar UI para `AssetLibrary`:** Crear una UI en el `Builder` que permita a los usuarios subir imágenes y seleccionar las existentes desde su biblioteca.

// .docs/system/007_ASSET_MANAGEMENT_MANIFEST.md
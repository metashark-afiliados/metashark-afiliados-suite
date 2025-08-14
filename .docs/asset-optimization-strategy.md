// .docs/asset-optimization-strategy.md
/**
 * @file .docs/asset-optimization-strategy.md
 * @description Manifiesto de Estrategia de Optimización de Activos.
 *              Esta es la Única Fuente de Verdad para las mejores prácticas
 *              de manejo de imágenes y otros activos estáticos en el proyecto ConvertiKit.
 * @author Raz Podestá
 * @version 1.0.0
 */
# Manifiesto de Estrategia de Optimización de Activos de Élite

## 1. Filosofía

Nuestra filosofía es **"Optimización Automática por Defecto"**. Aprovechamos al máximo las capacidades nativas de Next.js y Vercel para automatizar la optimización de imágenes, garantizando el mejor rendimiento posible (Core Web Vitals) con el mínimo esfuerzo manual. La optimización manual es la excepción, no la regla.

## 2. Estrategia Canónica (Implementación por Defecto)

### **2.1. El Componente `<Image>` de Next.js**

- **Regla Mandatoria:** TODO uso de imágenes en la aplicación (`.tsx` o `.mdx`) DEBE utilizar el componente `<Image>` de `next/image` en lugar de la etiqueta `<img>` nativa.
- **Beneficios Automáticos:**
    - **Optimización de Tamaño:** Redimensiona automáticamente las imágenes a los tamaños correctos para cada dispositivo.
    - **Optimización de Formato:** Sirve imágenes en formatos modernos como WebP o AVIF cuando el navegador lo soporta.
    - **Lazy Loading:** Carga las imágenes solo cuando están a punto de entrar en el viewport, mejorando el LCP (Largest Contentful Paint).
    - **Prevención de CLS (Cumulative Layout Shift):** Reserva automáticamente el espacio para la imagen antes de que se cargue, requiriendo las props `width` y `height`.

### **2.2. Imágenes Locales vs. Remotas**

- **Imágenes Locales (`/public`):** Para activos estáticos del branding de la aplicación (logos, iconos de UI), se deben colocar en el directorio `/public`. El componente `<Image>` las optimizará automáticamente.
- **Imágenes Remotas (CMS, Supabase Storage):** Para contenido dinámico (avatares de usuario, imágenes de artículos de blog, previsualizaciones de templates), se deben configurar los dominios de origen en `next.config.mjs` para habilitar la optimización.

**Ejemplo de Configuración en `next.config.mjs`:**

// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Para imágenes de blog
      },
      {
        protocol: 'https',
        hostname: 'fxxffkvcyovekyqdtyli.supabase.co', // URL de tu proyecto Supabase
      },
      // ... otros dominios permitidos
    ],
  },
};

3. Estrategia de Excepción (Optimización Manual)
3.1. Cuándo Optimizar Manualmente
La optimización manual solo es necesaria para imágenes de gran tamaño o muy complejas ANTES de subirlas a un CMS o a Supabase Storage. El objetivo es reducir el tamaño del archivo base.
3.2. Herramienta Recomendada: Squoosh.app
Herramienta Canónica: Squoosh.app (desarrollada por Google) es la herramienta recomendada para la optimización manual.
Flujo de Trabajo:
Arrastra la imagen original a Squoosh.
Compara diferentes formatos (ej. WebP vs AVIF) y ajusta la calidad.
Apunta a un equilibrio óptimo entre calidad visual y tamaño de archivo.
Descarga la imagen optimizada y súbela a la plataforma correspondiente.
/**

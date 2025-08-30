// .docs/espejo/functionality/002_SITES_DOMAIN_MANIFEST.md
/**
 * @file .docs/espejo/functionality/002_SITES_DOMAIN_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto del Dominio "Sites".
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Dominio "Sites"

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que define el propósito de negocio, la arquitectura técnica, los flujos de lógica y el roadmap de evolución para el dominio `Sites`. Sirve como la guía de referencia funcional de alto nivel para el "lienzo de publicación" de los activos de marketing de un usuario.

## 2. Arquitectura del Contenido
El manifiesto se estructura para proporcionar una visión 360° del dominio:
1.  **Rol Estratégico:** Define la filosofía de "Publicación Desacoplada y Flexible".
2.  **Funcionalidades Implementadas:** Detalla las capacidades actuales del dominio, como CRUD, validación de subdominio en tiempo real, y gestión de vistas.
3.  **Arquitectura Técnica y de Datos:** Explica el modelo de base de datos y la arquitectura de componentes del frontend.
4.  **Flujos de Lógica de Negocio:** Documenta los flujos críticos implementados como Server Actions.
5.  **Roadmap de Evolución:** Especifica las funcionalidades completadas y las próximas a implementar.

## 3. Contrato de API
- **Formato de Entrada:** Requerimientos de negocio y decisiones arquitectónicas de la Constitución.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT funcional para el dominio de Sitios.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Dominios Personalizados:** Implementar el flujo para que los usuarios puedan mapear sus propios dominios a un `Site`.
 * 2.  **Generación de Previsualizaciones:** Crear una `Server Action` que genere una captura de pantalla de la campaña principal de un sitio para usarla como `thumbnail`.
 * 3.  **Transferencia de Sitios:** Implementar una `Server Action` que permita a un `owner` transferir la propiedad de un `Site` a otro `Workspace`.
 * 4.  **Estadísticas a Nivel de Sitio:** Agregar una vista en la UI que muestre métricas agregadas (visitas, conversiones) para todas las campañas dentro de un sitio.
 * 5.  **Configuraciones SEO Globales:** Permitir a los usuarios configurar metadatos SEO por defecto (título, descripción, favicon) a nivel de `Site`, que las campañas puedan heredar.
 * 6.  **Integración con Analytics de Terceros:** Añadir campos en la configuración del sitio para que los usuarios puedan inyectar sus IDs de seguimiento de Google Analytics o Facebook Pixel.
 * 7.  **Clonación de Sitios:** Implementar una `Server Action` `cloneSiteAction` que duplique un sitio y todas sus campañas asociadas.
 * 8.  **Sitios Protegidos por Contraseña:** Añadir una opción para proteger un sitio completo con una contraseña.
 * 9.  **Inyección de CSS Personalizado:** Permitir a los usuarios avanzados inyectar CSS personalizado a nivel de sitio.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/functionality/002_SITES_DOMAIN_MANIFEST.md
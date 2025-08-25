// src/lib/builder/boilerplate.ts
/**
 * @file boilerplate.ts
 * @description Manifiesto de Datos y Única Fuente de Verdad (SSoT) para los datos
 *              utilizados en el "Modo Boilerplate". Proporciona constantes de ID y
 *              factorías para generar objetos de datos simulados, permitiendo que
 *              los flujos de UI se desarrollen y prueben de forma aislada sin
 *              depender de una base de datos.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { type Json, type Tables } from "@/lib/types/database";
import { type CampaignConfig } from "./types.d";

/**
 * @public
 * @constant BOILERPLATE_CREATION_ID
 * @description El ID estático y canónico para la `Creation` utilizada en el modo boilerplate.
 */
export const BOILERPLATE_CREATION_ID = "boilerplate-creation-001";

/**
 * @public
 * @function getBoilerplateCreation
 * @description Factoría que devuelve un objeto de `Creation` de alta fidelidad para
 *              ser utilizado por la página del constructor en modo boilerplate.
 * @returns {Tables<"creations">} Un objeto `Creation` simulado y completo.
 */
export const getBoilerplateCreation = (): Tables<"creations"> => {
  const config: Omit<CampaignConfig, "id" | "site_id"> = {
    name: "Boilerplate Creation",
    theme: { globalFont: "Inter", globalColors: {} },
    blocks: [],
  };

  return {
    id: BOILERPLATE_CREATION_ID,
    name: "Boilerplate Creation",
    content: config as Json,
    created_by: "dev-user-001",
    workspace_id: "dev-ws-001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **SSoT de Datos de Desarrollo**: ((Implementada)) Este aparato centraliza todas las constantes y datos simulados para el modo boilerplate, mejorando la mantenibilidad y eliminando valores mágicos del código de la aplicación.
 * 2. **Factoría de Alta Fidelidad**: ((Implementada)) La función `getBoilerplateCreation` genera un objeto que cumple estrictamente con el contrato de tipo `Tables<"creations">`, garantizando la seguridad de tipos en los componentes que lo consumen.
 *
 * @subsection Melhorias Futuras
 * 1. **Configuración Dinámica**: ((Vigente)) La factoría podría ser extendida para aceptar `override` de propiedades, permitiendo a los arneses de pruebas generar boilerplates con diferentes configuraciones iniciales.
 *
 * =====================================================================
 */
// src/lib/builder/boilerplate.ts

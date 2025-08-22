// tests/utils/i18n.ts
/**
 * @file tests/utils/i18n.ts
 * @description Aparato de infraestructura de pruebas: El Cargador de Mensajes.
 *              Esta es la Única Fuente de Verdad (SSoT) para cargar y ensamblar
 *              los archivos de mensajes de i18n para el entorno de pruebas.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { setNestedProperty } from "@/lib/helpers/set-nested-property.helper";
import { type AppLocale } from "@/lib/navigation";
import { mockedMessagesManifest } from "@tests/mocks/messages.manifest.mock";

/**
 * @public
 * @async
 * @function loadTestMessages
 * @description Carga y ensambla todos los mensajes de i18n para un locale específico.
 *              Consume el manifiesto de mocks para encontrar y cargar dinámicamente
 *              cada archivo de mensajes.
 * @param {string} locale - El locale para el cual cargar los mensajes.
 * @returns {Promise<Record<string, any>>} Una promesa que resuelve con un objeto
 *          anidado que contiene todos los mensajes para el locale dado.
 */
export async function loadTestMessages(
  locale: string
): Promise<Record<string, any>> {
  const messages = {};
  const namespaces = Object.keys(mockedMessagesManifest);

  for (const namespace of namespaces) {
    try {
      const moduleLoader = mockedMessagesManifest[namespace];
      const module = await moduleLoader();
      const localeMessages = module.default[locale as AppLocale];
      if (localeMessages) {
        setNestedProperty(messages, namespace, localeMessages);
      }
    } catch (e) {
      // Ignorar errores si un archivo JSON no existe o falla al cargar.
      // Esto permite que las pruebas se ejecuten incluso si el conjunto de mensajes está incompleto.
    }
  }
  return messages;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) ((Vigente)) Este aparato tiene la única responsabilidad de cargar mensajes, desacoplando esta lógica del renderizado y del setup global.
 * 2. **Resiliencia**: ((Implementada)) ((Vigente)) El `try/catch` dentro del bucle asegura que un archivo de mensajes faltante o corrupto no detenga la carga de los demás.
 *
 * @subsection Melhorias Futuras
 * 1. **Logging de Errores de Carga**: ((Pendiente)) El bloque `catch` podría ser mejorado para registrar una advertencia (`logger.warn`) cuando un archivo de mensajes específico no se puede cargar, facilitando la depuración de la infraestructura de i18n.
 *
 * =====================================================================
 */
// tests/utils/i18n.ts

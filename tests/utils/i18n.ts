// tests/utils/i18n.ts
/**
 * @file tests/utils/i18n.ts
 * @description Aparato de infraestructura de pruebas: El Cargador de Mensajes.
 *              Esta es la SSoT para cargar y ensamblar los archivos de mensajes
 *              de i18n para el entorno de pruebas. Refactorizado para usar una
 *              ruta relativa explícita y garantizar la resolución del módulo.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 3.0.0
 */
import { setNestedProperty } from "@/lib/helpers/set-nested-property.helper";
import { type AppLocale } from "@/lib/navigation";
import { mockedMessagesManifest } from "../mocks/messages.manifest.mock";

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
      const moduleLoader =
        mockedMessagesManifest[
          namespace as keyof typeof mockedMessagesManifest
        ];
      const module = await moduleLoader();
      const localeMessages = module.default[locale as AppLocale];
      if (localeMessages) {
        setNestedProperty(messages, namespace, localeMessages);
      }
    } catch (e) {
      // Ignorar errores si un archivo JSON no existe o falla al cargar.
    }
  }
  return messages;
}
// tests/utils/i18n.ts

Manifiesto Arquitectónico: El Dominio Soberano de 'Creations'
Aparato: Ecosistema de Creations
Versión Conceptual: 1.0.0
Autor del Diseño: Raz Podestá - MetaShark Tech
1. Filosofía y Visión: "El Diseño es Soberano"
La arquitectura de Creations representa una evolución fundamental en nuestra "Filosofía LEGO". Anteriormente, el Campaign era un monolito que contenía tanto el diseño como la configuración de publicación. La nueva arquitectura establece una separación de responsabilidades de élite:
Creation (La Pieza LEGO Maestra): Es el diseño soberano y agnóstico. Representa el "qué": la estructura de bloques, los estilos, el contenido. Reside en la tabla creations y es el artefacto que se edita en el Builder. No sabe nada sobre dónde o cómo será publicado.
Campaign (La Instancia Publicada): Es el contexto de publicación. Representa el "dónde" y el "cómo": está vinculada a una Creation (creation_id), a un Site (site_id), y tiene un slug para su URL pública.
Esta separación nos otorga una flexibilidad arquitectónica masiva: una misma Creation podrá, en el futuro, ser publicada en múltiples Campaigns (ej. para A/B testing) o incluso en diferentes Sites.
2. El Flujo de Vida de una 'Creation' (Análisis Completo)
2.1. Fase de Creación (Desde el Hub Creativo)
Interacción del Usuario: El usuario hace clic en un ActionDockButton (ej. "Landing Page") en el DashboardClient.
Orquestador de UI: El ActionDock.tsx, un componente de presentación puro, renderiza un <form> por cada botón.
Hook Soberano: El hook useActionDock.ts provee la formAction, que está vinculada a createCreationAction.
Invocación de Server Action: Al enviar el formulario, se invoca createCreationAction (/lib/actions/creations/create.action.ts).
Lógica de Negocio (Acción):
Verifica la autenticación del usuario.
Obtiene el workspace_id activo de las cookies.
Valida los datos del FormData (name, type) con CreateCreationSchema.
Invoca el helper generateCreationPayload para construir el objeto de datos inicial.
Inserta el nuevo registro en la tabla public.creations.
Registra un audit_log para la acción.
Devuelve un ActionResult con el id de la nueva Creation.
Redirección: El useEffect en useActionDock.ts detecta el ActionResult exitoso y utiliza el useRouter de next-intl para redirigir al usuario a /builder/[creationId].
2.2. Fase de Edición (En el Builder)
Carga de Datos (Servidor):
El Server Component src/app/[locale]/builder/[creationId]/page.tsx se ejecuta.
Obtiene el creationId de los parámetros de la ruta.
Llama a getCreationById para obtener el registro completo de la tabla creations, validando la propiedad del usuario.
Extrae el objeto content (JSONB) de la Creation.
Hidratación del Estado (Cliente):
Los datos de content se pasan como initialState al BuilderStoreProvider.
Dentro del proveedor, el store de Zustand se crea una sola vez y su estado se hidrata con initialState. La persistencia local en localStorage se activa.
Interacción en la UI:
Todos los componentes del Builder (Canvas, SettingsPanel, etc.) consumen el estado del BuilderStore a través del hook useBuilderStore.
Cualquier modificación (ej. cambiar texto, mover un bloque) es una acción que muta el estado en Zustand (updateBlockProp, moveBlock, etc.).
Gracias a zustand/persist, cada cambio de estado se guarda automáticamente en localStorage, garantizando la resiliencia contra cierres accidentales del navegador.
Gracias a zundo, cada mutación se registra en el historial, habilitando la funcionalidad de Deshacer/Rehacer.
2.3. Fase de Guardado (Persistencia en Base de Datos)
Interacción del Usuario: El usuario hace clic en el SaveStatusButton dentro del BuilderHeader.
Hook Soberano: El BuilderHeader consume el hook useBuilderHeader.ts, que expone la función handleSave.
Lógica del Hook:
handleSave obtiene el estado actual completo de campaignConfig del BuilderStore.
Invoca la Server Action updateCreationContentAction (/lib/actions/creations/update-content.action.ts), pasándole el creationId y el objeto content completo.
Lógica de Negocio (Acción):
updateCreationContentAction valida que el usuario sea el propietario de la Creation.
Actualiza la fila correspondiente en la tabla creations, sobrescribiendo los campos content y name.
Registra un audit_log para el evento de actualización.
Revalida la ruta del builder (revalidatePath) para asegurar que la próxima carga obtenga los datos frescos.
Feedback en la UI: El useBuilderHeader maneja el ActionResult y muestra un toast de éxito o error. Al tener éxito, limpia el historial de zundo, marcando el estado como "limpio" (isDirty = false).
3. Diagrama de Flujo Lógico (Mermaid)
code
Mermaid
graph TD
    subgraph Hub Creativo (UI)
        A[ActionDockButton] -- Clic --> B{Formulario};
    end

    subgraph Hooks Soberanos
        C[useActionDock] -- Provee --> B;
    end
    
    subgraph Server Actions
        D[createCreationAction] -- Inserta --> T1(db.creations);
    end

    subgraph Builder (UI)
        E[/builder/[creationId]] -- Carga datos de --> T1;
        F[BuilderStoreProvider] -- Hidrata --> G{Zustand Store};
        H[Canvas / SettingsPanel] -- Leen/Escriben --> G;
        I[BuilderHeader] -- Clic en 'Guardar' --> J[useBuilderHeader];
    end

    subgraph Hooks Soberanos
        J -- Invoca --> K[updateCreationContentAction];
    end
    
    subgraph Server Actions
        K -- Actualiza --> T1;
    end

    B -- Invoca --> D;
    D -- Retorna ID y Redirige a --> E;
4. Contrato de Datos (SSoT)
Persistencia (src/db/schema.sql): La tabla creations con su columna content de tipo JSONB.
Estado en Memoria (src/lib/builder/types.d.ts): El tipo CampaignConfig, validado por CampaignConfigSchema, define la forma del objeto content. Es la SSoT para la estructura del diseño.
5. Manual de Uso para el Equipo de Desarrollo
Para crear un nuevo diseño: Utilice siempre la createCreationAction.
Para cargar un diseño en el Builder: Obtenga los datos de la tabla creations y pase el campo content como initialState al BuilderStoreProvider.
Para guardar un diseño: Invoque updateCreationContentAction con el creationId y el objeto campaignConfig completo del BuilderStore. La acción se encarga de la validación de permisos.

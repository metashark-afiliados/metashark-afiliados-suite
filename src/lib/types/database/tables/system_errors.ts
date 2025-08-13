// src/lib/types/database/tables/system_errors.ts
/**
@file system_errors.ts
@description Define el contrato de datos atómico para la tabla system_errors.
Esta tabla proporciona un registro persistente de errores críticos
de la aplicación para auditoría y depuración a largo plazo.
@author Raz Podestá
@version 1.0.0
*/
import { type Json } from "../_shared";
export type SystemErrors = {
  Row: {
    id: number;
    created_at: string;
    source: string;
    error_message: string;
    stack_trace: string | null;
    metadata: Json | null;
    status: string;
  };
  Insert: {
    id?: number;
    created_at?: string;
    source: string;
    error_message: string;
    stack_trace?: string | null;
    metadata?: Json | null;
    status?: string;
  };
  Update: {
    id?: number;
    status?: string;
  };
  Relationships: [];
};
/**
=====================================================================
MEJORA CONTINUA
=====================================================================
@subsection Melhorias Adicionadas
Fundación de Observabilidad Persistente: ((Implementada)) Este contrato de datos establece la base para un sistema de registro de errores de élite.
@subsection Melhorias Futuras
Tipo ENUM para status: ((Vigente)) Reemplazar string por un ENUM ('new', 'acknowledged', 'resolved') para un manejo de estado más robusto.
=====================================================================
*/
// src/lib/types/database/tables/system_errors.ts

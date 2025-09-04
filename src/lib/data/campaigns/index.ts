// src/lib/data/campaigns/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para el módulo de datos de
 *              campañas. Ensambla los aparatos de datos atomizados en una
 *              interfaz namespaced cohesiva.
 * @author L.I.A Legacy
 * @version 2.0.0
 */
import "server-only";

import * as auth from "./auth.data";
import * as dashboard from "./dashboard.data";
import * as management from "./management.data";
import * as mutations from "./mutations.data";
import * as publicData from "./public.data";

export { auth, dashboard, management, mutations, publicData };
export * from "./types";
// src/lib/data/campaigns/index.ts

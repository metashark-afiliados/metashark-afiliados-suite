Listado de Rutas para Navegación Directa (Entorno Local)
1. Rutas Públicas (Landing & Legal)
http://localhost:3000/pt-BR/
http://localhost:3000/pt-BR/about
http://localhost:3000/pt-BR/blog
http://localhost:3000/pt-BR/contact
http://localhost:3000/pt-BR/terms
http://localhost:3000/pt-BR/privacy
2. Flujo de Autenticación (UI)
http://localhost:3000/pt-BR/login
http://localhost:3000/pt-BR/signup
http://localhost:3000/pt-BR/forgot-password
3. Dashboard y Flujos Protegidos (Ahora Públicos)
http://localhost:3000/pt-BR/dashboard
http://localhost:3000/pt-BR/dashboard/sites
http://localhost:3000/pt-BR/dashboard/sites/site-001/campaigns
http://localhost:3000/pt-BR/builder/camp-001
4. Paneles de Administración (Ahora Públicos)
http://localhost:3000/pt-BR/dev-console
http://localhost:3000/pt-BR/dev-console/users
http://localhost:3000/pt-BR/dev-console/campaigns
http://localhost:3000/pt-BR/dev-console/telemetry
http://localhost:3000/pt-BR/dashboard/resources/icons
Nota: Las rutas dinámicas (/sites/[siteId]/... y /builder/[campaignId]) utilizan los IDs (site-001, camp-001) definidos en el estado mockeado de la base de datos (tests/mocks/data/database-state.ts) que ahora está siendo servido por el dashboard.loader.ts desprotegido.
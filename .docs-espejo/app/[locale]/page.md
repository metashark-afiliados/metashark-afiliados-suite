// .docs-espejo/app/[locale]/signup/page.tsx.md
/**
 * @file signup/page.tsx.md
 * @description Documento Espejo y SSoT conceptual para la página de registro.
 * @author Raz Podestá - MetaShark Tech & RaZ WriTe (Arquitecto)
 * @version 2.0.0
 * @date 2025-09-01
 */
# Manifiesto Conceptual: Página de Registro (`SignupPage`) v2.0

## 1. Rol Estratégico y Propósito
Este aparato es el **orquestador de UI soberano para el flujo de registro de nuevos usuarios**. Su única y exclusiva responsabilidad es ensamblar la interfaz de usuario completa para la ruta `/signup`, actuando como una capa de adaptación entre la capa de internacionalización y los componentes de presentación puros que la componen.

## 2. Arquitectura del Contenido
1.  **Orquestador de Cliente Soberano:** Es un Componente de Cliente (`"use client"`) que consume `useTranslations` para ser soberano en la gestión de su contenido, sin depender de props externas.
2.  **Capa de Adaptación (i18n -> Props):** Su lógica principal es obtener todas las traducciones necesarias del namespace `app.[locale].signup.page` y transformarlas en los contratos de `props` (`signupFormTexts`, `bottomLink`) que sus componentes hijos (`SignupForm`, `AuthCardLayout`) esperan.
3.  **Composición de UI Pura:** Compone los aparatos de presentación `AuthCardLayout` y `SignupForm`, inyectándoles las props de contenido ya preparadas.
4.  **Manejo de Enlaces:** Construye el `bottomLink` (para navegar a la página de login) utilizando `t.rich` y el componente `SmartLink`.

## 3. Contrato de API
- **Entrada:** `params: { locale: string }` de la ruta de Next.js.
- **Salida:** El JSX completo y ensamblado para la página de registro.

## 4. Zona de Melhorias Futuras
1.  **Parâmetros de Campanha na URL:** A página poderia ler `searchParams` para capturar IDs de afiliado ou códigos de campanha e passá-los para a `signUpAction` através do hook `useSignUpForm`.
2.  **Testes de Integração E2E:** Escrever um teste de Playwright que simule o fluxo completo de registro nesta página, validando a interação com todos os campos e a submissão.
3.  **Internacionalização da Documentação:** Traduzir este documento espelho para equipes de desenvolvimento multilíngues.
4.  **Componente `AuthPageLayout`:** Abstrair o padrão `AuthCardLayout` + `bottomLink` em um componente `AuthPageLayout` para reduzir a duplicação de código entre `LoginPage` e `SignupPage`.
5.  **Animações de Transição de Página:** Utilizar `framer-motion` para animar a transição de entrada da página.
6.  **Estado de Carregamento a Nível de Página:** Gerenciar um estado de carregamento global para mostrar um esqueleto da página (`PageSkeleton`) enquanto o componente de cliente se hidrata.
7.  **Campo "Nome Completo":** Adicionar um campo de nome completo ao formulário de registro para melhorar a personalização da experiência do usuário desde o início.
8.  **Validação de `searchParams`:** Se parâmetros de URL forem implementados, validá-los usando um schema Zod.
9.  **Acessibilidade do Foco Inicial:** Garantir que o foco seja definido no primeiro campo do formulário (email) assim que a página for carregada.
10. **Pre-fetching de Dados de Onboarding:** No lado do cliente, após um registro bem-sucedido, iniciar o pre-fetching de quaisquer dados necessários para o modal de boas-vindas ou o tour do dashboard.
// .docs-espejo/app/[locale]/signup/page.tsx.md
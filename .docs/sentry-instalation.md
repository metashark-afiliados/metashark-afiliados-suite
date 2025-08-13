C:\Users\VAIO\apps\aaa-proyectos-propios\___marketing-afiliados-container\metashark-afiliados>npx @sentry/wizard@latest -i nextjs --saas --org metashark-tech-is --project javascript-nextjs

T   Sentry Next.js Wizard
|
o   ------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  The Sentry Next.js Wizard will help you set up Sentry for your application.                      |
|  Thank you for using Sentry :)                                                                    |
|                                                                                                   |
|  Version: 6.1.2                                                                                   |
|                                                                                                   |
|  This wizard sends telemetry data and crash reports to Sentry. This helps us improve the Wizard.  |
|  You can turn this off at any time by running sentry-wizard --disable-telemetry.                  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
|
!  You have uncommitted or untracked files in your repo:
|
|  - .gitignore
|
|  The wizard will create and update files.
|
o  Do you want to continue anyway?
|  Yes
|
•  If the browser window didn't open automatically, please open the following link to log into Sentry:
|
|  https://sentry.io/account/settings/wizard/7nr4qzvbwh2hdpge3rqzilyb5s0sr1l4n3uh7qwwoy9770udeq62oqwbsqm77ka0/?org_slug=metashark-tech-is&project_slug=javascript-nextjs&project_platform=javascript-nextjs
|
o  Login complete.
|
o  Selected project metashark-tech-is/javascript-nextjs
|
o  The @sentry/nextjs package is already installed. Do you want to update it to the latest version?
|  Yes
|
o  Updated @sentry/nextjs with PNPM.
|
o  Do you want to route Sentry requests in the browser through your Next.js server to avoid ad blockers?
|  No
|
•  Sounds good! We'll leave the option commented for later, just in case :)
|
o  Do you want to enable Tracing to track the performance of your application?
|  Yes
|
o  Do you want to enable Session Replay to get a video-like reproduction of errors during a user session?
|  Yes
|
o  Do you want to enable Logs to send your application logs to Sentry?
|  Yes
|
*  Created fresh sentry.server.config.ts.
|
*  Created fresh sentry.edge.config.ts.
|
*  Added new src\instrumentation.ts file.
|
*  Added new src\instrumentation-client.ts file.
|
*  Added Sentry configuration to next.config.mjs. (you probably want to clean this up a bit!)
|
*  Created src\app\global-error.tsx.
|
•  It seems like you already have a root layout component. Please add or modify your generateMetadata function.
|
o  Add the following code to your layout.tsx file:


      import * as Sentry from '@sentry/nextjs';
      import type { Metadata } from 'next';

      // Add or edit your "generateMetadata" to include the Sentry trace data:
      export function generateMetadata(): Metadata {
        return {
          // ... your existing metadata
          other: {
            ...Sentry.getTraceData()
          }
        };
      }


|
o  Did you apply the snippet above?
|  Yes, continue!
|
o  Do you want to create an example page ("/sentry-example-page") to test your Sentry setup?
|  Yes
|
*  Created src\app\sentry-example-page\page.tsx.
|
*  Created src\app\api\sentry-example-api\route.ts.
|
*  Created .env.sentry-build-plugin with auth token for you to test source map uploading locally.
|
•  .gitignore already has .env.sentry-build-plugin. Will not add it again.
|
o  Are you using a CI/CD tool to build and deploy your application?
|  Yes
|
o  Add the Sentry authentication token as an environment variable to your CI setup:

SENTRY_AUTH_TOKEN=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

|
!  DO NOT commit this auth token to your repository!
|
o  Did you configure CI as shown above?
|  Yes, continue!
|
o  Looks like you have Prettier in your project. Do you want to run it on your files?
|  Yes
|
o  Prettier has formatted your files.
|
—
Successfully installed the Sentry Next.js SDK!

You can validate your setup by (re)starting your dev environment (e.g. pnpm dev) and visiting "/sentry-example-page"

If you encounter any issues, let us know here: https://github.com/getsentry/sentry-javascript/issues


C:\Users\VAIO\apps\aaa-proyectos-propios\___marketing-afiliados-container\metashark-afiliados>
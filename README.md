# vite-plugin-build-routes

A Vite plugin to simplify the build of API routes: copy all files from a _target_ directory to a _build_ output directory.

## ⚙️ Install
```sh
yarn add -D vite-plugin-build-routes
```

## 📖 Usage

Example:
- `/server/api` as _target_ directory that contains `/server/api/user/index.ts` file
- `/dist` as _build_ output directory
- build with Vite (e.g. `yarn vite build`)
- the _result_ is `/dist/server/api/user/index.mjs`

### Register the Vite Plugin (example with [Vike](https://vike.dev))
```ts
// vite.config.ts
import vike from 'vike/plugin'
import { vikeNode } from 'vike-node/plugin'
import type { UserConfig } from 'vite'
import viteBuildRoutes from 'vite-plugin-build-routes'

export default {
  plugins: [
    vike(),
    vikeNode('server/index.ts'),
    viteBuildRoutes('server/api')
    // OR use a pattern instead of default '**/*.ts'
    // viteBuildRoutes({
    //   entry: 'server/api',
    //   pattern: '**/*.js'
    // })
  ]
} satisfies UserConfig
```

### Use the Server Plugin (example with [Hono](https://hono.dev))

Use the [universal-autorouter](https://github.com/node-ecosystem/universal-autorouter) package to automatically scan and load all routes to the server.

```ts
// /server/index.ts
import path from 'node:path'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import vike from 'vike-node/hono'
import autoloadRoutes from 'universal-autorouter'

const app = await autoloadRoutes(new Hono(), {
  pattern: process.env.NODE_ENV === 'production' ? '**/*.mjs' : '**/*.ts',
  prefix: '/api',
  routesDir: path.resolve(import.meta.dirname, 'api'),
  viteDevServer: globalThis.__vikeNode?.viteDevServer  // needed for Vite's HMR
})

app.use(vike())

const port = +(process.env.PORT || 3000)

serve({
  fetch: app.fetch,
  port
}, () => console.log(`Server running at http://localhost:${port}`))
```

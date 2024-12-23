# vite-plugin-api-autorouter

A Vite plugin that uses the [universal-autorouter](https://github.com/node-ecosystem/universal-autorouter) package to automatically scan the file system and load to a server all routes in a target directory.
This plugin simplifies the setup process with API routes in a Vite project.

## ⚙️ Install
```sh
yarn add -D vite-plugin-api-autorouter
```

## 📖 Usage

### Register the Vite Plugin (example with [Vike](https://vike.dev))
```ts
// vite.config.ts
import vike from 'vike/plugin'
import { vikeNode } from 'vike-node/plugin'
import type { UserConfig } from 'vite'
import viteApiAutoloader from 'vite-plugin-api-autorouter/plugin'

export default {
  plugins: [
    vike(),
    vikeNode('server/index.ts'),
    viteApiAutoloader('server/api')
  ]
} satisfies UserConfig
```

### Use the Server Plugin (example with [Hono](https://hono.dev))
```ts
// /server/index.ts
import path from 'node:path'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import vike from 'vike-node/hono'
import apiAutoloader from 'vite-plugin-api-autorouter/server'

const app = new Hono()

await apiAutoloader({
  app,
  prefix: '/api',
  routesDir: path.resolve(import.meta.dirname, 'api'),
  viteDevServer: globalThis.__vikeNode?.viteDevServer
})

app.use(vike())

const port = +(process.env.PORT || 3000)

serve({
  fetch: app.fetch,
  port
}, () => console.log(`Server running at http://localhost:${port}`))
```

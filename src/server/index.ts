import type { ViteDevServer } from 'vite'
import autoloadRoutes, { type App } from 'universal-autorouter'


const server = async <T>({ app, pattern, prefix, routesDir, viteDevServer }: {
  app: App<T>
  pattern?: string
  prefix?: string
  routesDir?: string
  viteDevServer: ViteDevServer
}): Promise<void> => {
  await autoloadRoutes(app, {
    pattern: process.env.NODE_ENV === 'production' ? '**/*.mjs' : (pattern || '**/*.ts'),
    prefix,
    routesDir,
    viteDevServer
  })
}

export default server

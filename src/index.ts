import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

import { injectRollupInputs } from './utils'

type PluginOptions = {
  entry: string // File path to bundle
  pattern?: string // File path pattern to bundle
}

const bundleFilesPlugin = (options: string | PluginOptions): Plugin => {
  return {
    name: 'vite-plugin-api-autorouter',
    apply: 'build',
    enforce: 'post',
    configResolved: (config) => {
      if (!config.build.ssr) return
      const { entry, pattern = '**/*.ts' } = typeof options === 'string' ? { entry: options } : (options as PluginOptions)

      const entryFull = path.resolve(config.root, entry)

      const filepaths = fs.globSync(pattern, { cwd: entryFull })

      // Remove "server/" prefix from entry
      const apiDir = entry.replace(/^server\//, '')
      const entries: Record<string, string> = {}
      for (const rawFilepath of filepaths) {
        // Normalize file paths for Windows
        const filepath = rawFilepath.replaceAll('\\', '/')
        // Use relative paths as keys to preserve directory structure
        const relativePath = `${apiDir}/${filepath.replace(/\.ts$/, '')}`
        entries[relativePath] = path.resolve(entryFull, filepath)
      }
      (config.build.rollupOptions.output as unknown as { sanitizeFileName: boolean }).sanitizeFileName = false;
      (config.build.rollupOptions.output as unknown as { entryFileNames: string }).entryFileNames = '[name].mjs'
      config.build.rollupOptions.input = injectRollupInputs(entries, config)
    }
  }
}

export default bundleFilesPlugin

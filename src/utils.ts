import type { ResolvedConfig } from 'vite'

//#region https://github.com/brillout/vite-plugin-server-entry/blob/main/src/utils/injectRollupInputs.ts
const normalizeRollupInput = (input?: string | string[] | Record<string, string>): Record<string, string> => {
  if (!input) {
    return {}
  }
  // Usually `input` is an oject, but the user can set it as a `string` or `string[]`
  if (typeof input === 'string') {
    input = [input]
  }
  if (Array.isArray(input)) {
    return Object.fromEntries(input.map((input) => [input, input]))
  }
  return input
}

export const injectRollupInputs = (inputsNew: Record<string, string>, config: ResolvedConfig): Record<string, string> => {
  const inputsCurrent = normalizeRollupInput(config.build.rollupOptions.input)
  const input = {
    ...inputsNew,
    ...inputsCurrent
  }
  return input
}
//#endregion

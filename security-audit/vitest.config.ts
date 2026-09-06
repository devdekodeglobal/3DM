import {defineConfig} from 'vitest/config'
export default defineConfig({esbuild:{jsx:'automatic'},test:{include:['security-audit/*.test.ts','security-audit/*.test.tsx'],environment:'node',maxWorkers:1}})

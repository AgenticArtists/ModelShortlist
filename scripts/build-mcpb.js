import { spawnSync } from 'node:child_process'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..')
const stagingDir = path.join(rootDir, '.mcpb-build')
const outputDir = path.join(rootDir, 'dist')
const packageJson = JSON.parse(await readFile(path.join(rootDir, 'package.json'), 'utf8'))
const outputFile = path.join(outputDir, `modelshortlist-${packageJson.version}.mcpb`)

const directoriesToCopy = ['mcp', 'lib', 'config']
const filesToCopy = ['package.json', 'package-lock.json', 'README.md', 'LICENSE', 'ATTRIBUTION.md']

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    ...options,
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`)
  }
}

await rm(stagingDir, { recursive: true, force: true })
await rm(outputFile, { force: true })
await mkdir(stagingDir, { recursive: true })
await mkdir(outputDir, { recursive: true })

for (const directory of directoriesToCopy) {
  await cp(path.join(rootDir, directory), path.join(stagingDir, directory), { recursive: true })
}

for (const file of filesToCopy) {
  await cp(path.join(rootDir, file), path.join(stagingDir, file))
}

const manifest = {
  manifest_version: '0.3',
  name: 'modelshortlist',
  display_name: 'ModelShortlist',
  version: packageJson.version,
  description: packageJson.description,
  long_description:
    'A local, bring-your-own-key MCP server that gives AI assistants current model-selection evidence from the OpenRouter model catalog and Artificial Analysis benchmarks. ModelShortlist keeps ZDR optional unless the user explicitly requires it and lets the host AI reason about workload-specific tradeoffs instead of imposing one universal ranking formula.',
  author: {
    name: 'AgenticArtists',
    url: 'https://agenticartists.com',
  },
  repository: {
    type: 'git',
    url: 'https://github.com/AgenticArtists/ModelShortlist',
  },
  homepage: 'https://modelshortlist.com',
  documentation: 'https://modelshortlist.com/install',
  support: 'https://github.com/AgenticArtists/ModelShortlist/issues',
  server: {
    type: 'node',
    entry_point: 'mcp/server.js',
    mcp_config: {
      command: 'node',
      args: ['${__dirname}/mcp/server.js'],
      env: {
        ARTIFICIAL_ANALYSIS_API_KEY: '${user_config.artificial_analysis_api_key}',
        OPENROUTER_API_KEY: '${user_config.openrouter_api_key}',
        MODEL_SELECTOR_CACHE_TTL_MS: '${user_config.cache_ttl_ms}',
      },
    },
  },
  user_config: {
    artificial_analysis_api_key: {
      type: 'string',
      title: 'Artificial Analysis API Key',
      description: 'Your Artificial Analysis Data API key used for benchmark and performance context.',
      sensitive: true,
      required: true,
    },
    openrouter_api_key: {
      type: 'string',
      title: 'OpenRouter API Key',
      description: 'Your OpenRouter API key used to read current model, pricing, capability, and endpoint metadata.',
      sensitive: true,
      required: true,
    },
    cache_ttl_ms: {
      type: 'string',
      title: 'Cache TTL (milliseconds)',
      description: 'Optional in-process cache TTL for upstream metadata.',
      required: false,
      default: '43200000',
    },
  },
  compatibility: {
    platforms: ['darwin', 'win32', 'linux'],
    runtimes: {
      node: '>=20',
    },
  },
  tools_generated: true,
}

await writeFile(path.join(stagingDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'

run(npmCommand, ['ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund'], {
  cwd: stagingDir,
})

run(npxCommand, ['-y', '@anthropic-ai/mcpb@2.1.2', 'validate', stagingDir])
run(npxCommand, ['-y', '@anthropic-ai/mcpb@2.1.2', 'pack', stagingDir, outputFile])

console.log(`MCPB bundle ready: ${path.relative(rootDir, outputFile)}`)

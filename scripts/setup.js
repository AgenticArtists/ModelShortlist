import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENV_PATH = path.join(ROOT, '.env.local')
const MCP_PATH = path.join(ROOT, 'mcp', 'server.js')

function parseEnv(text) {
  const values = {}
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const equals = line.indexOf('=')
    if (equals <= 0) continue
    const key = line.slice(0, equals).trim()
    let value = line.slice(equals + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    values[key] = value
  }
  return values
}

function maskPrompt(label) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error(
      'Interactive setup requires a terminal. Create .env.local from .env.local.example instead.',
    )
  }

  return new Promise((resolve, reject) => {
    const stdin = process.stdin
    const stdout = process.stdout
    let value = ''

    const finish = () => {
      stdin.setRawMode(false)
      stdin.pause()
      stdin.removeListener('data', onData)
      stdout.write('\n')
      resolve(value.trim())
    }

    const fail = (error) => {
      try {
        stdin.setRawMode(false)
      } catch {}
      stdin.pause()
      stdin.removeListener('data', onData)
      reject(error)
    }

    const onData = (chunk) => {
      const text = String(chunk)
      for (const char of text) {
        if (char === '\u0003') {
          stdout.write('\n')
          fail(new Error('Setup cancelled'))
          return
        }
        if (char === '\r' || char === '\n') {
          finish()
          return
        }
        if (char === '\u007f' || char === '\b') {
          if (value.length > 0) {
            value = value.slice(0, -1)
            stdout.write('\b \b')
          }
          continue
        }
        if (char < ' ') continue
        value += char
        stdout.write('*')
      }
    }

    stdout.write(label)
    stdin.setEncoding('utf8')
    stdin.setRawMode(true)
    stdin.resume()
    stdin.on('data', onData)
  })
}

function envFile(values) {
  return [
    '# OpenAnalysis local credentials',
    '# This file is gitignored. Do not commit it.',
    `ARTIFICIAL_ANALYSIS_API_KEY=${values.ARTIFICIAL_ANALYSIS_API_KEY}`,
    `OPENROUTER_API_KEY=${values.OPENROUTER_API_KEY}`,
    '',
    '# Optional. Best-effort in-process cache (12 hours).',
    `MODEL_SELECTOR_CACHE_TTL_MS=${values.MODEL_SELECTOR_CACHE_TTL_MS || '43200000'}`,
    '',
  ].join('\n')
}

function slashPath(value) {
  return value.replaceAll('\\', '/')
}

function printClientConfig() {
  const nodePath = slashPath(process.execPath)
  const serverPath = slashPath(MCP_PATH)
  const standardConfig = {
    mcpServers: {
      openanalysis: {
        command: nodePath,
        args: [serverPath],
      },
    },
  }
  const vscodeConfig = {
    servers: {
      openanalysis: {
        type: 'stdio',
        command: nodePath,
        args: [serverPath],
      },
    },
  }

  console.log('\nHermes Desktop / Cursor MCP config:')
  console.log(JSON.stringify(standardConfig, null, 2))
  console.log('\nVS Code / Copilot MCP config:')
  console.log(JSON.stringify(vscodeConfig, null, 2))
  console.log('\nThe generated config uses the exact Node executable running setup, so GUI clients do not need Node on their PATH.')
}

async function main() {
  console.log('OpenAnalysis setup')
  console.log('Your API keys are stored only in .env.local on this machine.')
  console.log('Input is masked and is not sent anywhere by this setup script.\n')

  const existing = fs.existsSync(ENV_PATH)
    ? parseEnv(fs.readFileSync(ENV_PATH, 'utf8'))
    : {}

  const values = {
    ARTIFICIAL_ANALYSIS_API_KEY: existing.ARTIFICIAL_ANALYSIS_API_KEY || '',
    OPENROUTER_API_KEY: existing.OPENROUTER_API_KEY || '',
    MODEL_SELECTOR_CACHE_TTL_MS: existing.MODEL_SELECTOR_CACHE_TTL_MS || '43200000',
  }

  if (!values.ARTIFICIAL_ANALYSIS_API_KEY) {
    values.ARTIFICIAL_ANALYSIS_API_KEY = await maskPrompt('Artificial Analysis API key: ')
  } else {
    console.log('Artificial Analysis API key: already configured')
  }

  if (!values.OPENROUTER_API_KEY) {
    values.OPENROUTER_API_KEY = await maskPrompt('OpenRouter API key: ')
  } else {
    console.log('OpenRouter API key: already configured')
  }

  if (!values.ARTIFICIAL_ANALYSIS_API_KEY || !values.OPENROUTER_API_KEY) {
    throw new Error('Both API keys are required')
  }

  fs.writeFileSync(ENV_PATH, envFile(values), { encoding: 'utf8', mode: 0o600 })

  console.log(`\nSaved local credentials to ${ENV_PATH}`)
  printClientConfig()
  console.log('\nNext: paste the appropriate config into your MCP client, then start a new chat.')
  console.log('Try: "Use OpenAnalysis to recommend a model for my workload."')
}

main().catch((error) => {
  console.error(`\nSetup failed: ${error.message}`)
  process.exitCode = 1
})

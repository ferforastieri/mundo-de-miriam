import { pbkdf2Sync, randomBytes, randomUUID } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ITERATIONS = 100_000
const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseArgs(argv) {
  const args = {}

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]

    if (item === '--local') {
      args.local = true
      continue
    }

    if (item.startsWith('--')) {
      const key = item.slice(2)
      args[key] = argv[index + 1]
      index += 1
    }
  }

  return args
}

function escapeSql(value) {
  return String(value).replaceAll("'", "''")
}

const args = parseArgs(process.argv.slice(2))
const email = String(args.email || process.env.ADMIN_EMAIL || '').trim().toLowerCase()
const password = String(args.password || process.env.ADMIN_PASSWORD || '')

if (!email || !password) {
  console.error('Uso: node scripts/seed-admin.mjs --email <email> --password <senha> [--local]')
  process.exit(1)
}

if (password.length < 12) {
  console.error('A senha precisa ter pelo menos 12 caracteres.')
  process.exit(1)
}

const salt = randomBytes(16)
const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256')
const now = new Date().toISOString()

const sql = `
INSERT INTO admin_users
  (id, email, password_hash, password_salt, password_iterations, created_at, updated_at)
VALUES
  ('${randomUUID()}', '${escapeSql(email)}', '${hash.toString('base64')}', '${salt.toString('base64')}', ${ITERATIONS}, '${now}', '${now}')
ON CONFLICT(email) DO UPDATE SET
  password_hash = excluded.password_hash,
  password_salt = excluded.password_salt,
  password_iterations = excluded.password_iterations,
  updated_at = excluded.updated_at;

DELETE FROM sessions
WHERE admin_user_id = (SELECT id FROM admin_users WHERE email = '${escapeSql(email)}');
`

const tmpDirectory = path.join(apiRoot, '.tmp')
const sqlFile = path.join(tmpDirectory, 'seed-admin.sql')

await mkdir(tmpDirectory, { recursive: true })
await writeFile(sqlFile, sql, 'utf8')

const mode = args.local ? '--local' : '--remote'
const result = spawnSync(
  'npx',
  ['wrangler', 'd1', 'execute', 'mundo-de-miriam', mode, `--file=${sqlFile}`, '--yes'],
  { stdio: 'inherit', cwd: apiRoot, shell: false }
)

if (result.status !== 0) {
  process.exit(result.status || 1)
}

console.log(`\nAdmin provisionado: ${email} (${args.local ? 'local' : 'remoto'})`)

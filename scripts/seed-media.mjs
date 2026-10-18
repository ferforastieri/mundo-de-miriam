import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif'
}

const SCREEN_FILES = [
  {
    screenId: 'artistic',
    directory: 'public/assets/artisticstyle',
    prefix: /^ArtisticStyle(\d+)\.jpeg$/i,
    alt: (_, index) => `Artistic Style ${index + 1}`
  },
  {
    screenId: 'beauty',
    directory: 'public/assets/beautystyle',
    prefix: /^Beauty Style(\d+)\.jpeg$/i,
    alt: (_, index) => `Beauty Style ${index + 1}`
  },
  {
    screenId: 'ecommerce',
    directory: 'public/assets/e-commerce',
    prefix: /^e-comerce(\d+)\.jpeg$/i,
    alt: (_, index) => `E-commerce ${index + 1}`
  },
  {
    screenId: 'profile',
    directory: 'public/assets/profile',
    files: ['fotodalinda.jpg'],
    alt: () => 'Miriam Cléres Forastieri'
  },
  {
    screenId: 'curriculum',
    directory: 'public/assets/profile',
    files: ['fundo-cursos.jpg'],
    alt: () => 'Miriam Cléres Forastieri'
  },
  {
    screenId: 'mimelie',
    directory: 'public/assets/mimelie',
    files: ['mimelie-symbol.png'],
    alt: () => 'Símbolo da Mimelie'
  },
  {
    screenId: 'partnerships',
    groups: [
      {
        groupId: 'chocolashes',
        directory: 'public/assets/partnership/chocolashes',
        prefix: /^chocolashes(\d+)\.jpeg$/i,
        alt: (name, index) => `${name} ${index + 1}`
      },
      {
        groupId: 'freshlady',
        directory: 'public/assets/partnership/freshlady',
        prefix: /^freashlady(\d+)\.jpeg$/i,
        alt: (name, index) => `${name} ${index + 1}`
      },
      {
        groupId: 'gliben',
        directory: 'public/assets/partnership/gliben',
        prefix: /^gliben(\d+)\.jpeg$/i,
        alt: (name, index) => `${name} ${index + 1}`
      },
      {
        groupId: 'icoice',
        directory: 'public/assets/partnership/icoice',
        prefix: /^icoice(\d+)\.jpeg$/i,
        alt: (name, index) => `${name} ${index + 1}`
      },
      {
        groupId: 'ttdeye',
        directory: 'public/assets/partnership/ttdeye',
        prefix: /^ttdeye(\d+)\.jpeg$/i,
        alt: (name, index) => `${name} ${index + 1}`
      },
      {
        groupId: 'unibling',
        directory: 'public/assets/partnership/unibling',
        prefix: /^unibling(\d+)\.jpeg$/i,
        alt: (name, index) => `${name} ${index + 1}`
      }
    ]
  }
]

function parseArgs(argv) {
  const args = { url: 'http://127.0.0.1:8787' }

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]

    if (!item.startsWith('--')) continue

    const key = item.slice(2)

    if (['force', 'dry-run'].includes(key)) {
      args[key] = true
      continue
    }

    args[key] = argv[index + 1]
    index += 1
  }

  return args
}

function extensionOf(fileName) {
  return path.extname(fileName).toLowerCase()
}

async function listScreenFiles(config) {
  const directory = path.join(process.cwd(), config.directory)
  const entries = await readdir(directory)
  const files = config.files
    ? entries.filter((entry) => config.files.includes(entry))
    : entries.filter((entry) => config.prefix?.test(entry))

  return files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
}

function groupNameById(screens, groupId) {
  for (const screen of screens) {
    const group = screen.groups?.find((item) => item.id === groupId)
    if (group) return group.name
  }
  return groupId
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const email = args.email || process.env.ADMIN_EMAIL
  const password = args.password || process.env.ADMIN_PASSWORD
  const baseUrl = String(args.url || '').replace(/\/+$/, '')

  if (!email || !password) {
    console.error(
      'Uso: node scripts/seed-media.mjs --email <email> --password <senha> [--url https://...] [--only beauty] [--force] [--dry-run]'
    )
    process.exit(1)
  }

  const loginResponse = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!loginResponse.ok) {
    console.error('Falha no login:', await loginResponse.text())
    process.exit(1)
  }

  const cookies = loginResponse.headers.getSetCookie?.() || []
  const cookie = cookies.map((item) => item.split(';')[0]).join('; ')

  if (!cookie) {
    console.error('O login não retornou cookie de sessão.')
    process.exit(1)
  }

  const screensResponse = await fetch(`${baseUrl}/api/admin/screens`, {
    headers: { cookie }
  })

  if (!screensResponse.ok) {
    console.error('Falha ao carregar as telas:', await screensResponse.text())
    process.exit(1)
  }

  const { screens } = await screensResponse.json()
  const screensById = new Map(screens.map((screen) => [screen.id, screen]))
  const onlyScreens = args.only ? String(args.only).split(',').map((item) => item.trim()) : null

  let uploaded = 0
  let skipped = 0
  let failed = 0

  for (const screenConfig of SCREEN_FILES) {
    if (onlyScreens && !onlyScreens.includes(screenConfig.screenId)) continue

    const screen = screensById.get(screenConfig.screenId)

    if (!screen) {
      console.warn(`- Tela não encontrada, ignorando: ${screenConfig.screenId}`)
      continue
    }

    const existingResponse = await fetch(
      `${baseUrl}/api/admin/photos?screenId=${encodeURIComponent(screenConfig.screenId)}`,
      { headers: { cookie } }
    )

    const existing = existingResponse.ok ? (await existingResponse.json()).photos : []

    if (existing.length > 0 && !args.force && !screenConfig.groups) {
      console.log(`- ${screenConfig.screenId}: já possui ${existing.length} foto(s), ignorando (use --force para duplicar).`)
      skipped += 1
      continue
    }

    const targets = screenConfig.groups
      ? screenConfig.groups.map((group) => ({
          ...group,
          groupName: groupNameById(screens, group.groupId)
        }))
      : [{ ...screenConfig, groupId: null }]

    for (const target of targets) {
      if (target.groupId) {
        const groupPhotos = existing.filter((photo) => photo.groupId === target.groupId)

        if (groupPhotos.length > 0 && !args.force) {
          console.log(`- ${screenConfig.screenId}/${target.groupId}: já possui ${groupPhotos.length} foto(s), ignorando.`)
          skipped += 1
          continue
        }
      }

      const files = await listScreenFiles(target)

      if (files.length === 0) {
        console.warn(`- ${screenConfig.screenId}: nenhum arquivo encontrado em ${target.directory}`)
        continue
      }

      for (const [index, fileName] of files.entries()) {
        const absolutePath = path.join(process.cwd(), target.directory, fileName)
        const extension = extensionOf(fileName)
        const contentType = CONTENT_TYPES[extension]

        if (!contentType) {
          console.warn(`- Formato não suportado, ignorando: ${absolutePath}`)
          skipped += 1
          continue
        }

        const alt =
          typeof target.alt === 'function'
            ? target.alt(target.groupName || screen.name, index)
            : `${target.groupName || screen.name} ${index + 1}`

        if (args['dry-run']) {
          console.log(`[dry-run] ${screenConfig.screenId}/${target.groupId || '-'} <- ${fileName}`)
          continue
        }

        const body = await readFile(absolutePath)
        const query = new URLSearchParams({
          screenId: screenConfig.screenId,
          fileName,
          alt
        })

        if (target.groupId) query.set('groupId', target.groupId)

        const uploadResponse = await fetch(
          `${baseUrl}/api/admin/photos/upload?${query.toString()}`,
          {
            method: 'POST',
            headers: {
              cookie,
              'content-type': contentType
            },
            body
          }
        )

        if (!uploadResponse.ok) {
          failed += 1
          console.error(`- Falha ao enviar ${fileName}: ${await uploadResponse.text()}`)
          continue
        }

        uploaded += 1
        console.log(`+ ${screenConfig.screenId}/${target.groupId || '-'} <- ${fileName}`)
      }
    }
  }

  console.log(`\nConcluído: ${uploaded} enviada(s), ${skipped} ignorada(s), ${failed} falha(s).`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

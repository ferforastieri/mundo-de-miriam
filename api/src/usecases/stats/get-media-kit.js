import { toPublicPhoto } from '../../mappers/photo.mapper.js'
import { toScreen } from '../../mappers/screen.mapper.js'
import { toInstagramState } from '../../mappers/instagram.mapper.js'
import { isoDaysAgo, nowIso } from '../../utils/dates.js'

const MAX_PROPOSAL_PHOTOS = 6

function sortPhotos(photos) {
  return [...photos].sort((a, b) => {
    const featured = Number(b.is_featured) - Number(a.is_featured)
    return featured || Number(a.sort_order) - Number(b.sort_order)
  })
}

function photosForScreen(photos, screenId) {
  return photos.filter((photo) => photo.screen_id === screenId)
}

function isImage(photo) {
  return String(photo.content_type || 'image/').startsWith('image/')
}

function imagesForScreen(photos, screenId) {
  return photosForScreen(photos, screenId).filter(isImage)
}

function pickPhotos(photos, limit = MAX_PROPOSAL_PHOTOS) {
  return sortPhotos(photos).slice(0, limit).map(toPublicPhoto)
}

function findScreen(screens, predicate, fallbackId) {
  return screens.find(predicate) || screens.find((screen) => screen.id === fallbackId) || null
}

function buildProposal(screens, photos, predicate, fallbackId) {
  const screen = findScreen(screens, predicate, fallbackId)

  if (!screen) {
    return { screen: null, photos: [] }
  }

  return {
    screen: toScreen(screen),
    photos: pickPhotos(imagesForScreen(photos, screen.id))
  }
}

function dailyRows(rows, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  const byDay = new Map()

  for (const row of rows) {
    const time = new Date(row.captured_at).getTime()

    if (!Number.isFinite(time) || time < cutoff) continue

    // A coleta roda de hora em hora; para os totais do período usamos
    // apenas o último registro de cada dia.
    byDay.set(String(row.captured_at).slice(0, 10), row)
  }

  return [...byDay.values()]
}

function sumBy(rows, key) {
  return rows.reduce((total, row) => total + (Number(row[key]) || 0), 0)
}

function summarizePeriod(rows, days) {
  const daily = dailyRows(rows, days)
  const accountViews = daily.filter((row) => row.views !== null && row.views !== undefined)

  return {
    days,
    samples: daily.length,
    from: daily[0]?.captured_at || null,
    to: daily.at(-1)?.captured_at || null,
    views: daily.reduce((total, row) => {
      const value = row.views ?? row.recent_views ?? 0
      return total + (Number(value) || 0)
    }, 0),
    viewsSource: accountViews.length > 0 ? 'account' : 'media',
    newFollowers: sumBy(daily, 'new_followers'),
    interactions:
      sumBy(daily, 'total_interactions') || sumBy(daily, 'recent_interactions')
  }
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function audienceSplit(demographics) {
  const row = [...demographics]
    .reverse()
    .find((entry) => entry.breakdown === 'follow_type')

  if (!row) return null

  const payload = parseJson(row.payload, [])
  let followers = 0
  let nonFollowers = 0

  for (const item of Array.isArray(payload) ? payload : []) {
    const dimensions = item.dimension_values || item.dimensionValues || []
    const label = String(
      item.key ?? (Array.isArray(dimensions) ? dimensions[0] : dimensions) ?? ''
    ).toUpperCase()
    const value = Number(item.value ?? item.total_value?.value ?? 0)

    if (!Number.isFinite(value)) continue

    if (label.includes('NON')) {
      nonFollowers += value
    } else if (label.includes('FOLLOWER')) {
      followers += value
    }
  }

  const total = followers + nonFollowers

  if (!total) return null

  return {
    followers: Math.round((followers / total) * 1000) / 10,
    nonFollowers: Math.round((nonFollowers / total) * 1000) / 10
  }
}

function buildProfile(state, latest, photos, screens, env) {
  const profileScreen =
    findScreen(
      screens,
      (screen) =>
        screen.id === 'profile' ||
        (screen.kind === 'single' && /perfil/i.test(`${screen.name} ${screen.menu_label}`)),
      'profile'
    ) || null

  const profilePhoto = profileScreen
    ? sortPhotos(imagesForScreen(photos, profileScreen.id))[0]
    : null

  return {
    username: state?.username || env?.INSTAGRAM_USERNAME || null,
    fullName: state?.full_name || null,
    biography: state?.biography || null,
    website: state?.website || env?.PUBLIC_SITE_URL || null,
    profilePictureUrl: state?.profile_picture_url || null,
    avatarUrl: profilePhoto ? toPublicPhoto(profilePhoto).url : null,
    followers: latest?.followers ?? null,
    posts: latest?.posts ?? null,
    following: state?.follows_count ?? null
  }
}

export async function getMediaKit(container) {
  const [screens, groups, photos, allPhotos, latest, state, history, demographics] =
    await Promise.all([
      container.screens.listAll(),
      container.groups.listAll(),
      container.photos.listAllVisible(),
      container.photos.listAll(),
      container.instagram.latestSuccessful(),
      container.instagram.getState(),
      container.instagram.listSuccessfulSince(isoDaysAgo(90)),
      container.instagram.listDemographics()
    ])

  const partnershipScreen =
    findScreen(screens, (screen) => screen.kind === 'partnerships', 'partnerships') || null

  const partnerGroups = partnershipScreen
    ? groups
        .filter((group) => group.screen_id === partnershipScreen.id)
        .map((group) => {
          const allGroupPhotos = allPhotos.filter(
            (photo) => photo.screen_id === partnershipScreen.id && photo.group_id === group.id
          )
          const visibleGroupPhotos = photos.filter(
            (photo) => photo.screen_id === partnershipScreen.id && photo.group_id === group.id
          )
          const visibleImages = sortPhotos(visibleGroupPhotos.filter(isImage))
          const allImages = sortPhotos(allGroupPhotos.filter(isImage))

          // A colagem do material usa as fotos visíveis. Se a marca só tiver
          // fotos ocultas (albuns privados), ela ainda aparece no PDF, para
          // nao desaparecer da apresentacao.
          const groupImages = visibleImages.length > 0 ? visibleImages : allImages

          return {
            id: group.id,
            name: group.name,
            closed: Boolean(group.is_closed),
            photoCount: allImages.length,
            coverUrl: groupImages[0] ? toPublicPhoto(groupImages[0]).url : null,
            photos: groupImages.slice(0, 4).map(toPublicPhoto)
          }
        })
    : []

  // As listas vêm exatamente das marcas cadastradas em Parcerias:
  // - "Feitas" reúne as marcas que já têm fotos cadastradas (mesmo ocultas).
  // - "Fechadas" usa apenas a marcação feita no painel.
  // Uma marca pode estar nas duas listas (parceria antiga + novo contrato).
  const doneNames = partnerGroups
    .filter((group) => group.photoCount > 0)
    .map((group) => group.name)
    .filter(Boolean)
  const closedNames = partnerGroups
    .filter((group) => group.closed)
    .map((group) => group.name)
    .filter(Boolean)

  const beauty = buildProposal(
    screens,
    photos,
    (screen) => screen.id === 'beauty' || /beauty/i.test(`${screen.name} ${screen.menu_label}`),
    'beauty'
  )

  const artistic = buildProposal(
    screens,
    photos,
    (screen) =>
      screen.id === 'artistic' || /art[íi]stic/i.test(`${screen.name} ${screen.menu_label}`),
    'artistic'
  )

  const last90Days = summarizePeriod(history, 90)
  const last30Days = summarizePeriod(history, 30)
  const split = audienceSplit(demographics)

  if (split) {
    last90Days.followers = split.followers
    last90Days.nonFollowers = split.nonFollowers
    last30Days.followers = split.followers
    last30Days.nonFollowers = split.nonFollowers
  }

  return {
    generatedAt: nowIso(),
    site: {
      url: container.env.PUBLIC_SITE_URL || null
    },
    profile: buildProfile(state, latest, photos, screens, container.env),
    partnerships: {
      screen: partnershipScreen ? toScreen(partnershipScreen) : null,
      groups: partnerGroups,
      done: doneNames,
      closed: closedNames
    },
    proposals: {
      beauty,
      artistic
    },
    insights: {
      last90Days,
      last30Days
    },
    instagramState: toInstagramState(state)
  }
}

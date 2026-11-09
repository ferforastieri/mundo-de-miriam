import { toPublicPhoto } from '../../mappers/photo.mapper.js'
import { toScreen } from '../../mappers/screen.mapper.js'
import { toInstagramState } from '../../mappers/instagram.mapper.js'
import { isoDaysAgo, nowIso } from '../../utils/dates.js'
import { buildInsightPeriods } from './instagram-insights.js'

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

export async function getMediaKit(container, options = {}) {
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

  // O PDF usa exatamente o mesmo recorte do painel: o período escolhido
  // no filtro, além dos blocos fixos de 7/30/90 dias.
  const insights = buildInsightPeriods(history, demographics, options.days)

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
    insights,
    instagramState: toInstagramState(state)
  }
}

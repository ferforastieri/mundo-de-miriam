import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import galleryService from '@/api/gallery/GalleryService.js'

const GALLERY_QUERY_KEY = ['public-gallery']
const MENU_KINDS = ['gallery', 'partnerships']

export function usePublicGallery() {
  return useQuery({
    queryKey: GALLERY_QUERY_KEY,
    queryFn: () => galleryService.getGallery(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1
  })
}

/**
 * Telas que aparecem nos menus (galerias e parcerias), na ordem definida
 * no painel. Tudo vem do banco — nada fixo no código.
 */
export function usePublicScreens() {
  const query = usePublicGallery()

  const screens = computed(() =>
    (query.data.value?.screens || []).filter((screen) => MENU_KINDS.includes(screen.kind))
  )

  return { ...query, screens }
}

export function screenPath(screen) {
  return `/galeria/${screen.id}`
}

/** Imagem de capa de uma tela (primeira foto ou capa do primeiro grupo com fotos). */
export function screenCover(screen) {
  if (screen?.groups?.length) {
    const group = screen.groups.find((item) => item.photos?.length)
    const cover = group?.photos?.find((photo) => photo.featured) || group?.photos?.[0]
    return cover?.url || null
  }

  return screen?.photos?.[0]?.url || null
}

export function useGalleryScreen(screenId) {
  const query = usePublicGallery()

  const screen = computed(() => {
    return query.data.value?.screens?.find((item) => item.id === screenId) || null
  })

  const photos = computed(() => screen.value?.photos || [])

  return { ...query, screen, photos }
}

/** Foto de uma tela "single" usada como conteúdo de uma seção do site. */
export function useSitePhoto(screenId) {
  const { data } = usePublicGallery()

  return computed(() => {
    const screen = data.value?.screens?.find((item) => item.id === screenId)
    const photo = screen?.photos?.find((item) => item.url)
    return photo?.url || null
  })
}

import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import galleryService from '@/api/gallery/GalleryService.js'

const GALLERY_QUERY_KEY = ['public-gallery']

export function usePublicGallery() {
  return useQuery({
    queryKey: GALLERY_QUERY_KEY,
    queryFn: () => galleryService.getGallery(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1
  })
}

export function useGalleryScreen(screenId) {
  const query = usePublicGallery()

  const screen = computed(() => {
    return query.data.value?.screens?.find((item) => item.id === screenId) || null
  })

  const photos = computed(() => screen.value?.photos || [])

  return { ...query, screen, photos }
}

export function useSitePhoto(screenId, fallback) {
  const { data } = usePublicGallery()

  return computed(() => {
    const screen = data.value?.screens?.find((item) => item.id === screenId)
    const photo = screen?.photos?.find((item) => item.url)
    return photo?.url || fallback
  })
}

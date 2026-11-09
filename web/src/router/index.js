import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import HomeView from '../views/home/HomeView.vue'
import AboutView from '../views/about/AboutView.vue'
import CurriculumView from '../views/curriculum/CurriculumView.vue'
import AdminLayout from '../layouts/admin/AdminLayout.vue'
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import { useAdminAuth } from '../composables/useAdminAuth'
import { applySeo } from '../seo'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/curriculum',
    name: 'Curriculum',
    component: CurriculumView
  },
  // URLs antigas das telas → rota dinâmica (as telas vivem no banco)
  { path: '/beauty-portfolio', redirect: '/galeria/beauty' },
  { path: '/artistic-portfolio', redirect: '/galeria/artistic' },
  { path: '/ecommerce', redirect: '/galeria/ecommerce' },
  { path: '/partnerships', redirect: '/galeria/partnerships' },
  {
    path: '/galeria/:screenId',
    name: 'Gallery',
    component: () => import('../views/portfolio/GalleryView.vue')
  },
  {
    path: '/a/:token',
    name: 'SharedScreen',
    component: () => import('../views/private/PrivateGalleryView.vue'),
    meta: { noindex: true, title: 'Fotos compartilhadas' }
  },
  { path: '/album/:token', redirect: (to) => ({ path: `/a/${to.params.token}` }) },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLoginView,
    meta: { noindex: true, title: 'Entrar' }
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: { name: 'AdminDashboard' },
    meta: { requiresAdmin: true, noindex: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/AdminDashboardView.vue'),
        meta: { title: 'Visão geral' }
      },
      {
        path: 'content',
        name: 'AdminContent',
        component: () => import('../views/admin/AdminContentView.vue'),
        meta: { title: 'Telas e fotos' }
      },
      {
        path: 'photos',
        redirect: { name: 'AdminContent', query: { tab: 'photos' } }
      },
      {
        path: 'screens',
        redirect: { name: 'AdminContent', query: { tab: 'screens' } }
      },
      {
        path: 'instagram',
        name: 'AdminInstagram',
        component: () => import('../views/admin/AdminInstagramView.vue'),
        meta: { title: 'Instagram' }
      },
      {
        path: 'publish',
        name: 'AdminPublish',
        component: () => import('../views/admin/AdminPublishView.vue'),
        meta: { title: 'Publicar' }
      },
      { path: 'branding', redirect: { name: 'AdminContent', query: { tab: 'screens' } } },
      {
        path: 'account',
        name: 'AdminAccount',
        component: () => import('../views/admin/AdminAccountView.vue'),
        meta: { title: 'Minha conta' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'auto' }
  }
})

router.beforeEach(async (to) => {
  const { loadMe } = useAdminAuth()

  if (to.meta.requiresAdmin) {
    const admin = await loadMe()

    if (!admin) {
      return {
        name: 'AdminLogin',
        query: { redirect: to.fullPath }
      }
    }
  }

  if (to.name === 'AdminLogin') {
    const admin = await loadMe()

    if (admin) {
      return { name: 'AdminDashboard' }
    }
  }

  return true
})

router.afterEach(async (to) => {
  if (to.meta.noindex) {
    setRobotsMeta('noindex,nofollow')

    if (to.path.startsWith('/admin')) {
      document.title = to.meta.title
        ? `${to.meta.title} · Painel Mundo de Miriam`
        : 'Painel · Mundo de Miriam'
    } else {
      document.title = to.meta.title || 'Mundo de Miriam'
    }
  } else {
    setRobotsMeta('index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1')
    applySeo(to.path)
  }

  await nextTick()
  window.scrollTo({ left: 0, top: 0, behavior: 'auto' })
  document
    .querySelectorAll('.portfolio-layout, .partnerships-layout')
    .forEach((element) => element.scrollTo({ left: 0, top: 0, behavior: 'auto' }))
})

function setRobotsMeta(content) {
  let meta = document.head.querySelector('meta[name="robots"]')

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'robots')
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}

export default router

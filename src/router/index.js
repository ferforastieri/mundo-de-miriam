import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import AboutView from '../views/about/AboutView.vue'
import CurriculumView from '../views/curriculum/CurriculumView.vue'
import BeautyPortfolio from '../views/portfolio/BeautyPortfolio.vue'
import ArtisticPortfolio from '../views/portfolio/ArtisticPortfolio.vue'
import PartnershipsPortfolio from '../views/portfolio/PartnershipsPortfolio.vue'
import EcommercePortfolio from '../views/portfolio/EcommercePortfolio.vue'

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
  {
    path: '/beauty-portfolio',
    name: 'BeautyPortfolio',
    component: BeautyPortfolio
  },
  {
    path: '/artistic-portfolio',
    name: 'ArtisticPortfolio',
    component: ArtisticPortfolio
  },
  {
    path: '/partnerships',
    name: 'PartnershipsPortfolio',
    component: PartnershipsPortfolio
  },
  {
    path: '/ecommerce',
    name: 'EcommercePortfolio',
    component: EcommercePortfolio
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
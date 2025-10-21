// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/views/admin/Admin.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/admin',
    component: Admin,
    children: [
      {
        path: 'system/analysis',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'system/role',
        name: 'SystemRole',
        component: () => import('@/views/admin/SystemRole.vue')
      },
      {
        path: 'user/update',
        name: 'UserUpdate',
        component: () => import('@/views/admin/UserUpdate.vue')
      },
      {
        path: 'user/insert',
        name: 'UserInsert',
        component: () => import('@/views/admin/UserInsert.vue')
      },
      {
        path: 'water-quality/prediction',
        name: 'WaterQualityPrediction',
        component: () => import('@/views/admin/WaterQualityPrediction.vue')
      },
      {
        path: 'water-quality/advice',
        name: 'PredictionAdvice',
        component: () => import('@/views/admin/PredictionAdvice.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
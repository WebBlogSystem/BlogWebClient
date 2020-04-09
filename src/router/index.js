import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/essay/EssayList')
  },
  {
    path: '/logincenter',
    component: () => import('@/views/loginCenter/LoginServe'),
    children: [
      {
        path: 'register',
        component: () => import('@/views/loginCenter/Register')
      },
      {
        path: 'login',
        component: () => import('@/views/loginCenter/Login')
      }
    ]
  },
  {
    path: '/user',
    component: () => import('@/views/user/UserServe'),
    children: [
      {
        path: 'userinfo',
        component: () => import('@/views/user/UserInfo'),
        meta: { requiresAuth: true }
      },
      {
        path: 'addessay',
        component: () => import('@/views/user/AddEssay'),
        meta: { requiresAuth: true }
      },
      {
        path: 'blogmanagement',
        component: () => import('@/views/essay/EssayList'),
        meta: { requiresAuth: true }
      },
      {
        path: 'catemanagement',
        component: () => import('@/views/user/CateManagement'),
        meta: { requiresAuth: true }
      },
      {
        path: 'editessay',
        component: () => import('@/views/essay/EditEssay'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/otheruser',
    component: () => import('@/views/other/OtherServe'),
    children: [
      {
        path: 'essaylist',
        component: () => import('@/views/essay/EssayList')
      },
      {
        path: 'essaydetail',
        component: () => import('@/views/essay/EssayDetail')
      }
    ]
  },
  {
    path: '/social',
    component: () => import('@/views/social/SocialServe'),
    children: [
      {
        path: 'comment',
        component: () => import('@/views/social/Comment'),
        meta: { requiresAuth: true }
      },
      {
        path: 'reply',
        component: () => import('@/views/social/Reply'),
        meta: { requiresAuth: true }
      },
      {
        path: 'attention',
        component: () => import('@/views/social/Attention'),
        meta: { requiresAuth: true }
      },
      {
        path: 'fan',
        component: () => import('@/views/social/Fan'),
        meta: { requiresAuth: true }
      },
      {
        path: 'letter',
        component: () => import('@/views/social/Letter'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/*',
    component: () => import('@/views/error/404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

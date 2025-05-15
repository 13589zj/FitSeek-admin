import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UserListView from '../views/UserListView.vue'
// 暂时注释掉未实现的组件路由
// import AnnouncementForm from '../views/announcement/AnnouncementForm.vue'
// import ArticleEditor from '../views/article/ArticleEditor.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', redirect: '/login' },
  { path: '/users', component: UserListView },
  // 暂时注释掉未实现的路由
  // { path: '/announcements', component: AnnouncementForm },
  // { path: '/articles', component: ArticleEditor }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
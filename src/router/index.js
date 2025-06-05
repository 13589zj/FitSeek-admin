import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UserListView from '../views/UserListView.vue'
import AnnouncementForm from '../views/announcement/AnnouncementForm.vue'
import ArticleEditor from '../views/article/ArticleEditor.vue'
import AnnouncementManagement from '../views/announcement/AnnouncementManagement.vue'
import ArticleManagement from '../views/article/ArticleManagement.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', redirect: '/login' },
  { path: '/users', component: UserListView },
  { path: '/announcements', component: AnnouncementForm },
  { path: '/articles', component: ArticleEditor },
  { path: '/announcement-management', component: AnnouncementManagement },
  { path: '/article-management', component: ArticleManagement }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
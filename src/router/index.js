import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UserListView from '../views/UserListView.vue'
import AnnouncementForm from '../views/announcement/AnnouncementForm.vue'
import ArticleEditor from '../views/article/ArticleEditor.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', redirect: '/login' },
  { path: '/users', component: UserListView },
  { path: '/announcements', component: AnnouncementForm },
  { path: '/articles', component: ArticleEditor }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
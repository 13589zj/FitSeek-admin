import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UserListView from '../views/UserListView.vue'
import AnnouncementForm from '../views/announcement/AnnouncementForm.vue'
import ArticleEditor from '../views/article/ArticleEditor.vue'
import AnnouncementManagement from '../views/announcement/AnnouncementManagement.vue'
import ArticleManagement from '../views/article/ArticleManagement.vue'
import FoodLibrary from '../views/FoodLibrary.vue'
import TrainLibrary from '../views/TrainLibrary.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', redirect: '/login' },
  { path: '/users', component: UserListView },
  { path: '/announcements', component: AnnouncementForm },
  { path: '/articles', component: ArticleEditor },
  { path: '/announcement-management', component: AnnouncementManagement },
  { path: '/article-management', component: ArticleManagement },
  { path: '/food-library', component: FoodLibrary },
  { path: '/train-library', component: TrainLibrary }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
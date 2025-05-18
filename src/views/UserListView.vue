<template>
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-content">
        <span class="logo">FitSeek</span>
        <div class="admin-info">管理员：{{ adminName }}</div>
      </div>
    </div>

    <div style="display: flex; flex: 1;">
      <!-- 侧边栏 -->
      <el-menu
        default-active="/users"
        class="el-menu-vertical"
        
        router
      >
        <el-menu-item index="/users">
          <el-icon><user /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/announcements">
          <el-icon><notification /></el-icon>
          <span>公告管理</span>
        </el-menu-item>
        <el-menu-item index="/articles">
          <el-icon><document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
      </el-menu>

      <!-- 主要内容区域 -->
      <div class="content-container">
        <!-- 用户数量卡片 -->
        <el-card class="stats-card">
          <h2 style="margin-bottom: 20px;">用户概况</h2>
          <!-- <div class="card-content">
            <span class="card-title">用户数量</span>
            <span class="card-value">{{ users.length }}</span>
          </div> -->
        </el-card>

        <!-- 用户列表 -->
        <el-card class="user-list-card">
          <h2 style="margin-bottom: 20px;">用户列表</h2>
          <el-table :data="users" border style="width: 100%">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="tel" label="电话号码" />
          </el-table>
        </el-card>

        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import {
  User,
  Notification,
  Document,
  Search,
  Check,
  Plus
} from '@element-plus/icons-vue'

export default defineComponent({
  components: {
    User,
    Notification,
    Document
  },
  data() {
    return {
      adminName: "系统管理员",
      users: [
        { username: '张三', tel: '13800000000' },
        { username: '李四', tel: '13900000000' }
      ]
    }
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const api = await import('../services/api')
        const res = await api.default.get('/admin/users')
        this.users = res.data
      } catch (err) {
        alert('加载用户失败')
      }
    }
  }
})
</script>

<style scoped>
/* 顶部导航栏样式 */
.header {
  background-color: #e8f5e9;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.admin-info {
  font-size: 16px;
  color: #666;
}

.el-menu-vertical {
  width: 200px;
  border-right: 1px solid #e6e6e6;
  background: #ffffff;
}
/* 内容容器 */
.content-container {
  flex: 1;
  padding: 24px;
  background-color: #f5f7fa;
}

/* 统计卡片样式 */
.stats-card {
  margin-bottom: 24px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.card-title {
  font-size: 16px;
  color: #909399;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #67C23A;
}

/* 用户列表卡片 */
.user-list-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin-bottom: 24px;
}
</style>
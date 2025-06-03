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
            <el-table-column prop="user_id" label="用户ID" />
            <el-table-column prop="name" label="用户名" />
            <el-table-column prop="tel" label="电话号码" />
            <el-table-column prop="type" label="用户类型" />
            <el-table-column prop="created_at" label="注册时间" />
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button @click="deleteUser(scope.row)" type="danger">删除</el-button>
              </template>
            </el-table-column>
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
import { ElMessageBox, ElMessage } from 'element-plus'

export default defineComponent({
  components: {
    User,
    Notification,
    Document
  },
  data() {
    return {
      adminName: localStorage.getItem('admin_name'),
      users: []
    }
  },
  mounted() {
    this.adminName = localStorage.getItem('admin_name')
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const api = await import('../services/api')
        const res = await api.default.get('/admin/user/get')
        this.users = res.data.users
      } catch (err) {
        alert('加载用户失败')
      }
    },
    async deleteUser(user) {
      try {
        await ElMessageBox.confirm(
          `确定要删除用户 ${user.name} 吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        const api = await import('../services/api')
        await api.default.post('/admin/user/delete', { user_id: user.user_id })
        this.fetchUsers() // 重新加载用户列表
        ElMessage.success('删除成功')
      } catch (err) {
        if (err === 'cancel') {
          ElMessage.info('已取消删除')
        } else if (err.response && err.response.data.message) {
          ElMessage.error(err.response.data.message)
        } else {
          ElMessage.error('网络错误，请稍后再试')
        }
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
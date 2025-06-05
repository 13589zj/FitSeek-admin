<template>
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-content">
        <span class="logo">FitSeek</span>
        <div class="admin-info">管理员：{{ adminName }}</div>
        <el-button type="primary" plain @click="logout" style="margin-left: 16px; border: 2px solid #409EFF;">登出</el-button>
      </div>
    </div>

    <div style="display: flex; flex: 1;">
      <!-- 侧边栏 -->
      <el-menu
        default-active="/announcement-management"
        class="el-menu-vertical"
        
        router
      >
        <el-menu-item index="/users">
          <el-icon><user /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/announcements">
          <el-icon><notification /></el-icon>
          <span>公告发布</span>
        </el-menu-item>
        <el-menu-item index="/articles">
          <el-icon><document /></el-icon>
          <span>文章发布</span>
        </el-menu-item>
        <el-menu-item index="/announcement-management">
          <el-icon><notification /></el-icon>
          <span>公告管理</span>
        </el-menu-item>
        <el-menu-item index="/article-management">
          <el-icon><document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/food-library">
          <el-icon><food /></el-icon>
          <span>食物库管理</span>
        </el-menu-item>
        <el-menu-item index="/train-library">
          <el-icon><basketball /></el-icon>
          <span>训练库管理</span>
        </el-menu-item>
      </el-menu>

      <!-- 主要内容区域 -->
      <div class="content-container">
        <!-- 用户数量卡片 -->
        <el-card class="stats-card">
          <h2 style="margin-bottom: 20px;">公告总览</h2>
          <!-- <div class="card-content">
            <span class="card-title">用户数量</span>
            <span class="card-value">{{ users.length }}</span>
          </div> -->
        </el-card>

        <!-- 公告列表 -->
        <el-card class="user-list-card">
          <h2 style="margin-bottom: 20px;">公告列表</h2>
          <el-table :data="announcements" border style="width: 100%" v-loading="loading" @row-click="showAnnouncementDetail">
            <el-table-column prop="ann_id" label="公告ID" />
            <el-table-column prop="publisher_name" label="发布者" />
            <el-table-column prop="content" label="内容">
              <template #default="scope">
                {{ scope.row.content.split('\n')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="publish_time" label="发布时间" />
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button @click.stop="deleteAnnouncement(scope.row)" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-dialog
          v-model="dialogVisible"
          title="公告详情"
          width="60vw"
          @close="handleDialogClose"
        >
          <div v-if="currentAnnouncement">
            <p><strong>公告ID：</strong>{{ currentAnnouncement.ann_id }}</p>
            <p><strong>发布者：</strong>{{ currentAnnouncement.publisher_name }}</p>
            <p><strong>发布时间：</strong>{{ currentAnnouncement.publish_time }}</p>
            <p><strong>内容：</strong></p>
            <div v-html="renderMarkdown(currentAnnouncement.content)"></div>
          </div>
        </el-dialog>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { marked } from 'marked'
import {
  User,
  Notification,
  Document,
  Food,
  Basketball,
  Search,
  Check,
  Plus
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default defineComponent({
  components: {
    User,
    Notification,
    Document,
    Food,
    Basketball
  },
  data() {
    return {
      adminName: localStorage.getItem('admin_name'),
      announcements: [],
      loading: false,
      dialogVisible: false,      // 控制弹窗显示
      currentAnnouncement: null    // 当前选中的公告
    }
  },
  mounted() {
    this.adminName = localStorage.getItem('admin_name')
    this.fetchAnnouncements()
  },
  methods: {
    async fetchAnnouncements() {
      this.loading = true
      try {
        const api = await import('../../services/api')
        const res = await api.default.get('/announcement/get')
        if(res.data.success){
            this.announcements = res.data.announcements
        } else {
            ElMessage.error('加载公告失败，请稍后再试')
        }
      } catch (err) {
        if (err.response && err.response.data.message) {
          ElMessage.error(err.response.data.message)
        } else {
          ElMessage.error('网络错误，请稍后再试')
        }
      } finally {
        this.loading = false
      }
    },
    async deleteAnnouncement(announcement) {
      try {
        await ElMessageBox.confirm(
          `确定要删除公告 ${announcement.ann_id} 吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        const api = await import('../../services/api')
        const res = await api.default.post('/announcement/delete', { ann_id: announcement.ann_id })
        if (res.data.success) {
          this.fetchAnnouncements() // 重新加载公告列表
          ElMessage.success('删除成功')
        } else {
          throw new Error(res.data.message || '删除失败')
        }
      } catch (err) {
        if (err === 'cancel') {
          ElMessage.info('已取消删除')
        } else if (err.response && err.response.data.message) {
          ElMessage.error(err.response.data.message)
        } else {
          ElMessage.error('网络错误，请稍后再试')
        }
      }
    },
    showAnnouncementDetail(row) {
      this.currentAnnouncement = row
      this.dialogVisible = true
    },
    handleDialogClose() {
      this.dialogVisible = false
      this.currentAnnouncement = null
    },
    renderMarkdown(content) {
      return marked.parse(content || '')
    },
    logout() {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_name')
      this.$router.push('/login')
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
  min-width: 200px;
  max-width: 200px;
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
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
      <div class="sidebar-fixed">
      <!-- 侧边栏 -->
      <el-menu
        default-active="/announcements"
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
      </div>

      <!-- 主要内容区域 -->
      <div class="content-container">
        <el-card class="form-card">
          <h2 class="card-title">公告发布</h2>
          <el-form 
            :model="form" 
            ref="formRef" 
            label-width="80px"
            class="announcement-form"
          >
            <el-form-item 
              label="内容" 
              prop="content" 
              :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]"
            >
              <el-input 
                type="textarea" 
                v-model="form.content" 
                :rows="5"
                placeholder="请输入公告内容..."
              />
            </el-form-item>

            <el-form-item class="form-actions">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
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
  Food,
  Basketball,
  Search,
  Check,
  Plus
} from '@element-plus/icons-vue'

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
            form: {
                content: '',
                time: new Date(),
                publisher_name: localStorage.getItem('admin_name'),
                type: 'announcement'
            }
        }
    },
    methods: {
        async submitForm() {
            this.form.time = new Date()
            try {
                const api = await import('../../services/api')
                const res = await api.default.post('/announcement/publish', this.form)
                if (res.data.success) {
                    this.$message.success('公告提交成功')
                    this.resetForm()
                } else {
                    this.$message.error('公告提交失败')
                }
            } catch (err) {
                if (this.form.content === '') {
                    this.$message.error('公告内容不能为空')
                } else if (err.response && err.response.data.message === '服务器错误') {
                    this.$message.error('服务器错误，请稍后再试')
                } else {
                    this.$message.error('网络错误，请稍后再试')
                }
            }
        },
        resetForm() {
            this.$refs.formRef.resetFields()
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
/* 顶部导航栏样式（与主页面保持一致） */
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

/* 表单卡片样式 */
.form-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin: 0 auto;
}

.card-title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

/* 表单元素间距 */
.el-form-item {
  margin-bottom: 22px;
}

/* 按钮容器 */
/* .form-actions {
  margin-top: 30px;
  text-align: right;
} */

/* 文本域样式 */
.el-textarea :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
}

/* 下拉选择样式 */
.el-select :deep(.el-input__inner) {
  height: 40px;
}

.sidebar-fixed {
  position: sticky;
  top: 60px; /* 顶部导航栏高度 */
  min-height: 60px;
  align-self: flex-start;
  z-index: 999;
  height: calc(100vh - 60px);
  background: #fff;
  /* 可选：加阴影或边框美化 */
}
</style>
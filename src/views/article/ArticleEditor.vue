<template>
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <!-- 统一顶部导航栏 -->
    <div class="header">
      <div class="header-content">
        <span class="logo">FitSeek</span>
        <div class="admin-info">管理员：{{ adminName }}</div>
      </div>
    </div>

    <div style="display: flex; flex: 1;">
      <!-- 侧边栏（添加右边框） -->
      <el-menu
        default-active="/articles"
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
        <el-card class="form-card">
          <h2 class="card-title">文章编辑</h2>
          <el-form 
            :model="form" 
            ref="formRef" 
            label-width="80px"
            class="article-form"
          >
            <el-form-item 
              label="内容" 
              prop="content" 
              :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]"
            >
              <el-input 
                type="textarea" 
                v-model="form.content" 
                :rows="8"
                placeholder="请输入文章内容..."
                resize="none"
              />
            </el-form-item>

            <el-form-item label="类型" prop="type">
              <el-select 
                v-model="form.type" 
                style="width: 100%"
                placeholder="请选择文章类型"
              >
                <el-option label="技术文章" value="tech" />
                <el-option label="新闻动态" value="news" />
                <el-option label="使用指南" value="guide" />
              </el-select>
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
      form: {
        content: '',
        time: new Date(),
        type: 'tech'
      }
    }
  },
  methods: {
    async submitForm() {
      this.form.time = new Date()
      try {
        const api = await import('../../services/api')
        const res = await api.default.post('/admin/article', this.form)
        if (res.data.success) {
          this.$message.success('文章提交成功')
          this.resetForm()
        } else {
          this.$message.error('文章提交失败')
        }
      } catch (err) {
        this.$message.error('网络错误，请稍后再试')
      }
    },
    resetForm() {
      this.$refs.formRef.resetFields()
    }
  }
})
</script>

<style scoped>
/* 统一顶部导航栏样式 */
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

/* 表单元素增强 */
.el-form-item {
  margin-bottom: 22px;
}

.form-actions {
  margin-top: 30px;
  text-align: right;
}

/* 文本域深度样式 */
:deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.8;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 
    'Microsoft YaHei', Arial, sans-serif;
}

/* 下拉选择样式 */
.el-select {
  width: 100%;
}
</style>
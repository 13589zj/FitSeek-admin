<template>
  <!-- 页面设计，大体上分为三块：顶部导航栏、侧边栏和主要内容区域。 -->
  <div style="display: flex; flex-direction: column; height: 200vh;">
    <!-- 顶部导航栏 -->
    <!-- 顶部导航栏包含网站logo、管理员信息和登出按钮。 -->
    <div class="header">
      <div class="header-content">
        <span class="logo">
          <img :src="logoImg" alt="logo" class="logo-img" />
          FitSeek
        </span>
        <div class="admin-info">管理员：{{ adminName }}</div>
        <el-button type="primary" plain @click="logout" style="margin-left: 16px; border: 2px solid #409EFF;">登出</el-button>
      </div>
    </div>

    <div style="display: flex; flex: 1;">
      <div class="sidebar-fixed">
      <!-- 侧边栏 -->
      <!-- 侧边栏包含各个管理功能的链接。 -->
      <el-menu
        default-active="/train-library"
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
      <!-- 主要内容区域包含新增训练项目表单和训练项目列表，附带查改删功能。 -->
      <!-- 使用el-card组件来美化表单。 -->
      <div class="content-container">
        <!-- 新增训练项目卡片 -->
        <el-card class="form-card">
            <h2>新增训练项目</h2>
            <el-form :model="form" ref="formRef" label-width="80px">
                <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
                    <el-input v-model="form.name" placeholder="请输入训练项目" />
                </el-form-item>
                <el-form-item label="分类" prop="category" :rules="[{ required: true, message: '请选择分类', trigger: 'change' }]">
                    <el-select v-model="form.category" placeholder="请选择分类">
                        <el-option label="aerobic（有氧）" value="aerobic" />
                        <el-option label="anaerobic（无氧）" value="anaerobic" />
                        <el-option label="stretching（拉伸）" value="stretching" />
                        <el-option label="other（其他）" value="other" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model="form.note" placeholder="备注（可选）" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addTraining">插入</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 训练项目列表卡片 -->
        <el-card class="train-list-card">
            <h2 style="margin-bottom: 20px;">训练项目列表</h2>
            <el-table :data="trains" border style="width: 100%" v-loading="loading">
                <el-table-column prop="train_id" label="训练ID" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="category" label="分类" />
                <el-table-column prop="note" label="备注" />
                <el-table-column label="修改" width="100">
                    <template #default="scope">
                        <el-button @click="openEditDialog(scope.row)" type="danger" >修改</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="删除" width="100">
                    <template #default="scope">
                        <el-button @click="deleteTraining(scope.row)" type="danger" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 修改弹窗 -->
        <!-- 使用el-dialog组件来实现修改训练项目信息的弹窗。 -->
        <!-- 弹窗中包含一个表单，用户可以修改训练项目的名称、分类和备注。 -->
        <el-dialog title="修改训练项目信息" v-model="editDialogVisible" width="400px">
            <el-form :model="editForm" label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="editForm.name" disabled />
            </el-form-item>
            <el-form-item label="分类" prop="category" :rules="[{ required: true, message: '请选择分类', trigger: 'change' }]">
                <el-select v-model="editForm.category" placeholder="请选择分类">
                <el-option label="aerobic（有氧）" value="aerobic" />
                <el-option label="anaerobic（无氧）" value="anaerobic" />
                <el-option label="stretching（拉伸）" value="stretching" />
                <el-option label="other（其他）" value="other" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="editForm.note" />
            </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>

        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// 引入所需的组件和库
import { defineComponent } from 'vue'
import {
  User,
  Notification,
  Document,
  Food,
  Basketball
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import logoImg from '../logo/logo.png'

// 定义Vue组件，使用defineComponent函数来创建一个新的Vue组件实例。
export default defineComponent({
  components: {
    User,
    Notification,
    Document,
    Food,
    Basketball
  },
  // 数据包括logoImg、管理员名称、训练项目列表、加载状态、表单数据和弹窗显示状态。
  // 增加了表单数据和编辑弹窗相关的数据。
  data() {
    return {
      logoImg,
      adminName: localStorage.getItem('admin_name'),
      trains: [],
      loading: false,
      form: { // 增加表单数据
        train_id: '',
        name: '',
        category: '',
        note: ''
      },
      editDialogVisible: false,
      editForm: {
        train_id: '',
        name: '',
        category: '',
        note: ''
      }
    }
  },
  mounted() {
    this.adminName = localStorage.getItem('admin_name')
    this.fetchTraining()
  },
  // methods包括获取训练项目列表、添加训练项目、重置表单、删除训练项目、打开编辑弹窗、提交编辑和登出功能。
  // 在获取训练项目列表时，使用了异步函数来处理API请求。
  methods: {
    async fetchTraining() {
        this.loading = true
        try {
            const api = await import('../services/api')
            const res = await api.default.get('/trainlib/get')
            if (res.data.success) {
                this.trains = res.data.trains
            } else {
                throw new Error(res.data.message || '获取训练项目失败')
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
    async addTraining() {
        try {
            const api = await import('../services/api')
            const res = await api.default.post('/trainlib/add', this.form)
            if (res.data.success) {
                ElMessage.success('项目添加成功')
                this.fetchTraining()
                this.resetForm()
            } else {
                throw new Error(res.data.message || '添加失败')
            }
        } catch (err) {
            if (err.response && err.response.data.message) {
                ElMessage.error(err.response.data.message)
            } else {
                ElMessage.error('网络错误，请稍后再试')
            }
        }
    },
    resetForm() {
        this.form = {
            name: '',
            category: '',
            note: ''
        }
    },
    async deleteTraining(train) {
        try {
            await ElMessageBox.confirm(
                `确定要删除项目 ${train.name} 吗？`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            const api = await import('../services/api')
            const res = await api.default.post('/trainlib/delete', { train_id: train.train_id })
            if (res.data.success) {
                this.fetchTraining() // 重新加载食物列表
                ElMessage.success('删除成功')
            } else {
                throw new Error(res.data.message || '删除失败')
            }
        } catch (err) {
            if(err == 'cancel') {
                ElMessage.info('已取消删除')
            } else if (err.response && err.response.data.message) {
                ElMessage.error(err.response.data.message)
            } else {
                ElMessage.error('网络错误，请稍后再试')
            }
        }
    },
    openEditDialog(row) {
      this.editForm = { ...row } // 复制当前行数据
      this.editDialogVisible = true
    },
    async submitEdit() {
      try {
        console.log('editForm:', this.editForm)
        const api = await import('../services/api')
        const res = await api.default.post('/trainlib/modify', this.editForm)
        if (res.data.success) {
          ElMessage.success('修改成功')
          this.editDialogVisible = false
          this.fetchTraining()
        } else {
          throw new Error(res.data.message || '修改失败')
        }
      } catch (err) {
        if (err.response && err.response.data.message) {
          ElMessage.error(err.response.data.message)
        } else {
          ElMessage.error('网络错误，请稍后再试')
        }
      }
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
  min-height: 60px;
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

.logo-img {
  height: 40px;
  vertical-align: middle;
  margin-right: 8px;
}
.logo {
  display: flex;
  align-items: center;
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
  margin-bottom: 24px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

/* 训练列表卡片 */
.train-list-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.sidebar-fixed {
  position: sticky;
  top: 60px; /* 顶部导航栏高度 */
  align-self: flex-start;
  z-index: 999;
  height: calc(100vh - 60px);
  background: #fff;
}

</style>
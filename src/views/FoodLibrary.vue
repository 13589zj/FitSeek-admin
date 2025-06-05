<template>
  <div style="display: flex; flex-direction: column; height: 200vh;">
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
        default-active="/food-library"
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
        <!-- 新增食物卡片 -->
        <el-card class="form-card">
            <h2>新增食物</h2>
            <el-form :model="form" ref="formRef" label-width="80px">
                <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
                    <el-input v-model="form.name" placeholder="请输入食物名称" />
                </el-form-item>
                <el-form-item label="热量" prop="calories" :rules="[{ required: true, message: '请输入热量', trigger: 'blur' }]">
                    <el-input v-model="form.calories" placeholder="请输入热量" type="number" />
                </el-form-item>
                <el-form-item label="分类" prop="category" :rules="[{ required: true, message: '请选择分类', trigger: 'change' }]">
                    <el-select v-model="form.category" placeholder="请选择分类">
                        <el-option label="staple（主食）" value="staple" />
                        <el-option label="vegetable（蔬菜）" value="vegetable" />
                        <el-option label="fruit（水果）" value="fruit" />
                        <el-option label="meat（肉类）" value="meat" />
                        <el-option label="dairy（乳制品）" value="dairy" />
                        <el-option label="snack（零食）" value="snack" />
                        <el-option label="drink（饮料）" value="drink" />
                        <el-option label="other（其他）" value="other" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model="form.note" placeholder="备注（可选）" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addFood">插入</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 食物列表卡片 -->
        <el-card class="food-list-card">
            <h2 style="margin-bottom: 20px;">食物列表</h2>
            <el-table :data="foods" border style="width: 100%" v-loading="loading">
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="calories" label="热量" />
                <el-table-column prop="category" label="分类" />
                <el-table-column prop="note" label="备注" />
                <el-table-column label="修改" width="100">
                    <template #default="scope">
                        <el-button @click="openEditDialog(scope.row)" type="danger" >修改</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="删除" width="100">
                    <template #default="scope">
                        <el-button @click="deleteFood(scope.row)" type="danger" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 修改弹窗 -->
        <el-dialog title="修改食物信息" v-model="editDialogVisible" width="400px">
            <el-form :model="editForm" label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="editForm.name" disabled />
            </el-form-item>
            <el-form-item label="热量" prop="calories" :rules="[{ required: true, message: '请输入热量', trigger: 'blur' }]">
                <el-input v-model="editForm.calories" type="number" />
            </el-form-item>
            <el-form-item label="分类" prop="category" :rules="[{ required: true, message: '请选择分类', trigger: 'change' }]">
                <el-select v-model="editForm.category" placeholder="请选择分类">
                <el-option label="staple（主食）" value="staple" />
                <el-option label="vegetable（蔬菜）" value="vegetable" />
                <el-option label="fruit（水果）" value="fruit" />
                <el-option label="meat（肉类）" value="meat" />
                <el-option label="dairy（乳制品）" value="dairy" />
                <el-option label="snack（零食）" value="snack" />
                <el-option label="drink（饮料）" value="drink" />
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
import { defineComponent } from 'vue'
import {
  User,
  Notification,
  Document,
  Food,
  Basketball,
  Check,
  Plus,
  
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
      foods: [],
      loading: false,
      form: { // 增加表单数据
        name: '',
        calories: '',
        category: '',
        note: ''
      },
      editDialogVisible: false,
      editForm: {
        food_id: '',
        name: '',
        calories: '',
        category: '',
        note: ''
      }
    }
  },
  mounted() {
    this.adminName = localStorage.getItem('admin_name')
    this.fetchFood()
  },
  methods: {
    async fetchFood() {
        this.loading = true
        try {
            const api = await import('../services/api')
            const res = await api.default.get('/foodlib/get')
            if (res.data.success) {
                this.foods = res.data.foods
            } else {
                throw new Error(res.data.message || '获取食物失败')
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
    async addFood() {
        try {
            const api = await import('../services/api')
            const res = await api.default.post('/foodlib/add', this.form)
            if (res.data.success) {
                ElMessage.success('食物添加成功')
                this.fetchFood()
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
            calories: '',
            category: '',
            note: ''
        }
    },
    async deleteFood(food) {
        try {
            await ElMessageBox.confirm(
                `确定要删除食物 ${food.name} 吗？`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            const api = await import('../services/api')
            const res = await api.default.post('/foodlib/delete', { food_id: food.food_id })
            if (res.data.success) {
                this.fetchFood() // 重新加载食物列表
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
        const res = await api.default.post('/foodlib/modify', this.editForm)
        if (res.data.success) {
          ElMessage.success('修改成功')
          this.editDialogVisible = false
          this.fetchFood()
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

/* 表单卡片样式 */
.form-card {
  margin-bottom: 24px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

/* 食物列表卡片 */
.food-list-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

</style>
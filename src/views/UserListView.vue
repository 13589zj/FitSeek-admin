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
      <!-- 主要内容区域包含用户数据概况卡片和用户列表，附带删除功能。 -->
      <!-- 使用el-card组件来美化表单。 -->
      <div class="content-container">
        <!-- 用户数量卡片 -->
        <el-card class="stats-card">
          <h2 style="margin-bottom: 20px;">用户概况</h2>
          <!-- <div class="card-content">
            <span class="card-title">用户数量</span>
            <span class="card-value">{{ users.length }}</span>
          </div> -->
          <el-row :gutter="16" class="stats-row">
            <!-- 左侧两列：两行两列小卡片 -->
            <!-- 依次是用户总数、管理员数量、本周新增用户和活跃用户数量 -->
            <!-- 其中活跃用户数量暂无具体显示 -->
            <!-- 使用el-row和el-col布局 -->
            <el-col :span="12">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-card class="mini-stat-card">
                    <div class="mini-stat-title">用户总数</div>
                    <div class="mini-stat-value">{{ userCount }}</div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card class="mini-stat-card">
                    <div class="mini-stat-title">管理员数量</div>
                    <div class="mini-stat-value">{{ adminCount }}</div>
                  </el-card>
                </el-col>
              </el-row>
              <el-row :gutter="16" style="margin-top: 16px;">
                <el-col :span="12">
                  <el-card class="mini-stat-card">
                    <div class="mini-stat-title">本周新增</div>
                    <div class="mini-stat-value">{{ recentWeekCount }}</div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card class="mini-stat-card">
                    <div class="mini-stat-title">活跃用户数量</div>
                    <div class="mini-stat-value">--</div>
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
            <!-- 右侧是近期注册用户统计图表 -->
            <!-- 使用echarts绘制柱状图 -->
            <el-col :span="9">
              <el-card class="mini-stat-card" style="height: 80%;">
                <div class="mini-stat-title">近期注册用户</div>
                <div ref="userChart" class="user-chart-container"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>

        <!-- 用户列表 -->
        <el-card class="user-list-card">
          <h2 style="margin-bottom: 20px;">用户列表</h2>
          <el-table :data="users" border style="width: 100%" v-loading="loading">
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
// 引入 Vue 相关依赖和组件
import { defineComponent } from 'vue'
import {
  User,
  Notification,
  Document,
  Food,
  Basketball
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
// 引入 ECharts 库
import * as echarts from 'echarts'
// 引入其他组件
import logoImg from '../logo/logo.png'

// 使用 defineComponent 函数来创建一个新的 Vue 组件实例
export default defineComponent({
  components: {
    User,
    Notification,
    Document,
    Food,
    Basketball
  },
  // 数据包括 logoImg、管理员名称、用户列表、加载状态和统计数据
  data() {
    return {
      logoImg,
      adminName: localStorage.getItem('admin_name'),
      users: [],
      loading: false,
      recentWeekCount: 0,
      recentUserStats: [],
      userCount: 0,
      adminCount: 0
    }
  },
  // 监听 users 数据变化，计算用户和管理员数量
  watch: {
    users: {
      immediate: true,
      handler(val) {
        this.userCount = val.filter(u => u.type === 'user').length
        this.adminCount = val.filter(u => u.type === 'admin').length
      }
    }
  },
  // 在组件加载时获取管理员名称和用户列表
  mounted() {
    this.adminName = localStorage.getItem('admin_name')
    this.fetchUsers()
  },
  // 定义组件的方法，包括获取用户列表、删除用户、登出和统计数据计算等功能
  // 使用 async/await 处理异步请求
  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        const api = await import('../services/api')
        const res = await api.default.get('/admin/user/get')
        if (res.data.success) {
          this.users = res.data.users
          this.calcRecentStats()
        } else {
          throw new Error(res.data.message || '加载用户失败')
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
        const res = await api.default.post('/admin/user/delete', { user_id: user.user_id })
        if(res.data.success) {
          this.fetchUsers() // 重新加载用户列表
          ElMessage.success('用户删除成功')
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
    // 登出功能，清除本地存储的管理员信息并跳转到登录页面
    logout() {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_name')
      this.$router.push('/login')
    },
    // 生成最近7天的日期数组，并统计每天注册的用户数量
    calcRecentStats() {
      // 统计最近7天注册用户数
      const now = new Date()
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now)
        d.setDate(now.getDate() - (6 - i))
        return d.toISOString().slice(0, 10)
      })
      const stats = days.map(day =>
        this.users.filter(u => (u.created_at || '').slice(0, 10) === day && u.type === 'user' ).length
      )
      this.recentUserStats = stats
      this.recentWeekCount = stats.reduce((a, b) => a + b, 0)
      this.$nextTick(this.renderUserChart)
    },
    // 使用 ECharts 渲染用户注册统计图表
    // 在组件更新后调用渲染函数
    renderUserChart() {
      if (!this.$refs.userChart) return
      const chart = echarts.init(this.$refs.userChart)
      chart.setOption({
        tooltip: {},
        xAxis: {
          type: 'category',
          data: Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (6 - i))
            return `${d.getMonth() + 1}/${d.getDate()}`
          })
        },
        yAxis: { 
          type: 'value',
          min:'dataMin',
          max:'dataMax'
        },
        series: [{
          data: this.recentUserStats,
          type: 'bar',
          barWidth: '60%',
          itemStyle: { color: '#409EFF' }
        }]
      })
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
/* .logo {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
} */

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
  padding-left: 20px;
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
  padding-left: 20px;
}

.sidebar-fixed {
  position: sticky;
  top: 60px; /* 顶部导航栏高度 */
  align-self: flex-start;
  z-index: 999;
  height: calc(100vh - 60px);
  background: #fff;
}

.stats-row {
  margin-bottom: 12px;
}
.mini-stat-card {
  text-align: center;
  padding: 12px 0;
  min-height: 80px;
}
.mini-stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}
.mini-stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #409EFF;
}

.user-chart-container {
  width: 100%;
  flex:1;
  height: 193px;
}
</style>
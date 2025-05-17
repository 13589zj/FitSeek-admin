<template>
  <div style="display: flex; height: 100vh;">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      style="width: 200px; min-height: 100vh;"
      router
    >
      <el-menu-item index="/users">
        用户管理
      </el-menu-item>
      <el-menu-item index="/announcements">
        公告管理
      </el-menu-item>
      <el-menu-item index="/articles">
        文章管理
      </el-menu-item>
    </el-menu>
    <div style="flex: 1; padding: 24px;">
      <h2>用户列表</h2>
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="tel" label="电话号码" />
      </el-table>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
}
</script>
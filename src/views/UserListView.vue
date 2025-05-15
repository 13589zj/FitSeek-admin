<template>
  <div class="user-list">
    <h2>用户列表</h2>
    <el-table :data="users" border style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="tel" label="电话号码" />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: []
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
<template>
  <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-content">
        <span class="logo">FitSeek</span>
      </div>
    </div>
  <div class="login-container">
    <el-card class="login-box">
      <h2>管理员登录</h2>
      <el-form @submit.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%">
          登录
        </el-button>
        <p v-if="error" class="error">{{ error }}</p>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.error = ''

      try {
        const res = await import('../services/api').then(api => {
          return api.default.post('/admin/login', this.form)
        })

        if (res.data.success) {
          localStorage.setItem('admin_token', res.data.token)
          localStorage.setItem('admin_name', this.form.name)
          this.$router.push('/users')
        } else {
          this.error = '登录失败，请检查用户名或密码'
        }
      } catch (err) {
        if(this.form.name === '' || this.form.password === ''){
          this.error = '用户名和密码不能为空'
        } else if(err.response && err.response.data.message === '密码错误'){
          this.error = '登录失败，请检查密码'
        } else if(err.response && err.response.data.message === '管理员账号不存在'){
          this.error = '登录失败，管理员账号不存在'
        } else{
          this.error = '网络错误，请稍后再试'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
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

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-box {
  width: 400px;
  padding: 20px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
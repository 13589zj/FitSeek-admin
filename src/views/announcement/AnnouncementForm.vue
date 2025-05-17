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
        <h2>公告发布</h2>
        <el-form :model="form" ref="formRef" label-width="80px">
            <el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]">
                <el-input type="textarea" v-model="form.content" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="form.type">
                    <el-option label="公告" value="announcement" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                content: '',
                time: new Date(),
                type: 'announcement'
            }
        }
    },
    methods: {
        async submitForm() {
            this.form.time = new Date()
            try {
                const api = await import('../../services/api')
                const res = await api.default.post('/admin/announcement', this.form)
                if (res.data.success) {
                    this.$message.success('公告提交成功')
                    this.resetForm()
                } else {
                    this.$message.error('公告提交失败')
                }
            } catch (err) {
                this.$message.error('网络错误，请稍后再试')
            }
        },
        resetForm() {
            this.$refs.formRef.resetFields()
        }
    }
}
</script>

<style>
.announcement-form {
    max-width: 600px;
    margin: 0 auto;
}
</style>
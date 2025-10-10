// 调用
// <script setup>
// import { useAuthStore } from '@/stores/auth'
//
// const auth = useAuthStore()
//     </script>
//
//     <template>
//     <div v-if="auth.isLoggedIn">
//     欢迎, {{ auth.name }}
// </div>
// </template>
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

export const userStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userId: localStorage.getItem('userId') || '',
    name: localStorage.getItem('userName') || '',
    image: localStorage.getItem('userImage') || '',
    // role: localStorage.getItem('Role') || '',
  }),
  actions: {
    login(id: string, name: string, role: string) {
      this.isLoggedIn = true
      this.userId = id
      this.name = name
      // this.role = role

      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userId', id)
      localStorage.setItem('userName', name)
      // localStorage.setItem('Role', role)
    },
    logout() {
      this.$reset() // 重置为初始状态
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      // localStorage.removeItem('Role')
      message.success('Logout successfully')
    },
    updateName(name: string) {
      this.name = name
      localStorage.setItem('userName', name)
    },
    updateImage(image: string) {
      this.image = image
      localStorage.setItem('userImage', image)
    },
  },
})

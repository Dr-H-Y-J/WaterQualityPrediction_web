<!-- src/views/Login.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式状态
const username = ref('')
const password = ref('')
const rememberMe = ref(false)

// 登录方法
const handleLogin = async (e: Event) => {
  e.preventDefault()
  
  try {
    const response = await axios.post('http://localhost:3000/api/users/login', {
      username: username.value,
      password: password.value,
    })
    
    if (response.status === 200) {
      alert('登录成功')
      // 使用 location.href 替代 router.push，跳转并刷新页面
      window.location.href = '/admin/system/analysis'
    } else {
      // 处理其他状态码
      alert(`登录失败: ${response.data.message || '未知错误'}`)
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    
    // 更详细的错误处理
    if (error.response) {
      // 服务器返回了错误响应
      if (error.response.status === 401) {
        alert('用户名或密码错误')
      } else if (error.response.status === 400) {
        alert(`登录信息有误: ${error.response.data.message || '请检查输入信息'}`)
      } else if (error.response.status === 500) {
        alert('服务器内部错误，请稍后再试')
      } else {
        alert(`登录失败: ${error.response.data.message || '请稍后再试'}`)
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      alert('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      alert('登录过程中发生错误，请稍后再试')
    }
  }
}

// 忘记密码处理
const handleForgotPassword = () => {
  alert('忘记密码功能待实现')
}

// 前往注册页
const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <!-- 背景装饰元素 -->
  <div class="background-elements">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
    <div class="circle circle-3"></div>
    <div class="line line-1"></div>
    <div class="line line-2"></div>
    <div class="line line-3"></div>
    <!-- 水波纹元素 -->
    <div class="wave wave-1"></div>
    <div class="wave wave-2"></div>
    <div class="wave wave-3"></div>
    
    <!-- 气泡元素 -->
    <div class="bubble bubble-1"></div>
    <div class="bubble bubble-2"></div>
    <div class="bubble bubble-3"></div>
    <div class="bubble bubble-4"></div>
    <div class="bubble bubble-5"></div>
    <div class="bubble bubble-6"></div>
    <div class="bubble bubble-7"></div>
    <div class="bubble bubble-8"></div>
    
    <!-- 水流线条 -->
    <div class="water-stream stream-1"></div>
    <div class="water-stream stream-2"></div>
    <div class="water-stream stream-3"></div>
    
    <!-- 水花效果 -->
    <div class="water-splash splash-1"></div>
    <div class="water-splash splash-2"></div>
  </div>

  <!-- 登录卡片 -->
  <div class="login-card">
    <div class="logo">
      <i class="fas fa-water logo-icon"></i>
      <div class="logo-text">水质预测平台</div>
    </div>

    <h2 class="welcome-text">欢迎回来</h2>
    <p class="subtitle">基于时间序列模型的水质预测系统</p>

    <form @submit="handleLogin">
      <div class="form-group">
        <label class="form-label">用户名</label>
        <div class="input-with-icon">
          <i class="fas fa-user input-icon"></i>
          <input v-model="username" type="text" class="form-input" placeholder="请输入用户名" required />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">密码</label>
        <div class="input-with-icon">
          <i class="fas fa-lock input-icon"></i>
          <input v-model="password" type="password" class="form-input" placeholder="请输入密码" required />
        </div>
      </div>

      <div class="remember-forgot">
        <div class="remember-me">
          <input v-model="rememberMe" type="checkbox" id="remember" />
          <label for="remember">记住我</label>
        </div>
        <a href="#" class="forgot-password" @click="handleForgotPassword">忘记密码？</a>
      </div>

      <button type="submit" class="login-btn">登录</button>
    </form>

    <div class="register-link">
      还没有账户？
      <a href="#" class="register-account" @click="goToRegister">立即注册</a>
    </div>

    <div class="footer">
      © 2023 水质预测平台. 保留所有权利.
    </div>
  </div>
</template>

<style scoped>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 登录页面容器 */
body, html {
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 背景装饰元素 */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  background: linear-gradient(135deg, #0a192f, #0c2d48);
}

/* 圆形装饰 */
.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(79, 195, 247, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 20%;
  left: -50px;
  animation: float 10s ease-in-out infinite;
}

/* 线条装饰 */
.line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(79, 195, 247, 0.3), transparent);
  height: 1px;
}

.line-1 {
  width: 30%;
  top: 20%;
  right: 0;
  animation: flow 15s linear infinite;
}

.line-2 {
  width: 20%;
  top: 60%;
  left: 0;
  animation: flow 12s linear infinite reverse;
}

.line-3 {
  width: 25%;
  bottom: 30%;
  right: 0;
  animation: flow 18s linear infinite;
}

/* 水波纹效果 */
.wave {
  position: absolute;
  border-radius: 45%;
  background: rgba(24, 144, 255, 0.05);
  animation: wave 15s linear infinite;
}

.wave-1 {
  width: 400px;
  height: 400px;
  top: 10%;
  left: 10%;
}

.wave-2 {
  width: 300px;
  height: 300px;
  bottom: 15%;
  right: 15%;
  animation-delay: -5s;
}

.wave-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  right: 20%;
  animation-delay: -10s;
}

/* 气泡效果 */
.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(79, 195, 247, 0.2);
  animation: float 6s ease-in-out infinite;
}

.bubble-1 {
  width: 20px;
  height: 20px;
  top: 30%;
  left: 20%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 15px;
  height: 15px;
  top: 70%;
  left: 10%;
  animation-delay: -1s;
}

.bubble-3 {
  width: 10px;
  height: 10px;
  top: 20%;
  right: 30%;
  animation-delay: -2s;
}

.bubble-4 {
  width: 25px;
  height: 25px;
  bottom: 30%;
  right: 20%;
  animation-delay: -3s;
}

.bubble-5 {
  width: 12px;
  height: 12px;
  bottom: 60%;
  left: 25%;
  animation-delay: -4s;
}

.bubble-6 {
  width: 18px;
  height: 18px;
  top: 50%;
  right: 10%;
  animation-delay: -5s;
}

.bubble-7 {
  width: 8px;
  height: 8px;
  top: 80%;
  right: 40%;
  animation-delay: -6s;
}

.bubble-8 {
  width: 14px;
  height: 14px;
  bottom: 20%;
  left: 40%;
  animation-delay: -7s;
}

/* 水流线条 */
.water-stream {
  position: absolute;
  background: linear-gradient(to right, transparent, rgba(79, 195, 247, 0.3), transparent);
  height: 2px;
  border-radius: 1px;
  animation: flow 10s linear infinite;
}

.stream-1 {
  width: 15%;
  top: 25%;
  left: 5%;
  transform: rotate(15deg);
}

.stream-2 {
  width: 20%;
  top: 50%;
  right: 5%;
  transform: rotate(-10deg);
  animation-delay: -2s;
}

.stream-3 {
  width: 12%;
  bottom: 25%;
  left: 15%;
  transform: rotate(5deg);
  animation-delay: -4s;
}

/* 水花效果 */
.water-splash {
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(79, 195, 247, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

.splash-1 {
  top: 40%;
  left: 30%;
  animation-delay: 0s;
}

.splash-2 {
  bottom: 30%;
  right: 30%;
  animation-delay: -1.5s;
}

/* 登录卡片 */
.login-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

/* Logo 样式 */
.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 48px;
  color: #4fc3f7;
  margin-bottom: 15px;
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 欢迎文本 */
.welcome-text {
  text-align: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 30px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 16px;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-input:focus {
  border-color: #4fc3f7;
  box-shadow: 0 0 0 2px rgba(79, 195, 247, 0.2);
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

/* 记住我 & 忘记密码 */
.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
  accent-color: #4fc3f7;
}

.remember-me label {
  color: rgba(255, 255, 255, 0.7);
}

.forgot-password {
  color: #4fc3f7;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 14px;
  position: relative;
  padding: 2px 4px;
}

.forgot-password::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #4fc3f7;
  transition: width 0.3s;
}

.forgot-password:hover::after {
  width: 100%;
}

.forgot-password:hover {
  text-decoration: none;
  color: #b3e5fc;
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.register-account {
  color: #4fc3f7;
  text-decoration: none;
  margin-left: 8px;
  transition: all 0.3s;
  position: relative;
  padding: 2px 4px;
}

.register-account::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #4fc3f7;
  transition: width 0.3s;
}

.register-account:hover::after {
  width: 100%;
}

.register-account:hover {
  text-decoration: none;
  color: #b3e5fc;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.3);
  letter-spacing: 1px;
  display: block;
  max-width: 340px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.login-btn:hover::before {
  width: 300px;
  height: 300px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.5);
}

/* 页脚 */
.footer {
  text-align: center;
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    width: 90%;
    padding: 40px 25px;
  }

  .logo-text {
    font-size: 24px;
  }

  .welcome-text {
    font-size: 20px;
  }
  
  .remember-forgot {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}

/* 动画效果 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes flow {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 200%;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}
</style>
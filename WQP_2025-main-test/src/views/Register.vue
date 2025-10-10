<!-- src/views/Register.vue -->
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式状态
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPasswordRequirements = ref(false)

// src/views/Register.vue
const handleRegister = async (e) => {
  e.preventDefault()

  // 验证密码确认
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  
  // 验证密码强度
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
  if (!passwordRegex.test(password.value)) {
    alert('密码不符合要求：\n- 长度至少8位\n- 包含至少一个大写字母\n- 包含至少一个小写字母\n- 包含至少一个数字\n- 包含至少一个特殊字符(!@#$%^&*)')
    return
  }
  
  try {
    // 修改这里：将 /register 改为 /
    const response = await axios.post('http://localhost:3000/api/users', {
      username: username.value,
      password: password.value,
      // 可能还需要添加 email 和 role 字段
      email: '', // 如果需要的话
      role: 'user' // 默认角色
    })
    
    if (response.status === 200 || response.status === 201) {
      alert('注册成功')
      router.push('/login')
    } else {
      // 处理其他状态码
      alert(`注册失败: ${response.data.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('注册失败:', error)
    
    // 更详细的错误处理
    if (error.response) {
      // 服务器返回了错误响应
      if (error.response.status === 409) {
        alert('用户名已存在，请选择其他用户名')
      } else if (error.response.status === 400) {
        alert(`注册信息有误: ${error.response.data.message || '请检查输入信息'}`)
      } else if (error.response.status === 500) {
        alert('服务器内部错误，请稍后再试')
      } else {
        alert(`注册失败: ${error.response.data.message || '请稍后再试'}`)
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      alert('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      alert('注册过程中发生错误，请稍后再试')
    }
  }
}

// 返回登录页
const goToLogin = () => {
  router.push('/login')
}

// 密码输入事件处理
const handlePasswordInput = () => {
  showPasswordRequirements.value = true
}

// 密码失去焦点事件处理
const handlePasswordBlur = () => {
  // 延迟隐藏，让用户能看到验证结果
  setTimeout(() => {
    showPasswordRequirements.value = false
  }, 200)
}

// 检查密码是否满足要求
const checkPasswordRequirement = (regex) => {
  return password.value && regex.test(password.value)
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
    <!-- 水滴元素 -->
    <div class="water-drop drop-1"></div>
    <div class="water-drop drop-2"></div>
    <div class="water-drop drop-3"></div>

    <!-- 水流线条 -->
    <div class="water-stream stream-1"></div>
    <div class="water-stream stream-2"></div>
    <div class="water-stream stream-3"></div>
    
    <!-- 气泡元素 -->
    <div class="bubble bubble-1"></div>
    <div class="bubble bubble-2"></div>
    <div class="bubble bubble-3"></div>
    <div class="bubble bubble-4"></div>
  </div>

  <!-- 注册卡片 -->
  <div class="register-card">
    <div class="logo">
      <i class="fas fa-water logo-icon"></i>
      <div class="logo-text">水质预测平台</div>
    </div>

    <h2 class="welcome-text">创建账户</h2>
    <p class="subtitle">加入我们，共同守护水质安全</p>

    <form @submit="handleRegister">
      <div class="form-group">
        <label class="form-label">用户名</label>
        <div class="input-with-icon">
          <i class="fas fa-user input-icon"></i>
          <input 
            v-model="username" 
            type="text" 
            class="form-input" 
            placeholder="请输入用户名" 
            required 
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">密码</label>
        <div class="input-with-icon">
          <i class="fas fa-lock input-icon"></i>
          <input 
            v-model="password" 
            @input="handlePasswordInput"
            @blur="handlePasswordBlur"
            type="password" 
            class="form-input" 
            placeholder="请输入密码" 
            required 
          />
        </div>
        <!-- 密码要求提示框 -->
        <div 
          v-show="showPasswordRequirements" 
          class="password-requirements-tooltip"
        >
          <div class="tooltip-content">
            <div class="tooltip-title">密码要求：</div>
            <ul class="requirement-list">
              <li :class="{ met: checkPasswordRequirement(/.{8,}/) }">
                长度至少8位
              </li>
              <li :class="{ met: checkPasswordRequirement(/.*[a-z].*/) }">
                至少一个小写字母
              </li>
              <li :class="{ met: checkPasswordRequirement(/.*[A-Z].*/) }">
                至少一个大写字母
              </li>
              <li :class="{ met: checkPasswordRequirement(/.*\d.*/) }">
                至少一个数字
              </li>
              <li :class="{ met: checkPasswordRequirement(/.*[!@#$%^&*].*/) }">
                至少一个特殊字符 (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">确认密码</label>
        <div class="input-with-icon">
          <i class="fas fa-lock input-icon"></i>
          <input 
            v-model="confirmPassword" 
            type="password" 
            class="form-input" 
            placeholder="请再次输入密码" 
            required 
          />
        </div>
      </div>

      <button type="submit" class="register-btn">注册</button>
    </form>

    <div class="login-link">
      已有账户？
      <a href="#" class="go-login" @click="goToLogin">立即登录</a>
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

/* 注册页面容器 */
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

/* 水滴元素 */
.water-drop {
  position: absolute;
  width: 10px;
  height: 15px;
  background: rgba(79, 195, 247, 0.3);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: drip 2s linear infinite;
}

.drop-1 {
  top: 30%;
  left: 20%;
  animation-delay: 0s;
}

.drop-2 {
  top: 70%;
  right: 30%;
  animation-delay: -0.5s;
}

.drop-3 {
  bottom: 40%;
  left: 40%;
  animation-delay: -1s;
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

/* 注册卡片 */
.register-card {
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
  position: relative;
  z-index: 2;
}

.form-input:focus {
  border-color: #4fc3f7;
  box-shadow: 0 0 0 2px rgba(79, 195, 247, 0.2);
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.register-btn {
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
  margin: 0 auto 30px auto;
  position: relative;
  overflow: hidden;
}

.register-btn::before {
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

.register-btn:hover::before {
  width: 300px;
  height: 300px;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.5);
}

.login-link {
  text-align: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.go-login {
  color: #4fc3f7;
  text-decoration: none;
  margin-left: 8px;
  transition: all 0.3s;
  position: relative;
  padding: 2px 4px;
}

.go-login::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #4fc3f7;
  transition: width 0.3s;
}

.go-login:hover::after {
  width: 100%;
}

.go-login:hover {
  text-decoration: none;
  color: #b3e5fc;
}

.footer {
  text-align: center;
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

/* 密码要求提示框样式 */
.password-requirements-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-width: 340px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(79, 195, 247, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.tooltip-content {
  text-align: left;
}

.tooltip-title {
  color: white;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.requirement-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.requirement-list li {
  color: #ff4d4f;
  margin-bottom: 5px;
  position: relative;
  padding-left: 20px;
  font-size: 13px;
  transition: all 0.3s;
}

.requirement-list li:before {
  content: "✗";
  position: absolute;
  left: 0;
  top: 0;
  color: #ff4d4f;
  transition: all 0.3s;
}

.requirement-list li.met {
  color: #52c41a;
}

.requirement-list li.met:before {
  content: "✓";
  color: #52c41a;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-card {
    width: 90%;
    padding: 40px 25px;
  }

  .logo-text {
    font-size: 24px;
  }

  .welcome-text {
    font-size: 20px;
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

@keyframes drip {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}
</style>
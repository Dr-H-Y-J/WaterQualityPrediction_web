<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <nav class="navbar animate__animated animate__fadeInDown">
      <div class="nav-container">
        <div class="nav-logo">
          <i class="fas fa-water"></i>
          <span>水质预测平台</span>
        </div>
        <ul class="nav-menu">
          <li><a href="#home" class="nav-link active">首页</a></li>
          <li><a href="#features" class="nav-link">功能特性</a></li>
          <li><a href="#about" class="nav-link">关于我们</a></li>
          <li><a href="#contact" class="nav-link">联系我们</a></li>
        </ul>
        <div class="nav-actions">
          <router-link to="/login" class="btn btn-outline">登录</router-link>
          <router-link to="/register" class="btn btn-primary">注册</router-link>
        </div>
      </div>
    </nav>

    <!-- 首页横幅 -->
    <section class="hero-section" id="home">
      <div class="hero-content">
        <div class="hero-text animate__animated animate__fadeInLeft">
          <h1 class="hero-title animate__animated animate__pulse animate__delay-1s">基于AI的水质预测平台</h1>
          <p class="hero-subtitle animate__animated animate__fadeInUp animate__delay-2s">利用先进的时间序列模型和机器学习技术，为您提供精准的水质预测和分析服务</p>
          <div class="hero-buttons animate__animated animate__fadeInUp animate__delay-3s">
            <router-link to="/register" class="btn btn-primary btn-lg">立即体验</router-link>
            <a href="#features" class="btn btn-outline btn-lg">了解更多</a>
          </div>
        </div>
        <div class="hero-image animate__animated animate__fadeInRight">

        </div>
      </div>
      <!-- 添加新的背景动画元素 -->
      <div class="bubbles-container">
        <div class="bubble bubble-1"></div>
        <div class="bubble bubble-2"></div>
        <div class="bubble bubble-3"></div>
        <div class="bubble bubble-4"></div>
        <div class="bubble bubble-5"></div>
        <div class="bubble bubble-6"></div>
        <div class="bubble bubble-7"></div>
        <div class="bubble bubble-8"></div>
        <div class="bubble bubble-9"></div>
        <div class="bubble bubble-10"></div>
      </div>
    </section>

    <!-- 功能特性 -->
    <section class="features-section" id="features">
      <div class="container">
        <div class="section-header animate__animated animate__fadeInUp">
          <h2 class="section-title">核心功能</h2>
          <p class="section-subtitle">我们提供全面的水质监测和预测解决方案</p>
        </div>
        <div class="features-grid">
          <div class="feature-card animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3 class="feature-title">实时监测</h3>
            <p class="feature-description">24小时不间断监测水质参数，确保数据的实时性和准确性</p>
          </div>
          <div class="feature-card animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
            <div class="feature-icon">
              <i class="fas fa-bell"></i>
            </div>
            <h3 class="feature-title">智能预警</h3>
            <p class="feature-description">异常情况自动预警，及时通知相关人员采取措施</p>
          </div>
          <div class="feature-card animate__animated animate__fadeInUp" style="animation-delay: 0.3s">
            <div class="feature-icon">
              <i class="fas fa-robot"></i>
            </div>
            <h3 class="feature-title">AI预测</h3>
            <p class="feature-description">基于深度学习的时间序列模型，精准预测未来水质变化</p>
          </div>
          <div class="feature-card animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
            <div class="feature-icon">
              <i class="fas fa-cloud"></i>
            </div>
            <h3 class="feature-title">云端存储</h3>
            <p class="feature-description">数据安全存储在云端，随时随地访问历史记录</p>
          </div>
          <div class="feature-card animate__animated animate__fadeInUp" style="animation-delay: 0.5s">
            <div class="feature-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <h3 class="feature-title">移动应用</h3>
            <p class="feature-description">支持移动端访问，随时随地掌握水质状况</p>
          </div>
          <div class="feature-card animate__animated animate__fadeInUp" style="animation-delay: 0.6s">
            <div class="feature-icon">
              <i class="fas fa-chart-pie"></i>
            </div>
            <h3 class="feature-title">数据分析</h3>
            <p class="feature-description">多维度数据分析，生成可视化报告</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据展示 -->
    <section class="data-section">
      <div class="container">
        <div class="data-content">
          <div class="data-text animate__animated animate__fadeInUp">
            <h2 class="data-title">用数据说话</h2>
            <p class="data-description">我们的平台已服务众多客户，处理海量数据</p>
          </div>
          <div class="data-stats">
            <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
              <div class="stat-number">1000+</div>
              <div class="stat-label">服务站点</div>
            </div>
            <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">预测准确率</div>
            </div>
            <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.3s">
              <div class="stat-number">10M+</div>
              <div class="stat-label">数据记录</div>
            </div>
            <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
              <div class="stat-number">24/7</div>
              <div class="stat-label">全天候服务</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section class="about-section" id="about">
      <div class="container">
        <div class="about-content">
          <div class="about-image animate__animated animate__fadeInLeft">
            <div class="image-placeholder">
              <i class="fas fa-water"></i>
            </div>
          </div>
          <div class="about-text animate__animated animate__fadeInRight">
            <h2 class="about-title">关于我们</h2>
            <p class="about-description">我们是一支专注于水质监测和预测的技术团队，致力于通过先进的AI技术保护水资源环境。</p>
            <ul class="about-list">
              <li class="animate__animated animate__fadeInRight" style="animation-delay: 0.1s"><i class="fas fa-check-circle"></i> 专业的技术团队</li>
              <li class="animate__animated animate__fadeInRight" style="animation-delay: 0.2s"><i class="fas fa-check-circle"></i> 先进的AI算法</li>
              <li class="animate__animated animate__fadeInRight" style="animation-delay: 0.3s"><i class="fas fa-check-circle"></i> 完善的售后服务</li>
              <li class="animate__animated animate__fadeInRight" style="animation-delay: 0.4s"><i class="fas fa-check-circle"></i> 丰富的行业经验</li>
            </ul>
            <router-link to="/about" class="btn btn-primary animate__animated animate__heartBeat animate__delay-1s">了解更多</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="contact-section" id="contact">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">联系我们</h2>
          <p class="section-subtitle">有任何问题或建议？欢迎随时与我们联系</p>
        </div>
        <div class="contact-content">
          <div class="contact-info">
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <h4>地址</h4>
                <p>湖州市南浔区</p>
              </div>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <div>
                <h4>电话</h4>
                <p>+86 10 1234 5678</p>
              </div>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h4>邮箱</h4>
                <p>contact@waterpredict.com</p>
              </div>
            </div>
          </div>
          <div class="contact-form">
            <form>
              <div class="form-group">
                <input type="text" placeholder="您的姓名" class="form-control">
              </div>
              <div class="form-group">
                <input type="email" placeholder="您的邮箱" class="form-control">
              </div>
              <div class="form-group">
                <textarea placeholder="您的消息" rows="5" class="form-control"></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-block">发送消息</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <i class="fas fa-water"></i>
            <span>水质预测平台</span>
          </div>
          <div class="footer-links">
            <a href="#">隐私政策</a>
            <a href="#">服务条款</a>
            <a href="#">帮助中心</a>
          </div>
          <div class="footer-social">
            <a href="#"><i class="fab fa-weixin"></i></a>
            <a href="#"><i class="fab fa-weibo"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2023 水质预测平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 控制水滴交互状态
const isInteractive = ref(false)

// 鼠标进入事件
const handleMouseEnter = () => {
  isInteractive.value = true
}

// 鼠标离开事件
const handleMouseLeave = () => {
  isInteractive.value = false
}

// 水波动效相关变量
let canvas, ctx
let particles = []
let mouseX = 0
let mouseY = 0
let animationId = null
let isMouseInWindow = false

// 水波动效按钮点击事件
const handleLiquidButtonClick = (e) => {
  const button = e.target.closest('.liquid-button')
  if (!button) return
  
  const rect = button.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  // 为所有wave元素更新CSS变量
  const waves = button.querySelectorAll('.wave')
  waves.forEach(wave => {
    wave.style.setProperty('--x', x + 'px')
    wave.style.setProperty('--y', y + 'px')
  })
}

// 粒子类
class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = Math.random() * 15 + 5
    this.speedX = Math.random() * 3 - 1.5
    this.speedY = Math.random() * 3 - 1.5
    this.color = `rgba(30, 144, 255, ${Math.random() * 0.5 + 0.2})`
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    if (this.size > 0.2) this.size -= 0.1
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 初始化画布
const initCanvas = () => {
  const heroSection = document.querySelector('.hero-section')
  if (!heroSection) return

  canvas = document.createElement('canvas')
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '0'
  
  heroSection.appendChild(canvas)
  ctx = canvas.getContext('2d')
  resizeCanvas()
}

// 调整画布大小
const resizeCanvas = () => {
  if (!canvas) return
  canvas.width = canvas.parentElement.clientWidth
  canvas.height = canvas.parentElement.clientHeight
}

// 鼠标移动事件处理
const handleMouseMove = (e) => {
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  // 创建新粒子
  if (isMouseInWindow) {
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(mouseX, mouseY))
    }
  }
}

// 鼠标进入窗口
const handleMouseEnterWindow = () => {
  isMouseInWindow = true
}

// 鼠标离开窗口
const handleMouseLeaveWindow = () => {
  isMouseInWindow = false
}

// 动画循环
const animate = () => {
  if (!ctx || !canvas) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 更新和绘制粒子
  for (let i = 0; i < particles.length; i++) {
    particles[i].update()
    particles[i].draw()
  }
  
  // 移除过小的粒子
  particles = particles.filter(particle => particle.size > 0.2)
  
  animationId = requestAnimationFrame(animate)
}

// 开始动画
const startAnimation = () => {
  if (!animationId) {
    animationId = requestAnimationFrame(animate)
  }
}

// 停止动画
const stopAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

// 组件挂载时初始化
onMounted(() => {
  initCanvas()
  startAnimation()
  
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseenter', handleMouseEnterWindow)
  window.addEventListener('mouseleave', handleMouseLeaveWindow)
})

// 组件卸载前清理
onBeforeUnmount(() => {
  stopAnimation()
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseenter', handleMouseEnterWindow)
  window.removeEventListener('mouseleave', handleMouseLeaveWindow)
  
  // 移除画布
  if (canvas && canvas.parentElement) {
    canvas.parentElement.removeChild(canvas)
  }
})
</script>

<style scoped>
/* 基础样式 */
.home-container {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: white;
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.5);
}

.btn-outline {
  background: transparent;
  color: #1890ff;
  border: 2px solid #1890ff;
}

.btn-outline:hover {
  background: #1890ff;
  color: white;
}

.btn-lg {
  padding: 15px 30px;
  font-size: 16px;
}

.btn-block {
  display: block;
  width: 100%;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
}

.nav-logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
}

.nav-logo i {
  margin-right: 10px;
}

.nav-menu {
  display: flex;
  list-style: none;
}

.nav-link {
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #1890ff;
}

.nav-actions {
  display: flex;
  gap: 15px;
}

/* 首页横幅 */
.hero-section {
  padding: 150px 0 100px;
  background: linear-gradient(135deg, #0a192f, #0c2d48);
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 10% 20%, rgba(70, 130, 180, 0.2) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(30, 144, 255, 0.2) 0%, transparent 20%),
    radial-gradient(circle at 50% 50%, rgba(65, 105, 225, 0.1) 0%, transparent 30%);
  background-size: 
    100% 100%,
    100% 100%,
    100% 100%;
  animation: waterMovement 20s infinite linear;
  z-index: 0;
}

.hero-section::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 60%, rgba(135, 206, 235, 0.3) 0px, transparent 20px),
    radial-gradient(circle at 60% 30%, rgba(135, 206, 235, 0.3) 0px, transparent 20px),
    radial-gradient(circle at 80% 70%, rgba(135, 206, 235, 0.3) 0px, transparent 20px);
  background-size: 
    100% 100%,
    100% 100%,
    100% 100%;
  animation: bubbles 15s infinite ease-in-out;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 50px;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 20px;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 动画效果 */
@keyframes drip {
  0%, 100% {
    border-radius: 50% 45% 48% 52% / 55% 50% 50% 45%;
    transform: rotate(10deg);
  }
  25% {
    border-radius: 52% 48% 45% 50% / 50% 48% 52% 50%;
    transform: rotate(12deg);
  }
  50% {
    border-radius: 48% 50% 50% 52% / 52% 45% 55% 48%;
    transform: rotate(8deg);
  }
  75% {
    border-radius: 50% 48% 52% 50% / 48% 52% 48% 52%;
    transform: rotate(11deg);
  }
}

@keyframes dripInteractive {
  0% {
    border-radius: 50% 45% 48% 52% / 55% 50% 50% 45%;
  }
  100% {
    border-radius: 55% 40% 50% 45% / 50% 45% 55% 50%;
  }
}

/* 新增气泡动画 */
.bubbles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: -100px;
  width: 40px;
  height: 40px;
  background: rgba(135, 206, 250, 0.2);
  border-radius: 50%;
  opacity: 0.5;
  animation: bubble 15s infinite ease-in;
}

.bubble::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  transform: scale(0.25) translate(-70%, -70%);
  background: radial-gradient(rgba(255, 255, 255, 0.5), transparent);
  border-radius: 50%;
}

.bubble-1 {
  left: 10%;
  animation-delay: 0s;
  animation-duration: 15s;
}

.bubble-2 {
  left: 20%;
  animation-delay: 1s;
  animation-duration: 18s;
  width: 30px;
  height: 30px;
  background: rgba(173, 216, 230, 0.3);
}

.bubble-3 {
  left: 30%;
  animation-delay: 3s;
  animation-duration: 12s;
  width: 50px;
  height: 50px;
  background: rgba(135, 206, 235, 0.25);
}

.bubble-4 {
  left: 40%;
  animation-delay: 4s;
  animation-duration: 16s;
  width: 35px;
  height: 35px;
  background: rgba(176, 196, 222, 0.3);
}

.bubble-5 {
  left: 50%;
  animation-delay: 2s;
  animation-duration: 14s;
  width: 25px;
  height: 25px;
  background: rgba(100, 149, 237, 0.35);
}

.bubble-6 {
  left: 60%;
  animation-delay: 5s;
  animation-duration: 20s;
  width: 60px;
  height: 60px;
  background: rgba(135, 206, 250, 0.15);
}

.bubble-7 {
  left: 70%;
  animation-delay: 6s;
  animation-duration: 15s;
  width: 45px;
  height: 45px;
  background: rgba(173, 216, 230, 0.25);
}

.bubble-8 {
  left: 80%;
  animation-delay: 7s;
  animation-duration: 18s;
  width: 20px;
  height: 20px;
  background: rgba(135, 206, 235, 0.4);
}

.bubble-9 {
  left: 90%;
  animation-delay: 9s;
  animation-duration: 16s;
  width: 55px;
  height: 55px;
  background: rgba(176, 196, 222, 0.2);
}

.bubble-10 {
  left: 5%;
  animation-delay: 10s;
  animation-duration: 22s;
  width: 38px;
  height: 38px;
  background: rgba(100, 149, 237, 0.3);
}

@keyframes bubble {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translateX(100px);
  }
  100% {
    bottom: 1080px;
    transform: translateX(-200px);
  }
}

@keyframes waterMovement {
  0% {
    background-position: 
      0% 0%,
      100% 100%,
      0% 100%;
  }
  25% {
    background-position: 
      10% 10%,
      90% 90%,
      20% 80%;
  }
  50% {
    background-position: 
      100% 100%,
      0% 0%,
      100% 0%;
  }
  75% {
    background-position: 
      90% 90%,
      10% 10%,
      80% 20%;
  }
  100% {
    background-position: 
      0% 0%,
      100% 100%,
      0% 100%;
  }
}

@keyframes bubbles {
  0% {
    background-position: 
      0% 100%,
      100% 0%,
      50% 100%;
      opacity: 0.3;
    }
    25% {
      background-position: 
        25% 75%,
        75% 25%,
        25% 75%;
      opacity: 0.5;
    }
    50% {
      background-position: 
        100% 0%,
        0% 100%,
        50% 0%;
      opacity: 0.7;
    }
    75% {
      background-position: 
        75% 25%,
        25% 75%,
        75% 25%;
      opacity: 0.5;
    }
    100% {
      background-position: 
        0% 100%,
        100% 0%,
        50% 100%;
      opacity: 0.3;
    }
  }

/* 功能特性 */
.features-section {
  padding: 100px 0;
  background: #f8f9fa;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
}

.section-subtitle {
  font-size: 18px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: #1890ff;
}

.feature-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}

/* 数据展示 */
.data-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: white;
}

.data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.data-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
}

.data-description {
  font-size: 20px;
  margin-bottom: 50px;
  opacity: 0.9;
}

.data-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  width: 100%;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 18px;
  opacity: 0.9;
}

/* 关于我们 */
.about-section {
  padding: 100px 0;
}

.about-content {
  display: flex;
  align-items: center;
  gap: 50px;
}

.about-image {
  flex: 1;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #0a192f, #0c2d48);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4fc3f7;
  font-size: 100px;
}

.about-text {
  flex: 1;
}

.about-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.about-description {
  font-size: 18px;
  margin-bottom: 30px;
  color: #666;
}

.about-list {
  list-style: none;
  margin-bottom: 30px;
}

.about-list li {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  font-size: 16px;
}

.about-list i {
  color: #52c41a;
  margin-right: 10px;
  font-size: 20px;
}

/* 联系我们 */
.contact-section {
  padding: 100px 0;
  background: #f8f9fa;
}

.contact-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 50px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.contact-item {
  display: flex;
  gap: 20px;
}

.contact-item i {
  font-size: 24px;
  color: #1890ff;
  margin-top: 5px;
}

.contact-item h4 {
  margin-bottom: 5px;
  color: #333;
}

.contact-item p {
  color: #666;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #1890ff;
  outline: none;
}

/* 页脚 */
.footer {
  background: #0a192f;
  color: white;
  padding: 50px 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 30px;
}

.footer-logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
}

.footer-logo i {
  margin-right: 10px;
  color: #4fc3f7;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

.footer-social {
  display: flex;
  gap: 15px;
}

.footer-social a {
  color: rgba(255, 255, 255, 0.7);
  font-size: 20px;
  transition: color 0.3s;
}

.footer-social a:hover {
  color: #4fc3f7;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .about-content {
    flex-direction: column;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .data-stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding: 120px 0 80px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .data-stats {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    padding: 20px;
  }
}
</style>
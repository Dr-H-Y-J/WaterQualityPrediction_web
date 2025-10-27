<!-- src/views/Features.vue -->
<template>
  <div class="features-container">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content animate__animated animate__fadeInDown">
          <h1 class="header-title animate__animated animate__pulse animate__delay-1s">功能特性</h1>
          <p class="header-subtitle animate__animated animate__fadeInUp animate__delay-2s">深入了解我们的核心功能和优势</p>
          <div class="header-divider animate__animated animate__fadeIn animate__delay-3s"></div>
        </div>
      </div>
    </section>

    <!-- 主要功能 -->
    <section class="main-features">
      <div class="container">
        <div class="section-header animate__animated animate__fadeInUp">
          <h2 class="section-title">核心功能</h2>
          <p class="section-subtitle">我们提供全面的水质监测与分析解决方案</p>
        </div>
        <div class="features-grid">
          <div class="feature-item animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
            <div class="feature-icon bg-blue">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="feature-content">
              <h3>实时水质监测</h3>
              <p>通过部署在各个监测点的传感器，实时收集水质数据，包括pH值、溶解氧、浊度、电导率等关键指标。</p>
              <ul>
                <li>24小时不间断监测</li>
                <li>毫秒级数据采集</li>
                <li>异常数据自动标记</li>
              </ul>
            </div>
          </div>

          <div class="feature-item animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
            <div class="feature-icon bg-green">
              <i class="fas fa-robot"></i>
            </div>
            <div class="feature-content">
              <h3>AI预测模型</h3>
              <p>基于LSTM、ARIMA等先进的时间序列预测模型，结合机器学习算法，准确预测未来水质变化趋势。</p>
              <ul>
                <li>99%+预测准确率</li>
                <li>支持多参数联合预测</li>
                <li>自适应模型优化</li>
              </ul>
            </div>
          </div>

          <div class="feature-item animate__animated animate__fadeInUp" style="animation-delay: 0.3s">
            <div class="feature-icon bg-purple">
              <i class="fas fa-bell"></i>
            </div>
            <div class="feature-content">
              <h3>智能预警系统</h3>
              <p>当监测数据超出预设阈值或预测结果异常时，系统自动触发预警机制，通过多种渠道通知相关人员。</p>
              <ul>
                <li>多级预警机制</li>
                <li>多种通知方式</li>
                <li>自定义预警规则</li>
              </ul>
            </div>
          </div>

          <div class="feature-item animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
            <div class="feature-icon bg-orange">
              <i class="fas fa-chart-pie"></i>
            </div>
            <div class="feature-content">
              <h3>数据分析报告</h3>
              <p>提供丰富的数据分析工具和可视化报表，帮助用户深入理解水质变化规律和趋势。</p>
              <ul>
                <li>自定义报表生成</li>
                <li>多种图表类型</li>
                <li>历史数据对比分析</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术架构 -->
    <section class="tech-architecture">
      <div class="container">
        <div class="section-header animate__animated animate__fadeInUp">
          <h2 class="section-title">技术架构</h2>
          <p class="section-subtitle">我们采用先进的技术栈确保系统的稳定性和高效性</p>
        </div>
        <div class="architecture-diagram">
          <div class="architecture-flow">
            <div class="layer layer-1 animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
              <div class="layer-content">
                <div class="component">传感器网络</div>
                <div class="component">数据采集器</div>
                <div class="component">边缘计算设备</div>
              </div>
              <div class="layer-title">数据采集层</div>
            </div>
            <div class="layer layer-2 animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
              <div class="layer-content">
                <div class="component">4G/5G网络</div>
                <div class="component">LoRaWAN</div>
                <div class="component">NB-IoT</div>
              </div>
              <div class="layer-title">数据传输层</div>
            </div>
            <div class="layer layer-3 animate__animated animate__fadeInUp" style="animation-delay: 0.3s">
              <div class="layer-content">
                <div class="component">实时数据处理</div>
                <div class="component">数据清洗</div>
                <div class="component">数据存储</div>
              </div>
              <div class="layer-title">数据处理层</div>
            </div>
            <div class="layer layer-4 animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
              <div class="layer-content">
                <div class="component">时间序列预测</div>
                <div class="component">异常检测</div>
                <div class="component">趋势分析</div>
              </div>
              <div class="layer-title">AI分析层</div>
            </div>
            <div class="layer layer-5 animate__animated animate__fadeInUp" style="animation-delay: 0.5s">
              <div class="layer-content">
                <div class="component">Web管理平台</div>
                <div class="component">移动端APP</div>
                <div class="component">API接口</div>
              </div>
              <div class="layer-title">应用展示层</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 应用场景 -->
    <section class="use-cases">
      <div class="container">
        <div class="section-header animate__animated animate__fadeInUp">
          <h2 class="section-title">应用场景</h2>
          <p class="section-subtitle">我们的解决方案适用于多种水质监测场景</p>
        </div>
        <div class="cases-grid">
          <div class="case-card animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
            <div class="case-icon">
              <i class="fas fa-city"></i>
            </div>
            <h3>城市供水</h3>
            <p>监测城市自来水厂出水水质，确保居民用水安全</p>
          </div>
          <div class="case-card animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
            <div class="case-icon">
              <i class="fas fa-industry"></i>
            </div>
            <h3>工业废水</h3>
            <p>监控工业企业排放废水，确保达标排放</p>
          </div>
          <div class="case-card animate__animated animate__fadeInUp" style="animation-delay: 0.3s">
            <div class="case-icon">
              <i class="fas fa-fish"></i>
            </div>
            <h3>水产养殖</h3>
            <p>监测养殖水域水质，优化养殖环境</p>
          </div>
          <div class="case-card animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
            <div class="case-icon">
              <i class="fas fa-mountain"></i>
            </div>
            <h3>自然水体</h3>
            <p>监测河流、湖泊等自然水体，保护生态环境</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 功能页面逻辑
</script>

<style scoped>
.features-container {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #0a192f, #0c2d48);
  color: white;
  padding: 120px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
}

.header-content {
  position: relative;
  z-index: 2;
}

.header-title {
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.header-subtitle {
  font-size: 22px;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto 30px;
  font-weight: 300;
}

.header-divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  margin: 30px auto;
  border-radius: 2px;
}

/* 章节标题 */
.section-header {
  text-align: center;
  margin-bottom: 70px;
  position: relative;
}

.section-header::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #0a192f;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-subtitle {
  font-size: 18px;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

/* 主要功能 */
.main-features {
  padding: 120px 0;
  background: #f8f9fa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.feature-item {
  background: white;
  border-radius: 12px;
  padding: 50px 35px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid #eee;
}

.feature-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature-item:hover {
  transform: translateY(-15px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-item:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  font-size: 36px;
  color: white;
  position: relative;
  z-index: 2;
  transition: transform 0.4s ease;
}

.feature-item:hover .feature-icon {
  transform: scale(1.1);
}

.bg-blue {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  box-shadow: 0 10px 20px rgba(24, 144, 255, 0.3);
}

.bg-green {
  background: linear-gradient(135deg, #52c41a, #73d13d);
  box-shadow: 0 10px 20px rgba(82, 196, 26, 0.3);
}

.bg-purple {
  background: linear-gradient(135deg, #722ed1, #9254de);
  box-shadow: 0 10px 20px rgba(114, 46, 209, 0.3);
}

.bg-orange {
  background: linear-gradient(135deg, #fa8c16, #faad14);
  box-shadow: 0 10px 20px rgba(250, 140, 22, 0.3);
}

.feature-content h3 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #0a192f;
}

.feature-content p {
  color: #666;
  margin-bottom: 25px;
  font-size: 16px;
  line-height: 1.7;
}

.feature-content ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.feature-content ul li {
  padding: 10px 0 10px 35px;
  position: relative;
  color: #555;
  font-size: 15px;
  border-bottom: 1px dashed #eee;
}

.feature-content ul li:last-child {
  border-bottom: none;
}

.feature-content ul li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
  font-size: 18px;
  top: 10px;
}

/* 技术架构 */
.tech-architecture {
  padding: 120px 0;
  background: white;
}

.architecture-diagram {
  display: flex;
  justify-content: center;
}

.architecture-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: center;
  position: relative;
}

.architecture-flow::before {
  content: "";
  position: absolute;
  top: 50px;
  left: 10%;
  width: 80%;
  height: 3px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  z-index: 1;
}

.layer {
  flex: 1;
  min-width: 180px;
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-top: 5px solid #1890ff;
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
  text-align: center;
}

.layer:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.layer-title {
  font-size: 20px;
  font-weight: 700;
  margin-top: auto;
  padding-top: 20px;
  color: #0a192f;
  text-align: center;
  position: relative;
}

.layer-title::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background: #1890ff;
}

.layer-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.component {
  background: rgba(24, 144, 255, 0.1);
  padding: 12px 20px;
  border-radius: 30px;
  font-weight: 500;
  color: #1890ff;
  text-align: center;
  transition: all 0.3s ease;
  font-size: 15px;
}

.component:hover {
  background: rgba(24, 144, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(24, 144, 255, 0.2);
}

/* 应用场景 */
.use-cases {
  padding: 120px 0;
  background: #f8f9fa;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.case-card {
  background: white;
  border-radius: 12px;
  padding: 50px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid #eee;
}

.case-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.case-card:hover {
  transform: translateY(-15px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.case-card:hover::before {
  transform: scaleX(1);
}

.case-icon {
  width: 80px;
  height: 80px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  font-size: 32px;
  color: #1890ff;
  transition: all 0.4s ease;
}

.case-card:hover .case-icon {
  background: #1890ff;
  color: white;
  transform: scale(1.1);
}

.case-card h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #0a192f;
}

.case-card p {
  color: #666;
  font-size: 16px;
  line-height: 1.7;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .header-title {
    font-size: 42px;
  }
  
  .header-subtitle {
    font-size: 20px;
  }
  
  .section-title {
    font-size: 36px;
  }
  
  .layer {
    min-width: 150px;
  }
  
  .layer-content {
    gap: 12px;
  }
  
  .component {
    padding: 10px 15px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 80px 0;
  }
  
  .header-title {
    font-size: 36px;
  }
  
  .header-subtitle {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .main-features,
  .tech-architecture,
  .use-cases {
    padding: 80px 0;
  }
  
  .features-grid,
  .cases-grid {
    grid-template-columns: 1fr;
  }
  
  .architecture-flow {
    flex-direction: column;
  }
  
  .architecture-flow::before {
    display: none;
  }
  
  .layer {
    min-width: 100%;
  }
  
  .layer-title {
    padding-top: 15px;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 15px;
  }
  
  .header-title {
    font-size: 32px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .feature-item,
  .case-card {
    padding: 35px 20px;
  }
  
  .layer {
    padding: 20px 15px;
  }
  
  .feature-content h3,
  .case-card h3 {
    font-size: 22px;
  }
}
</style>
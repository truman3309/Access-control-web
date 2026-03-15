<template>
  <NavBar />

  <main class="main-content fade-in">
    <!-- Hero 區塊 -->
    <section class="hero">
      <h2>歡迎使用門禁系統</h2>
      <p>本系統整合 ESP32 硬體與雲端 Web 平台，提供即時門禁刷卡紀錄、訪客登記與查詢功能。</p>

      <!-- 作品介紹 (可展開) -->
      <div class="intro-section">
        <h3>
          作品介紹
          <button class="toggle-btn" @click="toggleIntro">
            {{ introOpen ? '▲ 收合' : '▼ 展開' }}
          </button>
        </h3>
        <ul v-if="introOpen" class="intro-list fade-in">
          <li><strong>硬體模組：</strong>ESP32、RC522 RFID、0.96 吋 OLED、SD 卡模組</li>
          <li><strong>前端技術：</strong>Vue 3、Vite、Pinia、Vue Router</li>
          <li><strong>後端架構：</strong>Flask / Node.js + MySQL / Google Sheet</li>
          <li><strong>特色：</strong>即時刷卡顯示、訪客登記、遠端紀錄查詢</li>
        </ul>
      </div>
    </section>

    <!-- 狀態卡片 -->
    <div class="card-container">
      <div class="card">
        <h3>最後刷卡 UID</h3>
        <p class="uid">{{ lastUID }}</p>
        <button class="btn-refresh" @click="fetchUID">重新整理</button>
      </div>

      <div class="card">
        <h3>系統狀態</h3>
        <p :class="['status', statusClass]">{{ statusText }}</p>
      </div>
    </div>
  </main>

  <footer>
    <p>© 2025 truman3309 | IoT Access Control System</p>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'

const API_BASE_URL = 'http://localhost:3000'
const introOpen = ref(false)
const lastUID = ref('讀取中...')
const statusText = ref('等待連線中...')
const statusClass = ref('waiting')

function toggleIntro() {
  introOpen.value = !introOpen.value
}

async function fetchUID() {
  lastUID.value = '讀取中...'
  statusText.value = '連線中...'
  statusClass.value = 'waiting'
  try {
    const res = await fetch(`${API_BASE_URL}/last-uid`)
    const data = await res.json()
    lastUID.value = data.uid || '無資料'
    statusText.value = '連線正常'
    statusClass.value = 'connected'
  } catch {
    lastUID.value = '無法取得'
    statusText.value = '連線失敗'
    statusClass.value = 'error'
  }
}

onMounted(() => {
  fetchUID()
})
</script>

<style scoped>
.main-content {
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 40px;
}

.hero h2 {
  font-size: 1.8rem;
  color: #0056b3;
  margin-bottom: 12px;
}

.hero p {
  color: #555;
  font-size: 1rem;
}

.intro-section {
  margin-top: 24px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.intro-section h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #333;
  font-size: 1.1rem;
}

.toggle-btn {
  background: none;
  border: 1px solid #007bff;
  border-radius: 4px;
  color: #007bff;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 2px 10px;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background-color: #007bff;
  color: white;
}

.intro-list {
  list-style: none;
  margin-top: 14px;
  line-height: 2;
  background: #f0f6ff;
  border-radius: 8px;
  padding: 16px 20px;
}

.intro-list li {
  color: #444;
}

/* 卡片 */
.card-container {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card h3 {
  color: #007bff;
  margin-bottom: 12px;
}

.uid {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 14px;
  word-break: break-all;
}

.btn-refresh {
  background-color: #ffdf5d;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-refresh:hover {
  background-color: #f5c93d;
}

.status {
  font-size: 1rem;
  font-weight: 600;
  padding: 8px 0;
}

.status.waiting { color: #999; }
.status.connected { color: #28a745; }
.status.error { color: #dc3545; }
</style>

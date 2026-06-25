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

      <p v-if="!supported" class="unsupported">
        這個瀏覽器不支援 Web Bluetooth，請改用桌面版 Chrome 或 Edge（iPhone / Safari 不支援）。
      </p>
    </section>

    <!-- 狀態卡片 -->
    <div class="card-container">
      <div class="card">
        <h3>最後刷卡 UID</h3>
        <p class="uid">{{ lastUID }}</p>
        <button class="btn-refresh" :disabled="!supported" @click="toggleConnect">
          {{ connected ? '中斷連線' : '連接 ESP32' }}
        </button>
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
import { ref, onUnmounted } from 'vue'
import NavBar from '../components/NavBar.vue'

// Nordic UART Service（與 ESP32 韌體一致）
const NUS = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
const RX  = '6e400002-b5a3-f393-e0a9-e50e24dcca9e' // 網頁 → ESP32
const TX  = '6e400003-b5a3-f393-e0a9-e50e24dcca9e' // ESP32 → 網頁

const introOpen = ref(false)
const supported = ref(typeof navigator !== 'undefined' && !!navigator.bluetooth)
const connected = ref(false)
const lastUID = ref('—')
const statusText = ref(supported.value ? '未連接' : '瀏覽器不支援藍牙')
const statusClass = ref('waiting')

let device = null, txCharic = null, rxCharic = null
let buf = ''
const decoder = new TextDecoder()

function toggleIntro() { introOpen.value = !introOpen.value }
function formatUID(s) { const h = String(s).toUpperCase(); const m = h.match(/.{1,2}/g); return m ? m.join(':') : h }

function toggleConnect() {
  if (connected.value) disconnect()
  else connect()
}

async function connect() {
  try {
    statusText.value = '搜尋裝置…'; statusClass.value = 'waiting'
    device = await navigator.bluetooth.requestDevice({ filters: [{ namePrefix: 'ESP32' }], optionalServices: [NUS] })
    device.addEventListener('gattserverdisconnected', onDisconnected)
    statusText.value = '連線中…'
    const server = await device.gatt.connect()
    const service = await server.getPrimaryService(NUS)
    txCharic = await service.getCharacteristic(TX)
    rxCharic = await service.getCharacteristic(RX)
    await txCharic.startNotifications()
    txCharic.addEventListener('characteristicvaluechanged', onNotify)
    connected.value = true
    statusText.value = '已連接：' + (device.name || 'ESP32')
    statusClass.value = 'connected'
    buf = ''
    await sendCmd('GET')   // 先抓裝置上最後一筆，之後即時更新
  } catch (err) {
    if (err && err.name === 'NotFoundError') { statusText.value = '已取消選擇'; statusClass.value = 'waiting' }
    else { statusText.value = '連線失敗'; statusClass.value = 'error'; lastUID.value = '無法取得' }
  }
}

async function sendCmd(cmd) { if (rxCharic) await rxCharic.writeValue(new TextEncoder().encode(cmd)) }

function onNotify(e) {
  buf += decoder.decode(e.target.value)
  if (buf.includes('<<CLEARED>>')) { buf = buf.replace('<<CLEARED>>', ''); lastUID.value = '（已清空）' }
  if (buf.includes('<<EOF>>')) { buf = buf.replace('<<EOF>>', ''); statusText.value = '已連接，即時接收中'; statusClass.value = 'connected' }
  let idx
  while ((idx = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, idx).trim()
    buf = buf.slice(idx + 1)
    if (!line) continue
    try {
      const r = JSON.parse(line)
      if (r.uid) {
        lastUID.value = formatUID(r.uid)               // 顯示最後刷卡 UID
        statusText.value = '已連接（最後狀態：' + (r.status === 'in' ? '進' : '出') + '）'
        statusClass.value = 'connected'
      }
    } catch { /* 忽略壞行 */ }
  }
}

function disconnect() { if (device && device.gatt.connected) device.gatt.disconnect() }

function onDisconnected() {
  connected.value = false
  statusText.value = '已中斷'
  statusClass.value = 'waiting'
}

onUnmounted(() => {
  if (txCharic) { try { txCharic.removeEventListener('characteristicvaluechanged', onNotify) } catch {} }
  if (device && device.gatt && device.gatt.connected) device.gatt.disconnect()
})
</script>

<style scoped>
.main-content { padding: 40px 20px; max-width: 900px; margin: 0 auto; }
.hero { text-align: center; margin-bottom: 40px; }
.hero h2 { font-size: 1.8rem; color: #0056b3; margin-bottom: 12px; }
.hero p { color: #555; font-size: 1rem; }
.unsupported {
  background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba;
  padding: 10px 14px; border-radius: 8px; margin-top: 16px; font-size: 0.95rem;
  max-width: 600px; margin-left: auto; margin-right: auto;
}
.intro-section { margin-top: 24px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto; }
.intro-section h3 { display: flex; align-items: center; gap: 12px; color: #333; font-size: 1.1rem; }
.toggle-btn { background: none; border: 1px solid #007bff; border-radius: 4px; color: #007bff; cursor: pointer; font-size: 0.85rem; padding: 2px 10px; transition: all 0.2s; }
.toggle-btn:hover { background-color: #007bff; color: white; }
.intro-list { list-style: none; margin-top: 14px; line-height: 2; background: #f0f6ff; border-radius: 8px; padding: 16px 20px; }
.intro-list li { color: #444; }
.card-container { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.card { background-color: #fff; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
.card h3 { color: #007bff; margin-bottom: 12px; }
.uid { font-size: 1.3rem; font-weight: bold; color: #333; margin-bottom: 14px; word-break: break-all; }
.btn-refresh { background-color: #ffdf5d; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-weight: 600; transition: background-color 0.3s; }
.btn-refresh:hover:not(:disabled) { background-color: #f5c93d; }
.btn-refresh:disabled { opacity: 0.45; cursor: not-allowed; }
.status { font-size: 1rem; font-weight: 600; padding: 8px 0; }
.status.waiting { color: #999; }
.status.connected { color: #28a745; }
.status.error { color: #dc3545; }
</style>

<template>
  <NavBar />

  <main class="main-content fade-in">
    <!-- Hero 區塊 -->
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Live Reader</p>
        <h2>歡迎使用門禁系統</h2>
        <p class="hero-desc">本系統整合 ESP32 硬體與雲端 Web 平台，提供即時門禁刷卡紀錄、訪客登記與查詢功能。</p>

        <!-- 作品介紹 (可展開) -->
        <div class="intro-section">
          <button class="toggle-btn" @click="toggleIntro">
            {{ introOpen ? '▲ 收合作品介紹' : '▼ 展開作品介紹' }}
          </button>
          <ul v-if="introOpen" class="intro-list fade-in">
            <li><strong>硬體模組：</strong>ESP32、RC522 RFID、0.96 吋 OLED、SD 卡模組</li>
            <li><strong>前端技術：</strong>Vue 3、Vite、Pinia、Vue Router</li>
            <li><strong>後端架構：</strong>Flask / Node.js + MySQL / Google Sheet</li>
            <li><strong>特色：</strong>即時刷卡顯示、訪客登記、遠端紀錄查詢</li>
          </ul>
        </div>
      </div>

      <!-- 感應動畫（簽名元素） -->
      <div class="reader-illustration" :class="{ 'is-connected': connected }" aria-hidden="true">
        <div class="reader-plate">
          <span class="led" :class="connected ? 'go' : 'stop'"></span>
        </div>
        <div class="badge-card">
          <span class="chip"></span>
        </div>
      </div>
    </section>

    <p v-if="!supported" class="notice err unsupported">
      這個瀏覽器不支援 Web Bluetooth，請改用桌面版 Chrome 或 Edge（iPhone / Safari 不支援）。
    </p>

    <!-- 狀態面板 -->
    <div class="card-container">
      <div class="panel status-card">
        <p class="eyebrow">最後刷卡 UID</p>
        <p class="uid">{{ lastUID }}</p>
        <button class="btn btn-primary" :disabled="!supported" @click="toggleConnect">
          {{ connected ? '中斷連線' : '連接 ESP32' }}
        </button>
      </div>

      <div class="panel status-card">
        <p class="eyebrow">系統狀態</p>
        <p class="status-line">
          <span class="led" :class="statusClass === 'connected' ? 'go' : statusClass === 'error' ? 'stop' : ''"></span>
          {{ statusText }}
        </p>
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

function formatUID(s) {
  const h = String(s).toUpperCase()
  const padded = h.length % 2 === 0 ? h : '0' + h
  const m = padded.match(/.{1,2}/g)
  return m ? m.join(':') : h
}

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

    try {
      await sendCmd('GET')
    } catch (e) {
      console.warn('送出 GET 指令失敗，但連線仍維持', e)
    }
  } catch (err) {
    if (err && err.name === 'NotFoundError') { statusText.value = '已取消選擇'; statusClass.value = 'waiting' }
    else { statusText.value = '連線失敗'; statusClass.value = 'error'; lastUID.value = '無法取得' }
  }
}

async function sendCmd(cmd) { if (rxCharic) await rxCharic.writeValue(new TextEncoder().encode(cmd)) }

function onNotify(e) {
  buf += decoder.decode(e.target.value)
  if (buf.includes('<<CLEARED>>')) { buf = buf.replaceAll('<<CLEARED>>', ''); lastUID.value = '（已清空）' }
  if (buf.includes('<<EOF>>')) { buf = buf.replaceAll('<<EOF>>', ''); statusText.value = '已連接，即時接收中'; statusClass.value = 'connected' }
  let idx
  while ((idx = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, idx).trim()
    buf = buf.slice(idx + 1)
    if (!line) continue
    try {
      const r = JSON.parse(line)
      if (r.uid) {
        lastUID.value = formatUID(r.uid)
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
.main-content { padding: 48px 24px 32px; max-width: 1000px; margin: 0 auto; }

.hero {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 40px;
  align-items: center;
  margin-bottom: 40px;
}

.hero h2 { font-size: 2rem; margin: 10px 0 14px; }
.hero-desc { color: var(--mist); max-width: 46ch; }

.intro-section { margin-top: 26px; }
.toggle-btn {
  background: none;
  border: 1px solid var(--panel-edge);
  border-radius: 20px;
  color: var(--mist);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 7px 16px;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.toggle-btn:hover { border-color: var(--brass); color: var(--brass-hi); }

.intro-list {
  list-style: none;
  margin-top: 16px;
  line-height: 2;
  background: var(--panel);
  border: 1px solid var(--panel-edge);
  border-radius: 10px;
  padding: 18px 22px;
}
.intro-list li { color: var(--mist); font-size: 0.92rem; }
.intro-list strong { color: #dcd6c8; }

.unsupported { max-width: 640px; margin: 0 0 24px; }

/* === 感應動畫 === */
.reader-illustration {
  position: relative;
  height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reader-plate {
  width: 130px;
  height: 130px;
  border-radius: 20px;
  background: var(--panel);
  border: 1px solid var(--panel-edge);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 14px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}
.badge-card {
  position: absolute;
  width: 116px;
  height: 74px;
  border-radius: 10px;
  background: linear-gradient(155deg, var(--card), #e2dac4);
  border: 1px solid var(--card-edge);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: flex-start;
  padding: 10px;
  transform: translateY(52px) rotate(-3deg);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.reader-illustration.is-connected .badge-card {
  transform: translateY(-4px) rotate(-1deg);
}

@media (prefers-reduced-motion: reduce) {
  .badge-card { transition: none; }
}

/* === 狀態面板 === */
.card-container { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.status-card { padding: 26px; }
.uid {
  font-family: var(--font-mono);
  font-size: 1.35rem;
  font-weight: 600;
  color: #f2eee3;
  margin: 10px 0 18px;
  word-break: break-all;
}
.status-line {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #dcd6c8;
  margin-top: 10px;
  font-size: 1rem;
}

@media (max-width: 760px) {
  .hero { grid-template-columns: 1fr; }
  .reader-illustration { order: -1; height: 150px; }
}
</style>

<template>
  <NavBar />

  <main class="page page-lg fade-in">
    <section class="bento">
      <!-- Hero 區塊 -->
      <div class="panel hero">
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
      </div>

      <p v-if="!supported" class="notice err unsupported">
        這個瀏覽器不支援 Web Bluetooth，請改用桌面版 Chrome 或 Edge（iPhone / Safari 不支援）。
      </p>

      <!-- 狀態面板 -->
      <div class="panel status-card">
        <p class="label">最後刷卡 UID</p>
        <p class="uid">{{ lastUID }}</p>
        <button class="btn btn-primary" :disabled="!supported" @click="toggleConnect">
          {{ connected ? '中斷連線' : '連接 ESP32' }}
        </button>
      </div>

      <div class="panel status-card">
        <p class="label">系統狀態</p>
        <p class="status-line">
          <span class="led" :class="statusClass === 'connected' ? 'go' : statusClass === 'error' ? 'stop' : ''"></span>
          {{ statusText }}
        </p>
      </div>

      <!-- 快速入口（手機版有底部分頁列，這裡會隱藏） -->
      <router-link to="/records" class="panel link-card">
        <span class="app-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </span>
        <span class="link-text"><strong>刷卡紀錄</strong><small>最近 20 筆通行狀態</small></span>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>
      <router-link to="/visitor" class="panel link-card">
        <span class="app-icon green" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        </span>
        <span class="link-text"><strong>訪客登記</strong><small>為來訪者開臨時通行證</small></span>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>
      <router-link to="/query" class="panel link-card">
        <span class="app-icon amber" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <span class="link-text"><strong>查詢紀錄</strong><small>依姓名或 UID 搜尋</small></span>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>
    </section>
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
/* 便當盒（bento）格狀版面：共 6 欄，卡片各佔不同欄數 */
.bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.hero {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 32px;
  align-items: center;
  padding: 40px 44px;
  overflow: hidden;
}
.hero h2 {
  font-size: clamp(2rem, 5vw, 2.8rem);
  letter-spacing: -0.03em;
  margin: 8px 0 14px;
}
.hero-desc { color: var(--text-2); max-width: 46ch; font-size: 1.02rem; }

.intro-section { margin-top: 24px; }
.toggle-btn {
  background: var(--field);
  border: 1px solid var(--glass-border);
  border-radius: 980px;
  color: var(--blue);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 7px 16px;
  transition: background 0.2s ease;
}
.toggle-btn:hover { background: var(--blue-tint); }

.intro-list {
  list-style: none;
  margin-top: 16px;
  line-height: 2;
  background: var(--field);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 14px 22px;
}
.intro-list li { color: var(--text-2); font-size: 0.9rem; }
.intro-list strong { color: var(--text); font-weight: 600; }

.unsupported { grid-column: 1 / -1; margin: 0; }

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
  border-radius: 28px;
  background: var(--field);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 14px;
  box-shadow: inset 0 1px 0 var(--glass-hi);
  transition: box-shadow 0.5s ease;
}
.reader-illustration.is-connected .reader-plate {
  box-shadow: inset 0 1px 0 var(--glass-hi), 0 0 44px rgba(48, 209, 88, 0.22);
}
.badge-card {
  position: absolute;
  width: 116px;
  height: 74px;
  border-radius: 12px;
  background: linear-gradient(155deg, #f2f2f7, #c7c9d6);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
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

/* === 狀態卡 === */
.status-card { grid-column: span 3; padding: 26px 28px; }
.uid {
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text);
  margin: 8px 0 20px;
  word-break: break-all;
  letter-spacing: 0.02em;
}
.status-line {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--text);
  margin-top: 10px;
  font-size: 1.05rem;
}

/* === 快速入口 === */
.link-card {
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  text-decoration: none;
  transition: transform 0.2s var(--ease), background 0.2s var(--ease);
}
.link-card:hover { transform: translateY(-3px); background: var(--glass-strong); }
.link-text { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.link-text strong { color: var(--text); font-weight: 600; font-size: 1rem; }
.link-text small { color: var(--text-3); font-size: 0.8rem; }
.chev { width: 18px; height: 18px; color: var(--text-3); flex-shrink: 0; }

@media (max-width: 820px) {
  .hero { grid-template-columns: 1fr; padding: 28px 24px; gap: 20px; }
  .reader-illustration { order: -1; height: 150px; margin-bottom: 14px; }
  .status-card, .link-card { grid-column: 1 / -1; }
}
@media (max-width: 720px) {
  .link-card { display: none; }
}
</style>

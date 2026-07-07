<template>
  <NavBar />

  <main class="container fade-in">
    <p class="eyebrow">Live Log</p>
    <h2>刷卡紀錄</h2>
    <p class="desc">即時刷卡狀態與最近的通行紀錄，最多保留 20 筆。</p>

    <div class="panel status-box">
      <span class="led" :class="statusClass === 'status-pass' ? 'go' : statusClass === 'status-deny' ? 'stop' : ''"></span>
      <span class="status-text">{{ statusArea }}</span>
    </div>

    <div class="panel table-panel">
      <table class="log-table">
        <thead>
          <tr>
            <th>卡號 (UID)</th>
            <th>時間</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="records.length === 0">
            <td colspan="3" class="empty-row">尚未偵測到刷卡，感應區保持待命。</td>
          </tr>
          <tr v-for="(row, i) in records" :key="i" :class="row.status === '通過' ? 'row-pass' : 'row-deny'">
            <td>{{ row.uid }}</td>
            <td>{{ row.time }}</td>
            <td>
              <span :class="row.status === '通過' ? 'tag pass' : 'tag deny'">
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <footer>
    <p>© 2025 truman3309 | IoT Access Control System</p>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar from '../components/NavBar.vue'

const statusArea = ref('讀取中…')
const statusClass = ref('')
const records = ref([])
let timer = null
let lastKnownKey = null

function toRowStatus(status) {
  return status === '正常' || status === '通過' ? '通過' : '拒絕'
}

async function loadRecords() {
  try {
    const res = await fetch('/api/access-records?limit=20')
    if (!res.ok) throw new Error('讀取失敗')
    const data = await res.json()

    records.value = data.map(r => ({ uid: r.uid, time: r.time, status: toRowStatus(r.status) }))

    if (data.length > 0) {
      const latest = data[0]
      const key = `${latest.uid}-${latest.time}`
      if (key !== lastKnownKey) {
        lastKnownKey = key
        const rowStatus = toRowStatus(latest.status)
        statusArea.value = `卡號：${latest.uid}　狀態：${rowStatus}　時間：${latest.time}`
        statusClass.value = rowStatus === '通過' ? 'status-pass' : 'status-deny'
      }
    } else {
      statusArea.value = '等待刷卡…'
      statusClass.value = ''
    }
  } catch {
    statusArea.value = '讀不到資料庫，稍後會自動重試。'
    statusClass.value = 'status-deny'
  }
}

onMounted(() => {
  loadRecords()
  timer = setInterval(loadRecords, 5000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 44px auto;
  padding: 0 20px 20px;
}

h2 { font-size: 1.7rem; margin: 8px 0 8px; }

.desc {
  color: var(--mist);
  margin-bottom: 24px;
}

.status-box {
  padding: 16px 22px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.status-text {
  font-family: var(--font-mono);
  font-size: 0.92rem;
  color: #dcd6c8;
}

.table-panel { padding: 8px 0 4px; overflow-x: auto; }
.table-panel .log-table { min-width: 480px; }

.empty-row {
  text-align: center;
  color: var(--mist-2);
  padding: 26px 16px;
}
</style>

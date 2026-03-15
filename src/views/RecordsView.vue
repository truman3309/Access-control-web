<template>
  <NavBar />

  <main class="container fade-in">
    <section class="card-log">
      <h2>刷卡紀錄</h2>
      <p class="desc">以下顯示即時刷卡狀態與歷史紀錄。</p>

      <div class="status-box" :class="statusClass">{{ statusArea }}</div>

      <table id="recordTable">
        <thead>
          <tr>
            <th>卡號 (UID)</th>
            <th>時間</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="records.length === 0">
            <td colspan="3" style="text-align:center; color: #999;">目前沒有資料</td>
          </tr>
          <tr v-for="(row, i) in records" :key="i" :class="row.status === '通過' ? 'row-pass' : 'row-deny'">
            <td>{{ row.uid }}</td>
            <td>{{ row.time }}</td>
            <td>
              <span :class="row.status === '通過' ? 'badge-pass' : 'badge-deny'">
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer>
    <p>© 2025 truman3309 | IoT Access Control System</p>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar from '../components/NavBar.vue'

const statusArea = ref('等待刷卡...')
const statusClass = ref('')
const records = ref([])
let timer = null

function randomUID() {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
  ).join(':')
}

function simulateSwipe() {
  const uid = randomUID()
  const now = new Date().toLocaleString('zh-TW', { hour12: false })
  const status = Math.random() > 0.5 ? '通過' : '拒絕'
  statusArea.value = `卡號：${uid}　狀態：${status}　時間：${now}`
  statusClass.value = status === '通過' ? 'status-pass' : 'status-deny'
  records.value.unshift({ uid, time: now, status })
  // 最多保留 20 筆
  if (records.value.length > 20) records.value.pop()
}

onMounted(() => {
  timer = setInterval(simulateSwipe, 5000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
}

.card-log h2 {
  font-size: 1.6rem;
  color: #0056b3;
  margin-bottom: 8px;
}

.desc {
  color: #666;
  margin-bottom: 20px;
}

.status-box {
  padding: 14px 20px;
  border-radius: 8px;
  background-color: #e9ecef;
  font-weight: 600;
  margin-bottom: 20px;
  transition: background-color 0.4s, color 0.4s;
  color: #555;
}

.status-box.status-pass {
  background-color: #d4edda;
  color: #155724;
}

.status-box.status-deny {
  background-color: #f8d7da;
  color: #721c24;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

th {
  background-color: #0056b3;
  color: #fff;
  padding: 12px 16px;
  text-align: left;
}

td {
  padding: 11px 16px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.row-pass td {
  background-color: #f8fff9;
}

.row-deny td {
  background-color: #fff8f8;
}

.badge-pass {
  background-color: #28a745;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-deny {
  background-color: #dc3545;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>

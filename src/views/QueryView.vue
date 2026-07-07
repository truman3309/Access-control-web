<template>
  <NavBar />

  <main class="container fade-in">
    <p class="eyebrow">Search Archive</p>
    <h2>進出紀錄查詢</h2>

    <div class="search-bar panel">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="輸入姓名或卡片 UID…"
        @keyup.enter="searchRecords"
      />
      <button class="btn btn-primary" @click="searchRecords">查詢</button>
    </div>

    <div class="panel table-panel">
      <div class="table-scroll">
        <table class="log-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>卡片 UID</th>
              <th>時間</th>
              <th>類型</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingRecords">
              <td colspan="5" class="empty-row">資料載入中…</td>
            </tr>
            <tr v-else-if="filteredRecords.length === 0">
              <td colspan="5" class="empty-row">查無符合的紀錄，換個關鍵字再試試。</td>
            </tr>
            <tr
              v-for="(r, i) in filteredRecords"
              :key="i"
              :class="r.status && r.status !== '正常' ? 'row-deny' : 'row-pass'"
            >
              <td>{{ r.visitor_name || '未登記訪客' }}</td>
              <td>{{ r.uid }}</td>
              <td>{{ r.time }}</td>
              <td>{{ r.type || '刷卡' }}</td>
              <td>
                <span :class="r.status && r.status !== '正常' ? 'tag deny' : 'tag pass'">
                  {{ r.status || '正常' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 異常報告 -->
    <section class="report-section">
      <p class="eyebrow">Exceptions</p>
      <h3>異常事件報告</h3>
      <button class="btn btn-ghost report-btn" @click="generateReport">生成報告</button>

      <div v-if="reportItems.length > 0" class="panel report-box">
        <ul>
          <li v-for="(r, i) in reportItems" :key="i">
            <strong>{{ r.visitor_name || r.uid }}</strong>
            （UID: {{ r.uid }}）於 {{ r.time }}，狀態：
            <span class="report-status">{{ r.status }}</span>
          </li>
        </ul>
      </div>
      <div v-else-if="reportGenerated" class="panel report-box">
        <p class="empty-note">目前沒有異常事件，通行紀錄一切正常。</p>
      </div>
    </section>
  </main>

  <footer>
    <p>© 2025 truman3309 | IoT Access Control System</p>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'

const allRecords = ref([])
const searchQuery = ref('')
const loadingRecords = ref(true)
const reportItems = ref([])
const reportGenerated = ref(false)

const filteredRecords = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return allRecords.value
  return allRecords.value.filter(r =>
    (r.visitor_name && r.visitor_name.toLowerCase().includes(q)) ||
    (r.uid && r.uid.toLowerCase().includes(q))
  )
})

async function fetchRecords() {
  loadingRecords.value = true
  try {
    const res = await fetch('/api/access-records')
    const data = await res.json()
    allRecords.value = data
  } catch {
    allRecords.value = []
  }
  loadingRecords.value = false
}

function searchRecords() {
  // filteredRecords is already reactive, just trigger any pending UI update
}

function generateReport() {
  reportGenerated.value = true
  reportItems.value = allRecords.value.filter(r => r.status && r.status !== '正常')
}

onMounted(fetchRecords)
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 44px auto;
  padding: 0 20px 20px;
}

h2 { font-size: 1.7rem; margin: 8px 0 22px; }

.search-bar {
  display: flex;
  gap: 10px;
  padding: 10px;
  margin-bottom: 22px;
}

.search-bar input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--panel-edge);
  border-radius: 7px;
  font-size: 1rem;
  font-family: var(--font-body);
  background: var(--ink-2);
  color: #dcd6c8;
  transition: border-color 0.2s ease;
}
.search-bar input::placeholder { color: var(--mist-2); }
.search-bar input:focus {
  outline: none;
  border-color: var(--brass);
}

.table-panel { padding: 8px 0 4px; margin-bottom: 34px; }
.table-scroll { overflow-x: auto; }
.table-panel .log-table { min-width: 600px; }

.empty-row {
  text-align: center;
  color: var(--mist-2);
  padding: 26px 16px;
}

.report-section h3 { margin: 6px 0 14px; font-size: 1.2rem; }

.report-btn { margin-bottom: 16px; }

.report-box { padding: 18px 22px; }

.report-box ul { list-style: none; }

.report-box li {
  padding: 8px 0;
  border-bottom: 1px solid var(--panel-edge);
  color: var(--mist);
  font-size: 0.92rem;
}
.report-box li:last-child { border-bottom: none; }
.report-box li strong { color: #dcd6c8; }

.report-status { color: var(--stop); font-weight: 700; }

.empty-note { color: var(--mist); font-size: 0.92rem; }
</style>

<template>
  <NavBar />

  <main class="page fade-in">
    <p class="eyebrow">Search Archive</p>
    <h2 class="page-title">進出紀錄查詢</h2>

    <div class="panel search-bar">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="輸入姓名或卡片 UID…"
        aria-label="搜尋姓名或卡片 UID"
        @keyup.enter="searchRecords"
      />
      <button class="btn btn-primary" @click="searchRecords">查詢</button>
    </div>

    <div class="panel table-panel">
      <div class="table-scroll">
        <table class="log-table stack">
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
              <td data-label="姓名">{{ r.visitor_name || '未登記訪客' }}</td>
              <td class="mono" data-label="卡片 UID">{{ r.uid }}</td>
              <td class="mono" data-label="時間">{{ r.time }}</td>
              <td data-label="類型">{{ r.type || '刷卡' }}</td>
              <td data-label="狀態">
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
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 20px;
  margin-bottom: 18px;
  border-radius: 980px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.search-bar:focus-within {
  border-color: var(--blue);
  box-shadow: var(--shadow), 0 0 0 4px var(--blue-tint);
}
.search-icon { width: 18px; height: 18px; color: var(--text-3); flex-shrink: 0; }
.search-bar input {
  flex: 1;
  min-width: 0;
  padding: 8px 4px;
  border: none;
  outline: none;
  background: none;
  font-size: 1rem; /* 16px 以上，iPhone 才不會自動放大畫面 */
  color: var(--text);
}

.table-panel { padding: 6px 0 4px; margin-bottom: 36px; overflow: hidden; }

.report-section h3 { margin: 6px 0 14px; font-size: 1.25rem; }
.report-btn { margin-bottom: 16px; }

.report-box { padding: 8px 24px; }
.report-box ul { list-style: none; }
.report-box li {
  padding: 12px 0;
  border-bottom: 1px solid var(--hairline);
  color: var(--text-2);
  font-size: 0.92rem;
}
.report-box li:last-child { border-bottom: none; }
.report-box li strong { color: var(--text); font-weight: 600; }
.report-status { color: var(--red); font-weight: 600; }
.empty-note { color: var(--text-2); font-size: 0.92rem; padding: 10px 0; }
</style>

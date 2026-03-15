<template>
  <NavBar />

  <main class="container fade-in">
    <h2>進出紀錄查詢</h2>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="輸入姓名或卡片 UID..."
        @keyup.enter="searchRecords"
      />
      <button @click="searchRecords">查詢</button>
    </div>

    <div class="table-container">
      <table>
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
            <td colspan="5" class="loading">資料載入中...</td>
          </tr>
          <tr v-else-if="filteredRecords.length === 0">
            <td colspan="5" class="loading">查無紀錄</td>
          </tr>
          <tr
            v-for="(r, i) in filteredRecords"
            :key="i"
            :class="r.status && r.status !== '正常' ? 'row-abnormal' : ''"
          >
            <td>{{ r.visitor_name || '未登記訪客' }}</td>
            <td>{{ r.uid }}</td>
            <td>{{ r.time }}</td>
            <td>{{ r.type || '刷卡' }}</td>
            <td>
              <span :class="r.status && r.status !== '正常' ? 'badge-abnormal' : 'badge-normal'">
                {{ r.status || '正常' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 異常報告 -->
    <div class="report-section">
      <h3>異常事件報告</h3>
      <button class="btn-report" @click="generateReport">生成報告</button>

      <div v-if="reportItems.length > 0" class="report-box">
        <ul>
          <li v-for="(r, i) in reportItems" :key="i">
            <strong>{{ r.visitor_name || r.uid }}</strong>
            （UID: {{ r.uid }}）於 {{ r.time }} 狀態：
            <span class="status-abnormal">{{ r.status }}</span>
          </li>
        </ul>
      </div>
      <div v-else-if="reportGenerated" class="report-box">
        <p>目前沒有異常事件報告。</p>
      </div>
    </div>
  </main>

  <footer>
    <p>© 2025 truman3309 | IoT Access Control System</p>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'

const API_BASE_URL = 'http://localhost:3000'
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
    const res = await fetch(`${API_BASE_URL}/access-records`)
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
  margin: 40px auto;
  padding: 0 20px;
}

h2 {
  font-size: 1.6rem;
  color: #0056b3;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 4px rgba(0,123,255,0.2);
}

.search-bar button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #0056b3;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 30px;
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

.loading {
  text-align: center;
  color: #999;
  padding: 20px;
}

.row-abnormal td {
  background-color: #fff5f5;
}

.badge-normal {
  background-color: #28a745;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 600;
}

.badge-abnormal {
  background-color: #dc3545;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 600;
}

.report-section {
  margin-top: 10px;
}

.report-section h3 {
  color: #333;
  margin-bottom: 12px;
}

.btn-report {
  padding: 10px 22px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
  margin-bottom: 14px;
}

.btn-report:hover {
  background-color: #5a6268;
}

.report-box {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px 20px;
}

.report-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.report-box li {
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  color: #444;
}

.report-box li:last-child {
  border-bottom: none;
}

.status-abnormal {
  color: #dc3545;
  font-weight: bold;
}
</style>

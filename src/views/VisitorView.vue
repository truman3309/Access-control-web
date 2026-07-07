<template>
  <NavBar />

  <main class="container fade-in">
    <p class="eyebrow">Visitor Slot</p>
    <h2>訪客預約</h2>
    <p class="desc">輸入訪客姓名與卡片 UID，為當天來訪的人先開一張臨時通行證。</p>

    <form class="panel visitor-form" @submit.prevent="handleSubmit">
      <div class="field">
        <label for="visitorName">訪客姓名</label>
        <input
          v-model="visitorName"
          type="text"
          id="visitorName"
          placeholder="請輸入姓名"
          required
        />
      </div>

      <div class="field">
        <label for="visitorID">卡片 UID</label>
        <input
          v-model="visitorID"
          type="text"
          id="visitorID"
          placeholder="請輸入卡片 UID"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
        {{ loading ? '登記中…' : '提交預約' }}
      </button>
    </form>

    <div v-if="message" :class="['notice', messageType === 'error' ? 'err' : 'ok']">{{ message }}</div>
  </main>

  <footer>
    <p>© 2025 truman3309 | IoT Access Control System</p>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'

const visitorName = ref('')
const visitorID = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)

async function handleSubmit() {
  message.value = ''

  if (!visitorName.value || !visitorID.value) {
    showMessage('姓名和卡片 UID 都要填，兩個欄位缺一不可。', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch('/api/register-visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: visitorName.value, uid: visitorID.value }),
    })
    const result = await response.json()

    if (response.ok) {
      showMessage(result.message || '登記完成，訪客可以刷卡進場了。', 'success')
      visitorName.value = ''
      visitorID.value = ''
    } else {
      showMessage(result.error || '登記失敗，請再試一次。', 'error')
    }
  } catch {
    showMessage('連不上伺服器，請稍後再試。', 'error')
  }

  loading.value = false
}

function showMessage(text, type) {
  message.value = text
  messageType.value = type
}
</script>

<style scoped>
.container {
  max-width: 560px;
  margin: 44px auto;
  padding: 0 20px 20px;
}

h2 { font-size: 1.7rem; margin: 8px 0 8px; }

.desc {
  color: var(--mist);
  margin-bottom: 26px;
}

.visitor-form { padding: 28px; }

.submit-btn { width: 100%; margin-top: 4px; }
</style>

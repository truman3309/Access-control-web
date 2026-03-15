<template>
  <NavBar />

  <main class="container fade-in">
    <h2>訪客預約</h2>
    <p class="desc">請輸入訪客姓名與卡片 UID 進行預約登記</p>

    <form class="visitor-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="visitorName">訪客姓名</label>
        <input
          v-model="visitorName"
          type="text"
          id="visitorName"
          placeholder="請輸入姓名"
          required
        />
      </div>

      <div class="form-group">
        <label for="visitorID">卡片 UID</label>
        <input
          v-model="visitorID"
          type="text"
          id="visitorID"
          placeholder="請輸入卡片 UID"
          required
        />
      </div>

      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? '提交中...' : '提交預約' }}
      </button>
    </form>

    <div v-if="message" :class="['message', messageType]">{{ message }}</div>
  </main>

  <footer>
    <p>© 2025 truman3309 | IoT Access Control System</p>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'

const API_BASE_URL = 'http://localhost:3000'
const API_KEY = 'a53d580a-b888-479c-a594-7687c7629285'

const visitorName = ref('')
const visitorID = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)

async function handleSubmit() {
  message.value = ''

  if (!visitorName.value || !visitorID.value) {
    showMessage('請輸入完整資料！', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch(`${API_BASE_URL}/register-visitor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ name: visitorName.value, uid: visitorID.value }),
    })
    const result = await response.json()

    if (response.ok) {
      showMessage(result.message || '預約成功！', 'success')
      visitorName.value = ''
      visitorID.value = ''
    } else {
      showMessage(result.error || '預約失敗，請重試！', 'error')
    }
  } catch {
    showMessage('無法連接伺服器，請稍後再試。', 'error')
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
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

h2 {
  font-size: 1.6rem;
  color: #0056b3;
  margin-bottom: 8px;
}

.desc {
  color: #666;
  margin-bottom: 28px;
}

.visitor-form {
  background: #fff;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

input[type="text"] {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.2);
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>

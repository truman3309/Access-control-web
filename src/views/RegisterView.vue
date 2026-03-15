<template>
  <div class="register-wrapper">
    <div class="register-container fade-in">
      <h2>註冊帳號</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">帳號名稱</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="請輸入用戶名"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">密碼</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="請輸入密碼"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">確認密碼</label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirm-password"
            placeholder="請再次輸入密碼"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? '處理中...' : '送出註冊' }}
        </button>
      </form>

      <p v-if="message" :class="['register-message', messageType]">{{ message }}</p>

      <div class="back-link">
        <button @click="router.push('/login')">← 返回登入</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)

async function handleRegister() {
  message.value = ''

  if (password.value !== confirmPassword.value) {
    message.value = '密碼與確認密碼不一致！'
    messageType.value = 'error'
    return
  }

  loading.value = true

  try {
    const res = await fetch('http://127.0.0.1:1100/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    const data = await res.json()

    if (data.status === 'success') {
      message.value = data.message
      messageType.value = 'success'
      username.value = ''
      password.value = ''
      confirmPassword.value = ''
    } else {
      message.value = data.message
      messageType.value = 'error'
    }
  } catch {
    message.value = '伺服器連線失敗。'
    messageType.value = 'error'
  }

  loading.value = false
}
</script>

<style scoped>
.register-wrapper {
  background-color: #f4f4f9;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.register-container {
  max-width: 450px;
  width: 100%;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: #007bff;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.2);
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.05em;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #0056b3;
}

button[type="submit"]:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-message {
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
  padding: 10px;
  border-radius: 6px;
}

.register-message.success {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.register-message.error {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.back-link {
  margin-top: 16px;
  text-align: center;
}

.back-link button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  padding: 0;
}

.back-link button:hover {
  color: #0056b3;
}
</style>

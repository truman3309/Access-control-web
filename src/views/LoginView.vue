<template>
  <div class="login-wrapper">
    <div class="login-container fade-in">
      <h2>門禁登入</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">使用者名稱</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="請輸入帳號"
            required
            autocomplete="username"
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
            autocomplete="current-password"
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? '登入中...' : '登入' }}
        </button>

        <div v-if="message" :class="['message', messageType]">{{ message }}</div>
      </form>

      <div class="register-link">
        <p>還沒有帳號嗎？</p>
        <button @click="router.push('/register')">前往註冊</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)

async function handleLogin() {
  message.value = ''
  loading.value = true

  if (!username.value || !password.value) {
    message.value = '請輸入完整的登入資訊。'
    messageType.value = 'error'
    loading.value = false
    return
  }

  // 模擬登入驗證（未串接後端）
  await new Promise(r => setTimeout(r, 500))

  if (username.value === 'admin' && password.value === '1234') {
    message.value = '登入成功，正在跳轉...'
    messageType.value = 'success'
    auth.login(username.value)
    setTimeout(() => router.push('/'), 800)
  } else {
    message.value = '帳號或密碼錯誤，請重新輸入。'
    messageType.value = 'error'
  }

  loading.value = false
}
</script>

<style scoped>
.login-wrapper {
  font-family: "Noto Sans TC", Arial, sans-serif;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}

.login-container {
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  color: #0056b3;
  font-size: 1.6rem;
  margin-bottom: 1.8rem;
  letter-spacing: 1px;
}

.form-group {
  text-align: left;
  margin-bottom: 1.2rem;
}

label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

button[type="submit"] {
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

button[type="submit"]:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

button[type="submit"]:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  margin-top: 16px;
  font-weight: 600;
  padding: 10px;
  border-radius: 6px;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.register-link {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.register-link p {
  color: #666;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.register-link button {
  background-color: transparent;
  border: 1px solid #007bff;
  border-radius: 6px;
  color: #007bff;
  padding: 8px 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  width: auto;
}

.register-link button:hover {
  background-color: #007bff;
  color: white;
}

@media (max-width: 480px) {
  .login-container {
    margin: 20px;
    padding: 30px 20px;
  }
}
</style>

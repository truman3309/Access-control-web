<template>
  <div class="login-wrapper">
    <div class="login-container card-surface fade-in">
      <div class="card-top">
        <span class="chip"></span>
        <span class="eyebrow-dark">ID ACCESS CARD</span>
      </div>

      <h2>門禁登入</h2>

      <form @submit.prevent="handleLogin">
        <div class="field">
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

        <div class="field">
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

        <button class="btn btn-primary submit-btn" type="submit" :disabled="loading">
          {{ loading ? '刷卡驗證中…' : '刷卡登入' }}
        </button>

        <div v-if="message" :class="['notice', messageType === 'error' ? 'err' : 'ok']">{{ message }}</div>
      </form>

      <div class="register-link">
        <p>還沒有識別證嗎？</p>
        <button class="btn btn-ghost" @click="router.push('/register')">前往註冊</button>
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
    message.value = '帳號和密碼都要填喔，兩個欄位缺一不可。'
    messageType.value = 'error'
    loading.value = false
    return
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    const data = await res.json()

    if (res.ok && data.status === 'success') {
      message.value = data.message
      messageType.value = 'success'
      auth.login(data.user?.username || username.value)
      setTimeout(() => router.push('/'), 800)
    } else {
      message.value = data.message || '帳號或密碼不正確，請再刷一次卡。'
      messageType.value = 'error'
    }
  } catch {
    message.value = '連不上伺服器，請稍後再試。'
    messageType.value = 'error'
  }

  loading.value = false
}
</script>

<style scoped>
.login-wrapper {
  font-family: var(--font-body);
  background: var(--ink);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-container {
  padding: 36px 34px;
  width: 100%;
  max-width: 400px;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
}

.eyebrow-dark {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--card-ink-soft);
}

h2 {
  color: var(--card-ink);
  font-size: 1.5rem;
  margin-bottom: 1.6rem;
}

.submit-btn { width: 100%; margin-top: 4px; }

.register-link {
  margin-top: 26px;
  padding-top: 18px;
  border-top: 1px solid var(--card-edge);
}

.register-link p {
  color: var(--card-ink-soft);
  margin-bottom: 12px;
  font-size: 0.88rem;
}

.register-link .btn { width: 100%; }

@media (max-width: 480px) {
  .login-container { padding: 30px 22px; }
}
</style>

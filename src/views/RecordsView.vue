<template>
  <div class="register-wrapper">
    <div class="register-container card-surface fade-in">
      <div class="card-top">
        <span class="chip"></span>
        <span class="eyebrow-dark">NEW ID CARD</span>
      </div>

      <h2>註冊識別證</h2>

      <form @submit.prevent="handleRegister">
        <div class="field">
          <label for="username">帳號名稱</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="請輸入用戶名"
            required
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
          />
        </div>

        <div class="field">
          <label for="confirm-password">確認密碼</label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirm-password"
            placeholder="請再次輸入密碼"
            required
          />
        </div>

        <button class="btn btn-primary submit-btn" type="submit" :disabled="loading">
          {{ loading ? '製卡中…' : '製作識別證' }}
        </button>
      </form>

      <p v-if="message" :class="['notice', messageType === 'error' ? 'err' : 'ok']">{{ message }}</p>

      <div class="back-link">
        <button class="btn btn-ghost" @click="router.push('/login')">← 返回登入</button>
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
    message.value = '兩次輸入的密碼不一樣，請重新確認。'
    messageType.value = 'error'
    return
  }

  loading.value = true

  try {
    const res = await fetch('/api/register', {
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
    message.value = '連不上伺服器，請稍後再試一次。'
    messageType.value = 'error'
  }

  loading.value = false
}
</script>

<style scoped>
.register-wrapper {
  background: var(--ink);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.register-container {
  max-width: 420px;
  width: 100%;
  padding: 34px 32px;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
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
  font-size: 1.4rem;
  margin-bottom: 1.4rem;
}

.submit-btn { width: 100%; }

.back-link {
  margin-top: 18px;
  text-align: center;
}
.back-link .btn {
  width: 100%;
}
</style>

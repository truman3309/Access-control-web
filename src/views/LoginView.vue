<template>
  <div class="auth-wrapper">
    <div class="auth-card panel fade-in">
      <div class="auth-head">
        <span class="app-icon lg" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </span>
        <p class="eyebrow">ID Access Card</p>
        <h2>門禁登入</h2>
      </div>

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

        <button class="btn btn-primary btn-block" type="submit" :disabled="loading">
          {{ loading ? '刷卡驗證中…' : '刷卡登入' }}
        </button>

        <div v-if="message" :class="['notice', messageType === 'error' ? 'err' : 'ok']">{{ message }}</div>
      </form>

      <div class="auth-foot">
        <p>還沒有識別證嗎？</p>
        <button class="btn btn-ghost btn-block" @click="router.push('/register')">前往註冊</button>
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

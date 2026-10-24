<template>
  <div class="auth-wrapper">
    <div class="auth-card panel fade-in">
      <div class="auth-head">
        <span class="app-icon green lg" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        </span>
        <p class="eyebrow">New ID Card</p>
        <h2>註冊帳號</h2>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="field">
          <label for="username">帳號名稱</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="請輸入用戶名"
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
            autocomplete="new-password"
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
            autocomplete="new-password"
          />
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? '處理中...' : '送出註冊' }}
        </button>

        <div v-if="message" :class="['notice', messageType === 'error' ? 'err' : 'ok']">{{ message }}</div>
      </form>

      <div class="auth-foot">
        <button class="link-btn" @click="router.push('/login')">← 返回登入</button>
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

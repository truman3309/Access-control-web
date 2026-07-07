<template>
  <header class="rail">
    <router-link to="/" class="brand">
      <span class="chip chip-sm"></span>
      <span class="brand-text">ACCESS CONTROL</span>
    </router-link>

    <nav class="rail-nav">
      <ul class="nav-links">
        <li><router-link to="/" active-class="active" exact>首頁</router-link></li>
        <li><router-link to="/records" active-class="active">刷卡紀錄</router-link></li>
        <li><router-link to="/visitor" active-class="active">訪客登記</router-link></li>
        <li><router-link to="/query" active-class="active">查詢紀錄</router-link></li>
        <li class="user-area">
          <span
            v-if="auth.isLoggedIn"
            class="user-tag"
            @click="handleUserClick"
            title="點一下查看個人識別證，再次點擊可登出"
          >
            <span class="led go"></span>{{ auth.userName }}
          </span>
          <router-link v-else to="/login" class="login-link">登入</router-link>
        </li>
      </ul>
    </nav>
  </header>

  <!-- 登出確認對話框 -->
  <div v-if="showLogoutConfirm" class="modal-overlay" @click.self="showLogoutConfirm = false">
    <div class="modal-box panel">
      <p>要登出「{{ auth.userName }}」的識別證嗎？</p>
      <div class="modal-actions">
        <button class="btn btn-danger" @click="confirmLogout">登出</button>
        <button class="btn btn-ghost" @click="showLogoutConfirm = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
const router = useRouter()
const showLogoutConfirm = ref(false)
let firstClick = true
let clickTimer = null

function handleUserClick() {
  if (firstClick) {
    firstClick = false
    router.push('/profile')
    clearTimeout(clickTimer)
    clickTimer = setTimeout(() => { firstClick = true }, 3000)
  } else {
    showLogoutConfirm.value = true
  }
}

function confirmLogout() {
  auth.logout()
  showLogoutConfirm.value = false
  router.push('/login')
}
</script>

<style scoped>
.rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--ink-2);
  border-bottom: 1px solid var(--panel-edge);
  padding: 14px 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.chip-sm {
  width: 22px;
  height: 17px;
  border-radius: 3px;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #f2eee3;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--mist);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92rem;
  transition: color 0.2s ease, border-color 0.2s ease;
  padding: 8px 12px;
  border-bottom: 2px solid transparent;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--brass-hi);
  border-bottom-color: var(--brass);
}

.user-area {
  margin-left: 14px;
  display: flex;
  align-items: center;
  min-width: 110px;
  justify-content: flex-end;
}

.user-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f2eee3;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.86rem;
  cursor: pointer;
  padding: 6px 12px;
  border: 1px solid var(--panel-edge);
  border-radius: 20px;
  transition: border-color 0.2s ease;
  white-space: nowrap;
}

.user-tag:hover {
  border-color: var(--brass);
}

.login-link {
  color: var(--card);
  background: var(--panel-hi);
  border: 1px solid var(--panel-edge);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 20px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.login-link:hover {
  border-color: var(--brass);
  color: var(--brass-hi);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 13, 17, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-box {
  padding: 30px 36px;
  text-align: center;
  min-width: 280px;
}

.modal-box p {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #f2eee3;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 640px) {
  .rail { flex-wrap: wrap; gap: 12px; padding: 12px 16px; }
  .nav-links { flex-wrap: wrap; gap: 2px; }
}
</style>

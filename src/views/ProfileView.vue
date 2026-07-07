<template>
  <header class="profile-header">
    <span class="header-title">個人識別證</span>
    <nav class="header-nav">
      <button class="btn btn-ghost" @click="router.push('/')">返回首頁</button>
      <button class="btn btn-danger" @click="handleLogout">登出</button>
    </nav>
  </header>

  <main class="container fade-in">
    <section class="card-surface id-card">
      <div class="id-card-top">
        <span class="chip"></span>
        <span class="eyebrow-dark">STAFF ID</span>
      </div>

      <div class="avatar-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="avatar">
          <circle cx="50" cy="50" r="50" fill="#e4dcc4" />
          <circle cx="50" cy="38" r="18" fill="#b8934b" opacity="0.75" />
          <ellipse cx="50" cy="80" rx="28" ry="18" fill="#b8934b" opacity="0.55" />
        </svg>
      </div>

      <h2>{{ userData.name || '未登入' }}</h2>

      <div class="info-list">
        <div class="info-item">
          <span class="info-label">信箱</span>
          <span class="info-value">{{ userData.email || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">角色</span>
          <span class="info-value">{{ userData.role || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">上次刷卡</span>
          <span class="info-value">{{ userData.lastLogin || '—' }}</span>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-ghost" @click="editProfile">修改資料</button>
        <button class="btn btn-ghost" @click="changePassword">修改密碼</button>
      </div>
    </section>
  </main>

  <!-- 登出確認對話框 -->
  <div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm = false">
    <div class="modal-box panel">
      <p>確定要登出嗎？</p>
      <div class="modal-actions">
        <button class="btn btn-danger" @click="confirmLogout">確認</button>
        <button class="btn btn-ghost" @click="showConfirm = false">取消</button>
      </div>
    </div>
  </div>

  <footer>
    <p>© 2025 truman3309 | IoT Access Control System</p>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const auth = useAuthStore()
const showConfirm = ref(false)

const userData = computed(() => ({
  name: auth.userName,
  email: auth.userName ? `${auth.userName.toLowerCase()}@example.com` : '',
  role: auth.userName ? '管理員' : '',
  lastLogin: auth.lastLogin,
}))

function handleLogout() {
  showConfirm.value = true
}

function confirmLogout() {
  auth.logout()
  showConfirm.value = false
  router.push('/login')
}

function editProfile() {
  alert('修改資料功能尚未開放！')
}

function changePassword() {
  alert('修改密碼功能尚未開放！')
}
</script>

<style scoped>
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 28px;
  background-color: var(--ink-2);
  border-bottom: 1px solid var(--panel-edge);
}

.header-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #f2eee3;
}

.header-nav { display: flex; gap: 10px; }

.container {
  max-width: 460px;
  margin: 48px auto;
  padding: 0 20px;
}

.id-card {
  padding: 34px 32px;
  text-align: center;
}

.id-card-top {
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

.avatar-wrapper { margin-bottom: 16px; }
.avatar { width: 84px; height: 84px; border-radius: 50%; }

h2 {
  font-size: 1.35rem;
  color: var(--card-ink);
  margin-bottom: 22px;
}

.info-list {
  text-align: left;
  margin-bottom: 24px;
  border-top: 1px solid var(--card-edge);
  padding-top: 14px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 9px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.info-label { font-weight: 600; color: var(--card-ink-soft); }
.info-value { color: var(--card-ink); }

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
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
  padding: 30px 40px;
  text-align: center;
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
</style>

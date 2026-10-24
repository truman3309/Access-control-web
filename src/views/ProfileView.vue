<template>
  <header class="profile-bar">
    <span class="header-title">個人識別證</span>
    <nav class="header-nav">
      <button class="btn btn-ghost" @click="router.push('/')">返回首頁</button>
      <button class="btn btn-danger" @click="handleLogout">登出</button>
    </nav>
  </header>

  <main class="page page-sm fade-in">
    <section class="panel id-card">
      <div class="avatar" aria-hidden="true">{{ (userData.name || '?').slice(0, 1).toUpperCase() }}</div>

      <p class="eyebrow">Staff ID</p>
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
  <div v-if="showConfirm" class="modal-overlay" role="dialog" aria-modal="true" @click.self="showConfirm = false">
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
.profile-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 28px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background: var(--glass);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 var(--glass-hi);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
}
.header-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}
.header-nav { display: flex; gap: 10px; }
.header-nav .btn { padding: 8px 18px; font-size: 0.88rem; }

.id-card {
  padding: 36px 32px;
  text-align: center;
}

.avatar {
  width: 88px;
  height: 88px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 2.2rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(145deg, #64b5ff, #0a84ff);
  box-shadow: 0 10px 28px rgba(10, 132, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.id-card h2 {
  font-size: 1.5rem;
  margin: 2px 0 24px;
}

/* 像 iOS 設定頁的分組列表 */
.info-list {
  text-align: left;
  margin-bottom: 24px;
  background: var(--field);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 2px 18px;
}
.info-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 0;
  border-bottom: 1px solid var(--hairline);
  font-size: 0.92rem;
}
.info-item:last-child { border-bottom: none; }
.info-label { color: var(--text-3); font-weight: 500; flex-shrink: 0; }
.info-value { color: var(--text); text-align: right; word-break: break-all; }

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .profile-bar { padding-left: 16px; padding-right: 16px; }
  .id-card { padding: 30px 20px; }
}
</style>

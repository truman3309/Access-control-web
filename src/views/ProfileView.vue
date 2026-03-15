<template>
  <header class="profile-header">
    <h1>個人基本資料</h1>
    <nav class="header-nav">
      <button @click="router.push('/')">返回首頁</button>
      <button class="btn-logout" @click="handleLogout">登出</button>
    </nav>
  </header>

  <main class="container fade-in">
    <section class="profile-card">
      <!-- 使用者頭像（SVG 預設圖示） -->
      <div class="avatar-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="avatar">
          <circle cx="50" cy="50" r="50" fill="#e0eaff" />
          <circle cx="50" cy="38" r="18" fill="#007bff" opacity="0.7" />
          <ellipse cx="50" cy="80" rx="28" ry="18" fill="#007bff" opacity="0.5" />
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
          <span class="info-label">上次登入</span>
          <span class="info-value">{{ userData.lastLogin || '—' }}</span>
        </div>
      </div>

      <div class="actions">
        <button @click="editProfile">修改資料</button>
        <button @click="changePassword">修改密碼</button>
      </div>
    </section>
  </main>

  <!-- 登出確認對話框 -->
  <div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm = false">
    <div class="modal-box">
      <p>確定要登出嗎？</p>
      <div class="modal-actions">
        <button class="btn-confirm" @click="confirmLogout">確認</button>
        <button class="btn-cancel" @click="showConfirm = false">取消</button>
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
  padding: 15px 28px;
  background-color: #0056b3;
  color: white;
}

.profile-header h1 {
  font-size: 1.3rem;
  font-weight: bold;
}

.header-nav {
  display: flex;
  gap: 10px;
}

.header-nav button {
  padding: 8px 18px;
  background-color: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.header-nav button:hover {
  background-color: rgba(255,255,255,0.3);
}

.btn-logout {
  background-color: rgba(220,53,69,0.4) !important;
  border-color: rgba(220,53,69,0.6) !important;
}

.btn-logout:hover {
  background-color: rgba(220,53,69,0.7) !important;
}

.container {
  max-width: 500px;
  margin: 40px auto;
  padding: 0 20px;
}

.profile-card {
  background: #fff;
  border-radius: 14px;
  padding: 36px 32px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.avatar-wrapper {
  margin-bottom: 16px;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
}

h2 {
  font-size: 1.4rem;
  color: #0056b3;
  margin-bottom: 24px;
}

.info-list {
  text-align: left;
  margin-bottom: 24px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  font-weight: 600;
  color: #555;
  min-width: 90px;
}

.info-value {
  color: #333;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.actions button {
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s;
}

.actions button:hover {
  background-color: #0056b3;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  border-radius: 12px;
  padding: 30px 40px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.modal-box p {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #333;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-confirm {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-confirm:hover {
  background-color: #c82333;
}

.btn-cancel {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-cancel:hover {
  background-color: #5a6268;
}
</style>

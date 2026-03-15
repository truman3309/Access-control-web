<template>
  <header class="navbar">
    <h1 class="logo">Access Control</h1>
    <nav>
      <ul class="nav-links">
        <li><router-link to="/" active-class="active" exact>首頁</router-link></li>
        <li><router-link to="/records" active-class="active">刷卡紀錄</router-link></li>
        <li><router-link to="/visitor" active-class="active">訪客登記</router-link></li>
        <li><router-link to="/query" active-class="active">查詢紀錄</router-link></li>
        <li class="user-area">
          <!-- 已登入 -->
          <span
            v-if="auth.isLoggedIn"
            class="user-name"
            @click="handleUserClick"
            title="點一下查看個人資料，再次點擊可登出"
          >
            {{ auth.userName }}
          </span>
          <!-- 未登入 -->
          <router-link v-else to="/LoginView.vue" class="login-link">登入</router-link>
        </li>
      </ul>
    </nav>
  </header>

  <!-- 登出確認對話框 -->
  <div v-if="showLogoutConfirm" class="modal-overlay" @click.self="showLogoutConfirm = false">
    <div class="modal-box">
      <p>是否要登出帳號「{{ auth.userName }}」？</p>
      <div class="modal-actions">
        <button class="btn-confirm" @click="confirmLogout">確認登出</button>
        <button class="btn-cancel" @click="showLogoutConfirm = false">取消</button>
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
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0056b3;
  color: #fff;
  padding: 12px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.logo {
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  letter-spacing: 0.5px;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  padding: 6px 10px;
  border-radius: 4px;
}

.nav-links a:hover,
.nav-links a.active {
  color: #ffdf5d;
}

.user-area {
  margin-left: 20px;
  display: flex;
  align-items: center;
  min-width: 120px;
  justify-content: flex-end;
}

.user-name {
  color: #ffdf5d;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.user-name:hover {
  color: #fff;
}

.login-link {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #ffdf5d;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  min-width: 280px;
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

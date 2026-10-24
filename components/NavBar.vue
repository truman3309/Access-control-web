<template>
  <header class="topbar">
    <router-link to="/" class="brand">
      <span class="app-icon sm" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </span>
      <span class="brand-text">門禁系統</span>
    </router-link>

    <nav class="nav" aria-label="主選單">
      <router-link to="/" class="nav-link" exact-active-class="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>首頁</span>
      </router-link>
      <router-link to="/records" class="nav-link" active-class="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        <span>刷卡紀錄</span>
      </router-link>
      <router-link to="/visitor" class="nav-link" active-class="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        <span>訪客登記</span>
      </router-link>
      <router-link to="/query" class="nav-link" active-class="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>查詢紀錄</span>
      </router-link>
    </nav>

    <div class="user-area">
      <span
        v-if="auth.isLoggedIn"
        class="user-tag"
        role="button"
        tabindex="0"
        @click="handleUserClick"
        @keydown.enter="handleUserClick"
        title="點一下查看個人識別證，再次點擊可登出"
      >
        <span class="led go"></span>{{ auth.userName }}
      </span>
      <router-link v-else to="/login" class="login-link">登入</router-link>
    </div>
  </header>

  <!-- 登出確認對話框 -->
  <div v-if="showLogoutConfirm" class="modal-overlay" role="dialog" aria-modal="true" @click.self="showLogoutConfirm = false">
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
/* 頂部列：玻璃底放在 ::before，這樣手機版的浮動分頁列
   (position: fixed) 才不會被 backdrop-filter 困在頂部列裡 */
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 12px 28px;
  border-bottom: 1px solid var(--glass-border);
}
.topbar::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--glass);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 var(--glass-hi);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  justify-self: start;
}
.brand-text {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.nav {
  display: flex;
  gap: 2px;
  padding: 4px;
  background: var(--field);
  border: 1px solid var(--glass-border);
  border-radius: 980px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 16px;
  border-radius: 980px;
  color: var(--text);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.nav-link svg { width: 16px; height: 16px; flex-shrink: 0; }
.nav-link:hover { color: var(--blue); }
.nav-link.active {
  background: var(--glass-solid);
  color: var(--text);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 var(--glass-hi);
}

.user-area {
  justify-self: end;
  display: flex;
  align-items: center;
  min-width: 0;
}
.user-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  padding: 7px 14px;
  background: var(--field);
  border: 1px solid var(--glass-border);
  border-radius: 980px;
  transition: background 0.2s ease;
}
.user-tag:hover { background: var(--field-hover); }

.login-link {
  color: #fff;
  background: var(--blue-solid);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 980px;
  box-shadow: 0 4px 14px rgba(10, 132, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: background 0.2s ease;
}
.login-link:hover { background: var(--blue-hover); }

/* 手機版：頂部只留品牌與使用者，主選單變成底部浮動分頁列（像 iOS） */
@media (max-width: 720px) {
  .topbar {
    grid-template-columns: 1fr auto;
    padding: 10px 16px;
    padding-top: calc(10px + env(safe-area-inset-top));
  }
  .nav {
    position: fixed;
    z-index: 60;
    left: 12px;
    right: 12px;
    bottom: calc(10px + env(safe-area-inset-bottom));
    justify-content: space-around;
    gap: 0;
    padding: 6px;
    border-radius: 26px;
    background: var(--glass-solid);
    -webkit-backdrop-filter: var(--blur);
    backdrop-filter: var(--blur);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 var(--glass-hi);
  }
  .nav-link {
    flex: 1;
    flex-direction: column;
    gap: 3px;
    padding: 8px 2px;
    font-size: 0.7rem;
    border-radius: 20px;
  }
  .nav-link svg { width: 22px; height: 22px; }
  .nav-link.active {
    background: var(--blue-tint);
    color: var(--blue);
    box-shadow: none;
  }
}
</style>

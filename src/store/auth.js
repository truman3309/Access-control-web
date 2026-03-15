import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userName = ref(localStorage.getItem('userName') || '')
  const lastLogin = ref(localStorage.getItem('lastLogin') || '')

  const isLoggedIn = computed(() => !!userName.value)

  function login(username) {
    const now = new Date()
    const formattedTime = now.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    userName.value = username
    lastLogin.value = formattedTime
    localStorage.setItem('userName', username)
    localStorage.setItem('lastLogin', formattedTime)
  }

  function logout() {
    userName.value = ''
    lastLogin.value = ''
    localStorage.removeItem('userName')
    localStorage.removeItem('lastLogin')
  }

  return { userName, lastLogin, isLoggedIn, login, logout }
})

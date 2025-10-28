// === login.js ===

// 初始化登入頁面
function initLoginPage() {
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault(); // 防止預設表單提交
        handleLogin();
      });
    }
  });
}

// 登入處理邏輯
async function handleLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // 簡單前端驗證
  if (!username || !password) {
    showAlert('請輸入帳號與密碼');
    return;
  }

  try {
    // 向後端發送登入請求
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    // 處理回應
    const data = await response.json();

    if (response.ok && data.success) {
      showAlert('✅ 登入成功，正在導向首頁...');
      // 2 秒後導向首頁
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      showAlert(`❌ 登入失敗：${data.message || '帳號或密碼錯誤'}`);
    }
  } catch (error) {
    console.error('登入錯誤:', error);
    showAlert('⚠️ 無法連接伺服器，請稍後再試');
  }
}

// 顯示訊息（彈出提示框）
function showAlert(message) {
  alert(message);
}

// 啟動登入頁面
initLoginPage();

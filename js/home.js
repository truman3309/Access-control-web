// === main.js ===

// ============================
// 基本設定
// ============================
const API_BASE_URL = "http://localhost:3000"; // 伺服器端點
let intervalId = null; // 用來儲存 setInterval 的 ID


// ============================
// 初始化頁面
// ============================
function initPage() {
  // 頁面載入完成後執行
  document.addEventListener('DOMContentLoaded', function () {
    showPage('home'); // 預設顯示首頁
    bindNavButtons(); // 綁定導覽列按鈕事件
  });
}


// ============================
// 綁定導覽列按鈕事件
// ============================
function bindNavButtons() {
  const navButtons = document.querySelectorAll('nav button');
  navButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetId = this.id.replace('-btn', '');
      if (['home', 'features', 'about'].includes(targetId)) {
        showPage(targetId);
      }
    });
  });
}


// ============================
// 顯示指定的頁面
// ============================
function showPage(page) {
  const pages = ['home', 'features', 'about'];

  // 隱藏所有頁面並取消 active 樣式
  pages.forEach(p => {
    const content = document.getElementById(p);
    const button = document.getElementById(`${p}-btn`);
    if (content) content.classList.add('hidden');
    if (button) button.classList.remove('active');
  });

  // 顯示被選中的頁面並加上 active 樣式
  const selectedContent = document.getElementById(page);
  const selectedButton = document.getElementById(`${page}-btn`);
  if (selectedContent) selectedContent.classList.remove('hidden');
  if (selectedButton) selectedButton.classList.add('active');

  // 清除前一次自動更新
  stopAutoUpdate();

  // 若是刷卡顯示頁面，啟動自動更新 UID
  if (page === 'features') {
    startAutoUpdate();
  }
}


// ============================
// 啟動自動更新 UID
// ============================
function startAutoUpdate() {
  updateLastUID(); // 立即執行一次
  intervalId = setInterval(updateLastUID, 2000); // 每 2 秒自動更新
}


// ============================
// 停止自動更新 UID
// ============================
function stopAutoUpdate() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}


// ============================
// 從伺服器取得最後 UID
// ============================
async function updateLastUID() {
  const uidElement = document.getElementById('last-uid');
  if (!uidElement) return;

  uidElement.innerText = '讀取中...';

  try {
    const response = await fetch(`${API_BASE_URL}/get-last-uid`);
    if (!response.ok) {
      handleFetchError(response.status);
      return;
    }

    const data = await response.json();
    displayUID(data.uid || '無記錄');
  } catch (error) {
    handleConnectionError(error);
  }
}


// ============================
// 顯示 UID
// ============================
function displayUID(uidText) {
  const uidElement = document.getElementById('last-uid');
  if (uidElement) uidElement.innerText = uidText;
}


// ============================
// 錯誤處理：伺服器錯誤
// ============================
function handleFetchError(statusCode) {
  console.error(`伺服器回應錯誤: ${statusCode}`);
  displayUID('無法讀取 UID');
  stopAutoUpdate();
}


// ============================
// 錯誤處理：連線失敗
// ============================
function handleConnectionError(error) {
  console.error('❌ 無法連接伺服器:', error);
  displayUID('無法連接伺服器');
  stopAutoUpdate();
}


// ============================
// 啟動整體流程
// ============================
initPage();

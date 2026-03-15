# 門禁管理系統 - Vue 3 版本

原始專案（原生 HTML/CSS/JS）已轉換為 **Vue 3 + Vite + Pinia + Vue Router** 架構。

## 專案結構

```
src/
├── main.js                 # 應用程式進入點
├── App.vue                 # 根元件
├── assets/
│   └── global.css          # 全域樣式
├── store/
│   └── auth.js             # Pinia 狀態管理（登入/登出）
├── router/
│   └── index.js            # Vue Router 路由設定
├── components/
│   └── NavBar.vue          # 共用導覽列元件
└── views/
    ├── HomeView.vue         # 首頁（主頁.html）
    ├── LoginView.vue        # 登入頁（登入.html）
    ├── RegisterView.vue     # 註冊頁（註冊.html）
    ├── RecordsView.vue      # 刷卡紀錄（刷卡紀錄.html）
    ├── VisitorView.vue      # 訪客登記（訪客登記.html）
    ├── QueryView.vue        # 查詢紀錄（查詢.html）
    └── ProfileView.vue      # 個人資料（個人基本資料.html）
```

## 轉換對照

| 原始檔案           | Vue 元件            |
|--------------------|---------------------|
| 主頁.html          | HomeView.vue        |
| 登入.html          | LoginView.vue       |
| 註冊.html          | RegisterView.vue    |
| 刷卡紀錄.html      | RecordsView.vue     |
| 訪客登記.html      | VisitorView.vue     |
| 查詢.html          | QueryView.vue       |
| 個人基本資料.html  | ProfileView.vue     |
| 導覽列（各頁重複） | NavBar.vue（共用）  |
| localStorage 邏輯  | Pinia auth store    |

## 技術改進

- **Vue 3 Composition API**（`<script setup>`）
- **Pinia** 集中管理登入狀態，取代各頁面重複的 `localStorage` 操作
- **Vue Router** 管理頁面導航，取代 `window.location.href`
- **NavBar.vue** 抽為共用元件，避免重複貼上 HTML
- 登出改用模態對話框取代 `confirm()`
- `v-model` 雙向綁定表單
- `computed` 自動計算過濾結果

## 安裝與啟動

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置生產版本
npm run build
```

開發模式預設於 `http://localhost:5173`

## 模擬帳號

- 帳號：`admin`
- 密碼：`1234`

> 後端 API URL 請修改 `src/views/` 各元件中的 `API_BASE_URL` 變數。

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

# 複製環境變數範本，填入 Vercel MongoDB 整合提供的連線字串
cp .env.example .env

# 開發模式
npm run dev

# 建置生產版本
npm run build
```

開發模式預設於 `http://localhost:5173`

## 後端與資料庫

`/api` 資料夾是 Vercel Serverless Functions，透過 `mongodb` 官方驅動連接資料庫（連線設定在 `api/_lib/mongodb.js`，已接上 `@vercel/functions` 的 `attachDatabasePool`）。

部署到 Vercel 前，先在專案的 Marketplace 裡連接 MongoDB 整合，它會自動注入連線字串環境變數；本機開發則手動填進 `.env`（範本見 `.env.example`）。

| 端點 | 方法 | 用途 |
|---|---|---|
| `/api/register` | POST | 建立帳號（密碼以 bcrypt 雜湊存放） |
| `/api/login` | POST | 驗證帳密 |
| `/api/register-visitor` | POST | 訪客登記 |
| `/api/access-records` | GET / POST | 撈取 / 寫入刷卡紀錄 |

沒有預設帳號——第一次使用請先到「註冊識別證」頁面建立帳號，再用該帳密登入。

## 上傳到 GitHub 前

`.gitignore` 已經排除 `node_modules/`、`dist/` 和 `.env`。上傳前務必確認：
- 沒有把填了真實連線字串的 `.env` 加進版本控制
- 如果不小心 commit 過金鑰，記得回 MongoDB Atlas 撤銷並重新產生一組

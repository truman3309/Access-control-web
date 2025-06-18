
---

## ☁️ 雲端整合說明

本系統透過 Google Apps Script 建立 Web App，將刷卡資料以 HTTP GET 或 POST 請求方式傳送至 Google 試算表。Apps Script 接收到資料後，自動寫入指定試算表的行列中，實現即時雲端同步，無需額外的第三方服務或付費平台。

---

## 📦 安裝與部署

1. **硬體接線**
   - RFID 模組與 ESP32 使用 SPI 介面
   - OLED 使用 I2C（SCL/SDA）
   - SD 卡模組與 RFID 共用 SPI，但需指定不同 CS 腳位

2. **Arduino IDE 設定**
   - 板子選擇：`ESP32 Dev Module`
   - 上傳速率：115200
   - 安裝所需函式庫

3. **設定 Google Apps Script**
   - 建立新試算表
   - 進入 Apps Script 編輯器，貼上 Web App 程式碼
   - 部署為 Web App 並取得 URL
   - 將該 URL 填入 Arduino 程式中

4. **網頁伺服器**
   - 程式內建簡易網頁伺服器，透過內網 IP 存取
   - 預設顯示最近刷卡記錄

---

## 📄 資料儲存格式

- **SD 卡**：CSV 檔，每筆資料為 `卡號,時間戳記`
- **Google Sheet**：欄位為 UID、時間、來源裝置等
- **網頁介面**：顯示最近刷卡 10 筆記錄（可修改）

---

## 🧪 適用場景

- 學校學生點名與考勤記錄  
- 小型公司門禁感應與刷卡報表  
- 活動簽到、會員打卡  
- 原型產品開發與物聯網研究  

---

## 📌 未來擴充方向

- ✅ 支援多語言顯示與本地化
- ✅ 串接 LINE Notify 或 Telegram Bot 推播
- ✅ 支援 OTA 更新與遠端維護
- ✅ 結合 Google Drive 備份整合

---



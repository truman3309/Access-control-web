# 📦 安裝與部署指南

為確保系統能穩定運行，請依照以下步驟完成硬體接線、軟體設定與資料庫部署。

---

## 1️⃣ 硬體接線

本系統的核心為 **ESP32 微控制器**，整合以下三種主要周邊模組：

### 🔹 RFID 讀取模組（MFRC-522 RC522）

- 通訊介面：SPI  
- 功能：讀取卡片 UID  
- 建議接腳：
  - SDA → GPIO 5  
  - SCK → GPIO 18  
  - MOSI → GPIO 23  
  - MISO → GPIO 19  
  - RST → GPIO 22  
- ⚠️ **注意：** 若與 SD 模組共用 SPI，請指定不同 CS 腳位。

---

### 🔹 OLED 顯示模組（SSD1306）

- 通訊介面：I2C (SCL/SDA)  
- 功能：顯示刷卡狀態與連線資訊  
- 建議接腳：
  - SDA → GPIO 21  
  - SCL → GPIO 22

---

### 🔹 SD 卡模組

- 通訊介面：SPI  
- 用途：本地暫存與資料備份  
- 建議：
  - 使用獨立 CS 腳位  
  - 避免與 RFID 模組共用相同引腳

---

## 2️⃣ Arduino IDE 環境設定

請依以下步驟設定開發環境：

1. 開啟 Arduino IDE  
2. **板子選擇：** `ESP32 NODEMCU-32S`  
3. **上傳速率：** `115200 bps`  
4. **安裝必要函式庫：**
   - `MFRC522`（RFID 模組控制）
   - `Adafruit SSD1306` 或 `U8g2`（OLED 顯示）
   - `SD`（SD 卡操作）
   - `WiFi`（ESP32 網路連線）
   - `HTTPClient`（HTTP 請求）

> ✅ 建議：安裝完成後可上傳範例程式以測試模組連線。

---

## 3️⃣ MySQL 資料庫

系統使用 **MySQL** 作為主要資料儲存中心，負責保存刷卡紀錄與訪客資料。

### 📋 資料表設計範例

```sql
CREATE TABLE access_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(50) NOT NULL,
  visitor_name VARCHAR(100),
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(20) DEFAULT '刷卡',
  status VARCHAR(20) DEFAULT '正常'
);

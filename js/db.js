// db.js
// === MySQL 資料庫連線與測試 ===

// 引入 mysql2 套件
const mysql = require("mysql2");

// 建立資料庫連線設定
const connection = mysql.createConnection({
    host: 'localhost',      // 資料庫主機
    user: 'root',           // 使用者名稱
    password: '!QAZ2wsx', // 資料庫密碼
    database: 'my_database',      // 資料庫名稱
    charset: 'utf8mb4'      // 使用 UTF-8 MB4 字元集（支援 emoji）
});

// 測試連線
connection.connect((err) => {
    if (err) {
        console.error('❌ 資料庫連線失敗:', err.message);
        return;
    }
    console.log('✅ 成功連線至 MySQL 資料庫');
});

// 範例 1：查詢所有資料
connection.execute('SELECT * FROM postinfo', (error, results) => {
    if (error) {
        console.error('❌ 查詢錯誤:', error.message);
        return;
    }
    console.log('📄 查詢結果:', results);
});

// 範例 2：新增一筆測試資料
const post = {
    id: 1,
    uid: 'test',
    name: '王小明',
    datetime: '2025-10-31'
};

connection.execute(
    'INSERT INTO postinfo (id, title, content, author, post_date) VALUES (?, ?, ?, ?, ?)',
    [post.id, post.title, post.content, post.author, post.post_date],
    (error, results) => {
        if (error) {
            console.error('❌ 新增資料錯誤:', error.message);
            return;
        }
        console.log('✅ 成功新增資料:', results);
    }
);

// 結束後關閉連線
setTimeout(() => {
    connection.end();
    console.log('🔌 已關閉資料庫連線');
}, 2000);

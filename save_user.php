<?php
// ==== 資料庫連線設定 ====
$servername = "localhost";   // 資料庫主機
$username_db = "root";       // 資料庫帳號
$password_db = "";           // 資料庫密碼
$dbname = "test_db";         // 資料庫名稱

// 建立連線
$conn = new mysqli($servername, $username_db, $password_db, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "連線失敗"]));
}

/**
 * 儲存使用者帳號密碼到資料庫
 */
function saveUser($conn, $username, $password) {
    // 密碼加密
    $pass_hashed = password_hash($password, PASSWORD_DEFAULT);

    // SQL 插入語法
    $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $pass_hashed);

    if ($stmt->execute()) {
        $result = ["status" => "success", "message" => "帳號建立成功！"];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    return $result;
}

// 接收資料
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = $_POST['username'] ?? '';
    $pass = $_POST['password'] ?? '';

    if ($user && $pass) {
        echo json_encode(saveUser($conn, $user, $pass), JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["status" => "error", "message" => "缺少帳號或密碼"], JSON_UNESCAPED_UNICODE);
    }
}

$conn->close();
?>

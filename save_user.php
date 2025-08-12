<?php
header('Content-Type: application/json; charset=UTF-8');

// 資料庫連線設定
$servername = "localhost";
$username_db = "root";
$password_db = "";
$dbname = "test_db";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "資料庫連線失敗"]);
    exit;
}

function saveUser($conn, $username, $password) {
    // 先檢查帳號是否已存在
    $check = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $check->bind_param("s", $username);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        return ["status" => "error", "message" => "帳號已存在"];
    }

    // 加密密碼
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    // 寫入資料庫
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hashed);
    if ($stmt->execute()) {
        return ["status" => "success", "message" => "註冊成功！"];
    } else {
        return ["status" => "error", "message" => "註冊失敗：" . $stmt->error];
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"] ?? '');
    $password = trim($_POST["password"] ?? '');

    if (!$username || !$password) {
        echo json_encode(["status" => "error", "message" => "請輸入帳號與密碼"]);
        exit;
    }

    echo json_encode(saveUser($conn, $username, $password));
}

$conn->close();
?>

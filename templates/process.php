<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../phpmailer/src/Exception.php';
require __DIR__ . '/../phpmailer/src/PHPMailer.php';
require __DIR__ . '/../phpmailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $comment = isset($_POST['comment']) ? htmlspecialchars($_POST['comment']) : '';

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'addankipavaniteja@gmail.com'; 
        $mail->Password = 'uswarjerrrpgjueo'; 
        $mail->Port = 587;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        $mail->setFrom('addankipavaniteja@gmail.com', 'Website Contact Form');
        $mail->addAddress('addankipavaniteja@gmail.com', 'Pavani Teja Addanki');

        $mail->isHTML(true);
        $mail->Subject = "📩 New Comment from $name";
        $mail->Body = "
            <h3>New Comment Received</h3>
            <p><b>Name:</b> {$name}</p>
            <p><b>Email:</b> {$email}</p>
            <p><b>Comment:</b><br>{$comment}</p>
        ";

        $mail->send();
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Mail Sent ✅</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #4cd375ff, #1b7d25ff);
                    font-family: 'Segoe UI', sans-serif;
                    color: #fff;
                    text-align: center;
                }
                .card {
                    background: rgba(0,0,0,0.4);
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                    animation: fadeIn 1s ease;
                }
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 15px;
                }
                p {
                    font-size: 1.2rem;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .emoji {
                    font-size: 3rem;
                    animation: bounce 1.5s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .btn {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #fff;
                    color: #333;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 1rem;
                    text-decoration: none;
                }
                .btn:hover {
                    background: #f1f1f1;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="emoji">📨🎉</div>
                <h1>Thank you, <?php echo $name; ?>!</h1>
                <p>We received your message and will get back to you soon.</p>
                <a href="home.html" class="btn">⬅ Back to Home Page</a>
            </div>
        </body>
        </html>
        <?php
    } catch (Exception $e) {
        echo "<p style='color:red; font-size:20px;'>❌ Comment could not be sent. Error: {$mail->ErrorInfo}</p>";
    }
}
?>

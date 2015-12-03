<?php
$to      = 'rnobeel@gmail.com';
$subject = 'the subject';
$message = 'hello';
$headers = 'From: accalls@server.accalls.com' . "\r\n" .
    'Reply-To: belanja@accalls.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);
?> 
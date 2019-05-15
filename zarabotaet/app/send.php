<?php
$field_email = 'gbezborodov@gmail.com'; // откуда будут слаться письма
$first_name = stripslashes($_POST['first_name']);
$tel = stripslashes($_POST['tel']);
$email = stripslashes($_POST['email']);
$mail_to = 'gbezborodov@gmail.com';
$subject = 'Заявка с сайта:';

$body_message = '
<html>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <body> 
        <p>
            Имя: '.$first_name.' <br>
			Телефон: '.$tel.' <br>
            Email: '.$email.' <br>
        </p>
    </body> 
</html>';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= 'From: '.$field_email."\r\n";
$headers .= 'Reply-To: '.$field_email."\r\n";

$mail_status=mail($mail_to, $subject, $body_message, $headers);
?>
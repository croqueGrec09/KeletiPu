<?php
if (file_exists('xpathExp_user.xml'))
	$userData = simplexml_load_file('xpathExp_user.xml');
else echo 'Die Benutzerkartei konnte nicht geladen werden!';

$user = $userData->xpath('//user[@name="'.$_GET["user"].'"]/descendant::*');
$user[0]->asXML();
?>
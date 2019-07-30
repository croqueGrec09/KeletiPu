<?php

include("User.php");
include("/construction_kit/Database.php");

$user = new User(2);
$db = new Database();
$user->getMailbox($db);

if(isset($_POST["test")){
	if(isset($_POST["stream_key"])){
		$key = $_POST["stream_key"];
	}
	else $key = "new";
	
}

?>
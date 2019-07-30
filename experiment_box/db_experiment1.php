<?php

include("/construction_kit/Database.php");

$db = new Database();
//$testQuery = "select * from profiles where name like ?";
$testQuery = "insert into profiles (name,id) values (?,?)";
//$testTypes = array("s");
$testTypes = array("si");
//$testParams = array("%".$_POST["what"]."%");
$testParams = array(&$_POST["what"],&$_POST["id"]);
$testResult = $db->query($testQuery,$testTypes,$testParams);
echo json_encode($testResult);

?>
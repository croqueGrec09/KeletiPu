<?php
include ('town_functions.php');
include ('user.php');
include ('user_functions.php');
include ('dialogue.php');
include ('happening_functions.php');
include ('karlstadt.php');

// Einlesen der Benutzerkartei und der Gegenstandskartei
$userData = loadUserDB();
$itemData = loadItemDB();

// Einlesen der Stadtparameter 
$city = null;
if (isset($_GET["city"])){
	$city = loadCity($_GET["city"]);
}

//Festlegen des derzeitigen Benutzers:
$user = null;
if (isset($_GET["user"]) && $_GET["user"] !== "null" && $_GET["user"] !== "none"){
	$user = $userData->document->getElementById($_GET["user"]);
}

// Start des Spiels nach Wahl der Sprache:
if (isset($_GET["initGame"])){
	$currentLang = $userData->xpath->query('/userData/user[@name="TestPerson"]')->item(0);
	$currentLang->setAttribute("userLang",$_GET["lang"]);
	$lang = $_GET["lang"];
	$number = 9995;
	$startupLangScreen = "startupScreenEnglish";
	switch($lang){
	case "de": $number = 9998;
	$startupLangScreen = "startupScreenGerman";
	break;
	case "fr": $number = 9996;
	$startupLangScreen = "startupScreenFrench";
	break;
	}
	//echo $currentLang->getElementsByTagName("place")->item(0)->nodeValue;
	$currentLang->getElementsByTagName("place")->item(0)->nodeValue = $startupLangScreen;
	$userData->save();
	$city = loadCity("zeidel");
	echo getNextPlaceData($city,$number,"intro".$lang,"none",$lang,"discoveryContent",$itemData);
}

// Bei Laden der Seite wird der derzeitige Standort des Benutzers abgefragt:	
if (isset($_GET["pageReload"]) && !is_null($user)){
	$savedLocation = $user->getElementsByTagName('currentPlace')->item(0);
	$currentLocation = array(
		"station" => $savedLocation->getElementsByTagName('number')->item(0)->nodeValue,
		"city" => $savedLocation->getElementsByTagName('town')->item(0)->nodeValue,
		"place" => $savedLocation->getElementsByTagName('place')->item(0)->nodeValue
	);
	echo json_encode($currentLocation);
}
else if(is_null($user) && isset($_GET["user"]) && $_GET["user"] !== "none"){
	echo "false";
}

//Ausgabe eines Formulars
//muss angepasst werden, falls mehrere Formulare auf einer Seite erscheinen sollen!
if (isset($_GET["form"])){
	seekForm($city,$_GET["form"],$_GET["lang"]);
}

//Besteigen einer Linie
if (isset($_GET["onLine"])){
	echo happening($_GET['happening_db'],$_GET['line'],$_GET['entry'],$_GET['lang']);
}

//Bewegung innerhalb einer Station
if (isset($_GET["newImage"])){
	if($_GET["user"] === "none")
		echo getNextPlaceData($city,$_GET["station"],$_GET["place"],"none",$_GET["lang"],$_GET["mode"],$itemData);
	else {
		$user = $userData->document->getElementById($_GET["user"]);
		echo getNextPlaceData($city,$_GET["station"],$_GET["place"],$user,$_GET["lang"],$_GET["mode"],$itemData);
		$currentPlace = $userData->xpath->query('/userData/user[@name="'.$_GET["user"].'"]/currentPlace')->item(0);
		$currentPlace->getElementsByTagName('town')->item(0)->nodeValue = $_GET["city"];
		$currentPlace->getElementsByTagName('number')->item(0)->nodeValue = $_GET["station"];
		$currentPlace->getElementsByTagName('place')->item(0)->nodeValue = $_GET["place"];
		$userData->save();
	}
}

//Benutzer-Hauptmenü
//Neuen Benutzer anlegen
if (isset($_GET["newAccount"])){
	$newUserData = json_decode($_GET["newUser"],true);
	$userExists = $userData->xpath->query('//user[@name="'.$newUserData["person"].'"]')->length;
	if ($userExists != 0){
		echo "false";
	}
	else if ($userExists == 0) {
		if(strpos($newUserData["loveInterests"],";") !== false)
			$loveInterests = explode(";",$newUserData["loveInterests"]);
		else $loveInterests = $newUserData["loveInterests"];
		if(strpos($newUserData["interests"],"-!-") !== false)
			$interests = explode("-!-",$newUserData["interests"]);
		else $interests = $newUserData["interests"];
		$newUser = new user($newUserData["person"],$newUserData["firstname"],$newUserData["lastname"],$newUserData["useName"],$loveInterests,$newUserData["loveSex"],$interests,$newUserData["lang"]);
		if(createNewAccount($newUser,$userData,$itemData)){
			$userData = loadUserDB();
			//Die Quittung für den Nutzer: seine Fahrkarte
			$ticket = array("itemId" => "ZVWticket",
							"found" => "true",
							"actionToEliminate" => "toTicketAutomat");
			addItem($userData,$newUser->name,$ticket);
			//var_dump($userData->document->getElementById($newUser->name));
			echo getNextPlaceData(loadCity($newUser->currentPlace["town"]),$newUser->currentPlace["number"],$newUser->currentPlace["place"],$userData->document->getElementById($newUser->name),$newUser->lang,"discoveryContent",$itemData);
		}
	}
}

// Hinzufügen eines Gegenstandes
if (isset($_GET["newItem"])){
	$itemData = json_decode($_GET["itemData"],true);
	echo addItem($userData,$_GET["user"],$itemData);
}

// Löschen eines Gegenstandes
if (isset($_GET["remove"])){
	echo removeItem($_GET["person"],$_GET["IDItemAffected"]);
}

// Änderung des Kontostandes
if (isset($_GET["manipulateCurrentMoney"])){
	echo modifyCurrentMoney($userData,$user,$_GET["amount"],$_GET["add"]);
}

// Ausgabe des Inventars
if (isset($_GET["showInventory"])){
	$currInventory = $user->getElementsByTagName('item');
	$inventory = array();
	foreach($currInventory as $item){
		$valid = "none";
		if($item->getAttribute("valid") === "true"){
			switch($_GET["lang"]) {
			case "de": $valid = "ja";
			break;
			case "hu": $valid = "igen";
			break;
			case "fr": $valid = "oui";
			break;
			case "en": $valid = "yes";
			break;
			}
		}
		else if($item->getAttribute("valid") === "false"){
			switch($_GET["lang"]) {
			case "de": $valid = "nein";
			break;
			case "hu": $valid = "nem";
			break;
			case "fr": $valid = "non";
			break;
			case "en": $valid = "no";
			break;
			}
		}
		$inventory[] = array("name" => $itemData->xpath->query('//item[@id="'.$item->getAttribute("id").'"]/name/'.$_GET["lang"])->item(0)->nodeValue,
							 "description" => $itemData->xpath->query('//item[@id="'.$item->getAttribute("id").'"]/description/'.$_GET["lang"])->item(0)->nodeValue,
							 "valid" => $valid);
	}
	echo json_encode($inventory);
}

//Dialogverwaltung
if (isset($_GET["dialogue"])){
	$dialogBase = new dialogueData($_GET["database"].".xml");
	$dialogData = $dialogBase->xpath->query('//person[@id="'.$_GET["character"].'"]/stream[@id="'.$_GET["stream"].'"]/point[@id="'.$_GET["point"].'"]/descendant-or-self::*')->item(0);
	$action = array();
	foreach($dialogData->getElementsByTagName("action") as $actionNode) {
		$commandNode = $actionNode->getElementsByTagName("command")->item(0);
		switch($commandNode->getAttribute("commandName")){
			case "dialogue": $commandData = "dialogue('".$_GET["database"]."','".$_GET["character"]."','".$_GET["stream"]."','".$commandNode->getAttribute("point")."')";
			break;
			case "exit": $commandData = "exitDialogue()";
			break;
			case "event": $commandData = "triggerHappening('".$commandNode->getAttribute("base")."','".$commandNode->getAttribute("event")."','".$commandNode->getAttribute("id")."',true)";
			break;
		}
		$action[$commandNode->getAttribute("commandName")] = array("response" => $actionNode->getElementsByTagName("response")->item(0)->nodeValue,
																   "command" => $commandData);
	}
	$reaction = array("answer" => $dialogData->getElementsByTagName("answer")->item(0)->nodeValue,
					  "action" => $action);
	echo json_encode($reaction);
}

// Abfrage, ob ein Gegenstand für eine Aktion vorhanden ist:	
if (isset($_GET["request"])){
	$hasItem = $userData->xpath->query('//user[@name="'.$_GET["user"].'"]/inventory/item[@id="'.$_GET["request"].'"]');
	if ($hasItem->length > 0)
		echo "true";
	else {
		$lang = $userData->xpath->query('//user[@name="'.$_GET["user"].'"]/@userLang')->item(0)->nodeValue;
		echo $itemData->xpath->query('/itemList/item[@id="'.$_GET["request"].'"]/name/'.$lang)->item(0)->nodeValue;
	}
}
?>
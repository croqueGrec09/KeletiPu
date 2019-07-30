<?php

$city = null;
$userData = null;

include 'xpathExp_functions.php';

if (isset($_GET["city"])){
	$path = "../analysyscities/".$_GET["city"].".xml";
	if (file_exists($path)){
		$city = simplexml_load_file($path);
	}
	else echo "Die Datei ".$path." konnte nicht gefunden werden!";
}

if (file_exists("xpathExp_user.xml")){
	$userData = simplexml_load_file("xpathExp_user.xml");
}
else echo "Die Datei xpathExp_user.xml konnte nicht gefunden werden!";

if (isset($_GET["query"])) {
	switch($_GET["query"]) {
	//Ausgabe von Gegenstandsdetails
	case "itemTest1": 
		$userBag = $userData->xpath('//userData/user[@name="'.$_GET["user"].'"]/inventory/item[@id="'.$_GET["itemId"].'"]');
		//print_r($userBag[0]->attributes()->id);
		echo "<br><br>".$userBag[0]->attributes()->id;
		break;
	//Hinzufügen neuer Gegenstände
	case "itemTest2":
		//$nextItem = new item($_GET["id"],$_GET["name"],$_GET["description"]);
		$countItem = count($userData->xpath('//userData/user[@name="'.$_GET["user"].'"]/inventory/item[@id="'.$_GET["id"].'"]'));
		if ($countItem != 0) {
			echo "Du hast den Gegenstand bereits!";		
		}
		else if (isset($_GET["bagNeeded"])) {
			$hasBag = count($userData->xpath('//userData/user[@name="'.$_GET["user"].'"]/inventory/item[@id="bag"]'));
			if (($_GET["bagNeeded"]) && ($hasBag != 0)){
				$userInventory = $userData->xpath('//userData/user[@name="'.$_GET["user"].'"]/inventory');
				addItem($userData,$userInventory,$_GET['id'],$_GET["name"],$_GET["description"]);			
			}
			else echo "Du brauchst einen Rucksack oder eine Tasche, um den Gegenstand aufzunehmen!";
		}
		else {
			$userInventory = $userData->xpath('//userData/user[@name="'.$_GET["user"].'"]/inventory');
			addItem($userData,$userInventory,$_GET['id'],$_GET["name"],$_GET["description"]);
		}
		break;
	//Test zur Ausgabe von nicht existenten Zweigen im XML-Baum
	case "itemTest3":
		$notExistingItem = $userData->xpath('//userData/user[@name="'.$_GET["user"].'"]/inventory/item[@id="surelyInexistant"]');
		//print_r($notExistingItem);
		echo count($notExistingItem);
		break;
	//Test zur Abfrage von benötigten Gegenständen
	case "actionTest1":
		$itemRequired = $city->xpath('//action[@name="'.$_GET["action"].'"]/@itemRequired');
		if (count($userData->xpath('//userData/user[@name="'.$_GET["user"].'"]/inventory/item[@id="'.$itemRequired[0].'"]')) != 0){
			echo "true";
		}
		else {
			$itemRequiredDetails = $city->xpath('//newItem[@id="'.$itemRequired[0].'"]');
			echo "Du besitzt folgenden Gegenstand nicht: ".$itemRequiredDetails[0]->name;
		}
		break;
	//Test zum Erinnerungsvermögen der Charaktere: bestimmte Aktionen nur einmal ausführen!
	case "actionTest2":
		
		break;
	}		
}
else var_dump($_GET);
?>
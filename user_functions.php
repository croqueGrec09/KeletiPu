<?PHP
include ('userDB.php');

// Benutzer
function loadUserDB() {
	if (file_exists('userData.xml')){
		return new userDB();
	}
	else if (!file_exists('userData.xml'))
		echo 'Die Benutzerdaten können nicht geladen werden!';
}

// Neues Benutzerkonto anlegen
function createNewAccount($user,$userData,$itemData) {
	//Neuer Benutzer: Wurzelknoten
	$newUser = $userData->document->createElement("user");
	$newUser->setAttribute("name",$user->name);
	$newUser->setAttribute("userLang",$user->lang);
	$newUser->setAttribute("useName",$user->useName);
	//Vornameknoten
	$newUserFirstName = $userData->document->createElement("firstname",$user->firstname);
	$newUser->appendChild($newUserFirstName);
	//Nachnameknoten
	$newUserLastName = $userData->document->createElement("lastname",$user->lastname);
	$newUser->appendChild($newUserLastName);
	//Der Knoten der großen Liebe
	$newUserLove = $userData->document->createElement("love");
	//Interessen derselben
	foreach($user->love["loveInterests"] as $loveInterest){
		$loveInterestNode = $userData->document->createElement("loveInterest",$loveInterest);
		$newUserLove->appendChild($loveInterestNode);
	}
	//Der Knoten des Geschlechts
	$newUserLoveSex = $userData->document->createElement("sex",$user->love["sex"]);
	$newUserLove->appendChild($newUserLoveSex);
	$newUser->appendChild($newUserLove);
	//Kontostand
	$newUser->appendChild($userData->document->createElement("currentMoney",$user->currentMoney));
	//Standort des Nutzers
	$newUserCurrentPlace = $userData->document->createElement("currentPlace");
	$newUserCurrentPlace->appendChild($userData->document->createElement("town",$user->currentPlace["town"]));
	$newUserCurrentPlace->appendChild($userData->document->createElement("number",$user->currentPlace["number"]));
	$newUserCurrentPlace->appendChild($userData->document->createElement("place",$user->currentPlace["place"]));
	$newUser->appendChild($newUserCurrentPlace);
	//Inventar, Kopie von der Testperson
	$testPersonInventory = $userData->xpath->query('//user[@name="TestPerson"]/inventory')->item(0);
	$newUserInventory = $testPersonInventory->cloneNode(true);
	$newUser->appendChild($newUserInventory);
	//Aktionsspeicher, Kopie von der Testperson
	$testPersonMemory = $userData->xpath->query('//user[@name="TestPerson"]/memory')->item(0);
	$newUserMemory = $testPersonMemory->cloneNode(true);
	$newUser->appendChild($newUserMemory);
	$userData->document->documentElement->appendChild($newUser);
	//Zurücksetzen des Testnutzers
	foreach($testPersonInventory->childNodes as $inventoryItem){
		if($inventoryItem->nodeType == 1 && $inventoryItem->getAttribute("id") != "bag")
			$testPersonInventory->removeChild($inventoryItem);
	}
	foreach($testPersonMemory->childNodes as $memory){
		if($memory->nodeType == 1){
			foreach($memory->childNodes as $memElement)
				$memory->removeChild($memElement);
		}
	}
	return $userData->save();
}


// Hinzufügen eines neuen Gegenstandes
function addItem($userData,$user,$itemData){
	$itemDB = loadItemDB();
	$itemParams = $itemDB->xpath->query('//item[@id="'.$itemData["itemId"].'"]/descendant-or-self::*')->item(0);
	$currUser = $userData->xpath->query('//userData/user[@name="'.$user.'"]/descendant-or-self::*')->item(0);
	//Gegenstand darf nur einmal im Inventar sein
	if($itemParams->getAttribute("countable") === "false"){
		$countItem = $userData->xpath->query('//userData/user[@name="'.$user.'"]/inventory/item[@id="'.$itemData["itemId"].'"]')->length;
		if ($countItem > 0) {
			return "Du hast den Gegenstand bereits!";		
		}
	}
	//käuflich zu erwerben
	if($itemData["found"] === "false"){
		$cost = $itemParams->getAttribute("cost");
		$currentMoney = $currUser->getElementsByTagName("currentMoney")->item(0)->nodeValue;
		if ($cost > $currentMoney) {
			return "Du hast ".$cost-$currentMoney." Z zu wenig!";
		}
		else $currentMoney-=$cost;
	}
	//Rucksack benötigt
	if($itemParams->getAttribute("bagNeeded") === "true") {
		$hasBag = count($userData->xpath->query('//userData/user[@name="'.$user.'"]/inventory/item[@id="bag"]'));
		if ($hasBag == 0){
			return "Du brauchst einen Rucksack oder eine Tasche, um den Gegenstand aufzunehmen!";
		}
	}
	$userInventory = $currUser->getElementsByTagName("inventory")->item(0);
	$newItem = $userData->document->createElement("item");
	$newItem->setAttribute("id",$itemData["itemId"]);
	$newItem->setAttribute("valid",$itemParams->getAttribute("valid"));
	$userInventory->appendChild($newItem);
	if(isset($itemData["actionToEliminate"]))
		eliminateAction($itemData["actionToEliminate"],$userData,$user);
	return $userData->save();
}

//Gegenstand entfernen
function removeItem($userData,$person,$id){
	unset($userData->xpath->query('//user[@name="'.$person.'"]/inventory/item[@id="'.$id.'"]')[0]->{0});
	if($userData->save() !== false)
		return "Gegenstand gelöscht.";
}

//Kontostand manipulieren
function modifyCurrentMoney($userData,$user,$amount,$add){
	$moneyNode = $user->getElementsByTagName("currentMoney")->item(0);
	if($add)
		$moneyNode->nodeValue += $amount;
	else if(!$add)
		$moneyNode->nodeValue -= $amount;
	return $userData->save();
}

//Aktion eintragen, auf dass sie nicht doppelt ausgeführt werden kann
function eliminateAction($action,$userData,$user){
	$userMemory = $userData->xpath->query('//user[@name="'.$user.'"]/memory/actionsPassed/descendant-or-self::*');
	if($userMemory->length > 0){
		foreach($userMemory as $memory){
			if($memory == $action)
				return;
		}
	}
	$newAction = $userData->document->createElement("action");
	$newAction->setAttribute('name',$action);
	$userMemory->item(0)->appendChild($newAction);
	return true;
}
?>
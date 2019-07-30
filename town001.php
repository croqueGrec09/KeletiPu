<?php
// Laden der Benutzerdaten sowie der Stadtkarteien:
if (file_exists('userData.xml')){
	$user = simplexml_load_file('userData.xml');
}
else if (file_exists('userData.xml') != true)
	echo 'Die Benutzerdaten können nicht geladen werden!';
	

// Bei Laden der Seite wird der derzeitige Standort des Benutzers abgefragt:	
if (isset($_GET["pageReload"])){
	$person = $_GET["person"];
	$savedLocation = $user->xpath('user[@name="'.$person.'"]/currentPlace/descendant::*');
	foreach ($savedLocation as $currPlace){
		echo $currPlace.'§';
	}
}
// Einlesen der Stadtparameter
if (isset($_GET["city"])){
	$city = $_GET["city"];

	if (file_exists($city.'.xml')){
		$currCity = simplexml_load_file($city.'.xml');
	}
	else if (file_exists($city.'.xml') != true){
		echo "Die Datei ".$city.".xml konnte nicht geladen werden!";
	}
// Ausgabe des nächsten Haltes - die "Reise"
	if (isset($_GET["onLine"])){
		$number = $_GET["number"];
		$currentStation = $_GET["currentStation"];
		$stationNumberGrowing = $_GET["stationNumberGrowing"];
		if ($stationNumberGrowing == true){
			$numOfCurrentStation = $currCity->xpath('//line[@number="'.$number.'"]/stations[.='.$currentStation.']/@numberInLine');
			foreach($numOfCurrentStation as $numOfNextStation){
				$numOfNextStation+=1;
				$index = $currCity->xpath('//line[@number="'.$number.'"]/stations[@numberInLine='.$numOfNextStation.']');
				foreach($index as $nextStation){
					echo $nextStation;
				}
			}
		}
		if ($stationNumberGrowing == false){
			$numOfCurrentStation = $currCity->xpath('//line[@number="'.$number.'"]/stations[.='.$currentStation.']/@numberInLine');
			foreach($numOfCurrentStation as $numOfNextStation){
				$numOfNextStation-=1;
				$index = $currCity->xpath('//line[@number="'.$number.'"]/stations[@numberInLine='.$numOfNextStation.']');
				foreach($index as $nextStation){
					echo $nextStation;
				}
			}
		}	
	}
}

//Prüfungsmodus
if (isset($_GET["exam"])){
	$number = $_GET["number"];
	$currentStation = $_GET["currentStation"];
	$stationNumberGrowing = $_GET["stationNumberGrowing"];
	$nextStationName = '';
	if (isset($_GET["city"])){
		$numOfCurrentStation = $currCity->xpath('//line[@number="'.$number.'"]/stations[.='.$currentStation.']/@numberInLine');
		foreach($numOfCurrentStation as $numOfNextStation){
			if ($stationNumberGrowing == true)
				$numOfNextStation+=1;
			else if ($stationNumberGrowing == false)
				$numOfNextStation-=1;
			$index = $currCity->xpath('//line[@number="'.$number.'"]/stations[@numberInLine='.$numOfNextStation.']');
			foreach($index as $stationNumber){
				$nextStationName = $currCity->xpath('//station[@number='.$stationNumber.']/name');
				$question = $currCity->xpath('//station[@number='.$stationNumber.']/examQuestions/question');
				$examples = $currCity->xpath('//station[@number='.$stationNumber.']/examQuestions/question/example');
				$hasExamples = $currCity->xpath('//station[@number='.$stationNumber.']/examQuestions/question/@hasExamples');
				$numOfFields = $currCity->xpath('//station[@number='.$stationNumber.']/examQuestions/question/@answerFields');
				echo $nextStationName[0].'§';
				echo "<form id='questions'>";
					for($i=0;$i<count($question);$i++){
						$flag = false;		
						echo '<h2 name="question">'.$question[$i].'</h2>';
						if($hasExamples[$i] == "true"){
							for($k=0;$k<count($examples);$k++){
								echo '<label for="q'.($i+1).'">- '.$examples[$k].'</label> </br>';
								echo '<input type="text" id="q'.($i+1).$k.'" /> </br>';
							}
							$flag = true;
						}
						if ($flag == false){
							for($j=0;$j<$numOfFields[$i];$j++)
								echo '<input type="text" name="q'.($i+1).'" /> </br>';
						}
					}
				}
			echo "<input type=\"button\" value=\"Fertig\" onclick=\"ready('$number','$nextStationName[0]','$stationNumberGrowing')\">"
			."<input type=\"reset\" value=\"Zurücksetzen\">";
		}
	}				
	if (isset($_GET["check"])){
		$responses = explode(',',$_GET["responses"]);
		$points = 0;
		foreach ($responses as $response){
			$token = explode(':',$response);
			$examinator = "swipl\bin\swipl.exe -f examinator.pl -g check($token[1],$currentStation,$token[0]),halt";
			var_dump($examinator);
			$output = shell_exec($examinator);
			$points += (int)$output;
		}
		echo $points;
	}
}

// Ausgabe der Bahnhöfe und Haltestellen - die "Ankunft"
	if (isset($_GET["newImage"])){
		$station = $_GET["station"];	
		$place = $_GET["place"];
		$part = $_GET["part"];
		if (isset($_GET["person"]) && $part != "item"){
			$person = $_GET["person"];
			$newCity = $user->xpath('user[@name="'.$person.'"]/currentPlace');
			foreach ($newCity as $input){
				$input->town = $_GET["city"];
			}
			$newStation = $user->xpath('user[@name="'.$person.'"]/currentPlace');
			foreach ($newStation as $input){
				$input->number = $_GET["station"];
			}
			$newPlace = $user->xpath('user[@name="'.$person.'"]/currentPlace');
			foreach ($newPlace as $input){
				$input->place = $_GET["place"];
			}
			$user->asXML('userData.xml');		
		}
		switch($part){
		case "name":
			$name = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/head1');
			foreach ($name as $response){
				echo $response;
			}
		break;
		case "text":
			$text = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/text');
			foreach ($text as $response){
				echo $response;
			}
		break;
		case "images":
			$sign = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/sign');
			$image = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/image');
			foreach (array_merge($sign,$image) as $images){
				echo $images.'§';
			}
		break;
		case "eye":
			$actionNumber = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/action');
			$action = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/action/descendant::*');
			echo count($actionNumber).'§';
			foreach ($action as $eye){
				echo $eye.'§';
			}
		break;
		case "item":	
			$person = $_GET["person"];
			$itemOnload = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/newItem/@onload');			
			$itemList = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/newItem/descendant::*');
			$itemID = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/newItem/@id');
			foreach ($itemID as $ID){
				$hasItem = @$user->xpath('//user[@name="'.$person.'"]/inventory/item[@id="'.$ID.'"]');
				if ($itemList == false || count($hasItem) != 0){
					echo 'No item acquired!';
				}
				else
					foreach (array_merge($itemOnload,$itemID,$itemList) as $item){
						echo $item.'§';
				}			
			}	
		break;
		case "sound":
			if (substr_count($place,"voyage") == 0){ 
				$sound = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/sound');
				if ($sound == false){
					echo 'No sound available!';
				}
				else foreach ($sound as $response){
					echo $response;
				}
			}
			else {
				$sound = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/sound');
				$onended = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/sound/@onended');
				$onplaying = $currCity->xpath('station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/sound/@onplaying');
				if ($sound == false){
					echo 'No sound available!';
				}
				else foreach (array_merge($sound,$onended,$onplaying) as $response){
					echo $response.'§';
				}
			}
		}	
	}
// Abfrage, ob eine Aktion einen Gegenstand erfordert und ob dieser Gegenstand vorhanden ist:	
	if (isset($_GET["action"])){
		$station = $_GET["station"];	
		$place = $_GET["place"];
		$action = $_GET["action"];
		$person = $_GET["person"];
		$idAsked = $currCity->xpath('//station[@number='.$station.']/discoveryContent/body/place[@id="'.$place.'"]/action[@name="'.$action.'"]/@itemRequired');
		$hasItem = $user->xpath('//user[@name="'.$person.'"]/inventory/item[@id="'.$idAsked[0].'"]');
		if (count($hasItem) != 0)
			echo "true";
		else echo "false";
	}	




// Benutzer
// Neues Benutzerkonto anlegen
if (isset($_GET["newAccount"])){
	$person = $_GET["person"];
	$loveFirstName = $_GET["loveFirstName"];
	$loveLastName = $_GET["loveLastName"];
	$loveSex = $_GET["loveSex"];
	$destination = $_GET["destination"];
	if (@count($user->xpath('//user/@name="'.$person.'"')) != 0){
		echo false;
	}
	else if (@count($user->xpath('//user/@name="'.$person.'"')) == 0) {
		$newUser = $user->addChild('user');
		$newUser->addAttribute('name',$person);
		$newUserLove = $newUser->addChild('love');
		$newUserCurrentMoney = $newUser->addChild('currentMoney',0);
		$newUserCurrentPlace = $newUser->addChild('currentPlace');
		$newUserInventory = $newUser->addChild('inventory');
		$newUserLove->addChild('loveFirstName',$loveFirstName);
		$newUserLove->addChild('loveLastName',$loveLastName);
		$newUserLove->addChild('sex',$loveSex);
		$newUserCurrentPlace->addChild('town',"zeidel");
		$newUserCurrentPlace->addChild('number',0);
		$newUserCurrentPlace->addChild('place',"centerEntranceSuccess");
		$firstItem = $newUserInventory->addChild('item');
		$firstItem->addAttribute('id',"bag");
		$firstItem->addChild('name',"Rucksack");
		$firstItem->addChild('description',"Dein überdimensionaler Rucksack zum Transportieren von nötigen Dingen wie Proviant, Pässe, Geld - und unnötigen, wie Kosmetika, Smartphones oder schlechten Klausuren.");
		$ticket = $newUserInventory->addChild('item');
		$ticket->addAttribute('id',"ticketTo".$destination);
		$ticket->addChild('name',"Fahrkarte nach ".$destination);
		$ticket->addChild('description',"Deine Fahrkarte für den Intercity nach ".$destination.".");
		$initPass = $user->xpath('//item[@id="initPass"]');
		foreach ($initPass as $passUsed){
			unset($passUsed);
		}
		$user->asXML('userData.xml');		
		echo true;
	}
}

// Hinzufügen eines neuen Gegenstandes
if (isset($_GET["newItem"])){
	$person = $_GET["person"];
	$newItemName = $_GET["newItem"];
	$newItemID = $_GET["id"];
	$newItemDescription = $_GET["itemDescription"];
	$inventory = $user->xpath('user[@name="'.$person.'"]/inventory');
	foreach ($inventory as $currInv){
		$newItem = $currInv->addChild('item');
		$newItem->addAttribute('id',$newItemID);
		$newItem->addChild('name',$newItemName);
		$newItem->addChild('description',$newItemDescription);
		if (isset($_GET["valid"]))
			$newItem->addAttribute('valid',$_GET["valid"]);
	}
	$user->asXML('userData.xml');
}

// Löschen eines Gegenstandes
// zusätzliche IF-Abfrage für den Fall, dass ein neues Benutzerkonto erstellt wurde und die Testperson auf Start zurückgesetzt wird
if (isset($_GET["remove"])){
	$person = $_GET["person"];
	$IDItemAffected = $_GET["IDItemAffected"];
	unset($user->xpath('user[@name="'.$person.'"]/inventory/item[@id="'.$IDItemAffected.'"]')[0]->{0});
 	if ($person == 'TestPerson'){
		$newPlace = $user->xpath('user[@name="'.$person.'"]/currentPlace');
		foreach ($newPlace as $input){
			$input->place = 'startupScreen';
		}
	}
	$user->asXML('userData.xml');
}

// Ausgabe des Inventars
if (isset($_GET["showInventory"])){
	$person = $_GET["person"];
	$currInventory = $user->xpath('user[@name="'.$person.'"]/inventory/descendant::*');
	foreach ($currInventory as $itemsCarried){
		echo $itemsCarried.'§';
	}
}
?>
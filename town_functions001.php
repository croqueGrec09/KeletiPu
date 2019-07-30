<?php
include ('townData.php');
include ('itemDB.php');

function loadCity($concerned){
	if (file_exists($concerned.'.xml')){
		return new townData($concerned.'.xml');
	}
	else if (!file_exists($concerned.'.xml')){
		echo "Die Datei ".$concerned.".xml konnte nicht geladen werden!";
	}
}

function loadItemDB() {
	if (file_exists('itemList.xml')){
		return new itemDB();
	}
	else if (!file_exists('itemList.xml'))
		echo 'Die Gegenstandskartei kann nicht geladen werden!';
}

function getNextPlaceData($currCity,$stationNumber,$place,$userData,$user){
	$query = 'station[@number="'.$station.'"]/discoveryContent/place[@id="'.$place.'"]/';
	$name = $currCity->xpath->query('station[@number="'.$station.'"]/name');
	$station_body = array($currCity->xpath($query.'text'),
							$currCity->xpath($query.'sign'),
							$currCity->xpath($query.'image'));
	$action_list = $currCity->xpath('station[@number="'.$station.'"]/discoveryContent/place[@id="'.$place.'"]/action');
	//$currCity->xpath('station[@number="9999"]/discoveryContent/place[@id="intro"]/action/@onlyOnce')
	$station_actions = array();
	if($user != "none"){
		//var_dump($userData->xpath('user[@name="'.$user.'"]/memory/actionsPassed/action'));		
		foreach($action_list as $action){
			//var_dump(count($userData->xpath('user[@name="'.$user.'"]/memory/actionsPassed/action[@name="'.$action->attributes()->name.'"]')));
			if ($action->attributes()->onlyOnce == "true") {
				if (count($userData->xpath('user[@name="'.$user.'"]/memory/actionsPassed/action[@name="'.$action->attributes()->name.'"]')) == 0)
					array_push($station_actions,getAction($action));
			}
			else {
				$nextAction = getAction($action);
				array_push($station_actions,$nextAction);
			}
		}
		$station_body = array_merge($station_body,$station_actions);
	}
	else {
		$action = $currCity->xpath('//station[@number="9999"]/discoveryContent/place[@id="intro"]/action');
		$intro_action = getAction($action[0]);
		array_push($station_body,$intro_action);
	}
	$additionalParams = array("video");
	foreach($additionalParams as $param){
		if (count($currCity->xpath($query.$param)) > 0)
		array_push($station_body,$currCity->xpath($query.$param));
	}	
	if (count($currCity->xpath($query."newItem")) > 0){
		$nextItems = $currCity->xpath($query.'newItem');
		foreach ($nextItems as $nextItem) {
			//var_dump($nextItem);
			if (isset($nextItem->itemImage))
				array_push($station_body,"nextItem: ".
				$nextItem->attributes()->id."!NI!".
				(string)$nextItem->attributes()->onload."!NI!".
				$nextItem->attributes()->cost."!NI!".
				$nextItem->attributes()->valid."!NI!".
				$nextItem->name."!NI!".
				trim($nextItem->description)."!NI!".
				$nextItem->actionToEliminate."!NI!".
				"itemImage: ".$nextItem->itemImage->attributes()->src."!NIM!".
						$nextItem->itemImage->attributes()->cx1."!NIM!".
						$nextItem->itemImage->attributes()->cy1."!NIM!".
						$nextItem->itemImage->attributes()->xl."!NIM!".
						$nextItem->itemImage->attributes()->yl);
			else
				array_push($station_body,"nextItem: ".
				$nextItem->attributes()->id."!NI!".
				(string)$nextItem->attributes()->onload."!NI!".
				$nextItem->attributes()->cost."!NI!".
				$nextItem->name."!NI!".
				trim($nextItem->description));
		}
	}
	if(count($currCity->xpath('station[@number="'.$station.'"]/discoveryContent/sound')) > 0){
		$sounds = $currCity->xpath('station[@number="'.$station.'"]/discoveryContent/sound');
		foreach ($sounds as $sound){
			array_push($station_body,$sound);
		}
	}
	echo $name[0].'§';
	foreach($station_body as $part){
		if (is_array($part) || is_object($part)){
			foreach($part as $part_value)
				echo $part_value.'§';
		}
		else echo $part.'§';
	}
}

function seekForm($city,$form,$lang){
	$result = $city->xpath('//form[@fname="'.$form.'" and @lang="'.$lang.'"]/descendant-or-self::*');
	$formParams = array('<form name='.$result[0]->attributes()->fname.'>');
	if(count($result[0]->textInput) > 0)
		//array_push($formParams,'textinputfields: ');
		foreach($result[0]->textInput as $textInput){
			array_push($formParams,'<label for="'.$textInput->attributes()->label.'">'.$textInput.'</label><input type="text" id="'.$textInput->attributes()->label.'" size="'.$textInput->attributes()->size.'"><br>');
		}
	if(count($result[0]->radio) > 0){
		foreach($result[0]->radio as $radio){
			array_push($formParams,'<h4>'.$radio->label.'</h4>');
			foreach($radio->choice as $choice){
				array_push($formParams,'<input type="radio" name="'.$radio->attributes()->rname.'" value="'.$choice->attributes()->value.'">'.$choice.'<br>');
			}
		}
	}
	if(count($result[0]->checkbox) > 0){
		foreach($result[0]->checkbox as $checkbox){
			array_push($formParams,'<h4>'.$checkbox->label.'</h4>');
			foreach($checkbox->choice as $choice){
				array_push($formParams,'<input type="checkbox" name="'.$checkbox->attributes()->cname.'" value="'.$choice->attributes()->value.'">'.$choice.'<br>');
			}
		}
	}
	if(count($result[0]->dropdown) > 0){
		array_push($formParams,'<select name="'.$result[0]->dropdown->attributes()->dname.'">');
		foreach($result[0]->dropdown->option as $option){
			array_push($formParams,'<option value="'.$option->attributes()->value.'">'.$option.'</option>');
		}
		array_push($formParams,'</select>');
	}
	array_push($formParams,'<br><input type="button" name="'.$result[0]->finish->attributes()->name.'" value="'.$result[0]->finish->label.'" onclick="'.$result[0]->finish->attributes()->onclick.'">');
	foreach($formParams as $form)
		echo $form;
}

function addItem($userData,$userInventory,$id,$name,$description,$valid){
	$nextItem = $userInventory->addChild('item');
	$nextItem->addAttribute('id',$id);
	$nextItem->addChild('name',$name);
	$nextItem->addChild('description',$description);
	$nextItem->addAttribute('valid',$valid);
	echo "Der folgende Gegenstand wurde hinzugefuegt:\n$name\nBeschreibung: $description";
}

function removeItem($user,$person,$id){
	unset($user->xpath('user[@name="'.$person.'"]/inventory/item[@id="'.$id.'"]')[0]->{0});
	echo "Gegenstand gelöscht.";
}

function eliminateAction($action,$currUser){
	//keine doppelte Eintragung - abfangen!
		$newAction = $currUser->memory->actionsPassed->addChild('action');
		$newAction->addAttribute('name',$action);
	echo "Aktion gemerkt.";
}
?>
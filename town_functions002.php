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

function getNextPlaceData($currCity,$stationNumber,$place,$user,$lang,$mode,$itemData){
	$id = $currCity->idPrefix.$stationNumber;
	//echo $lang;
	$station = $currCity->document->getElementById($id);
	if(!is_null($station)){
		$stationName = $station->getElementsByTagName("name")->item(0)->nodeValue;
		$placeParams = $currCity->xpath->query('//station[@number="'.$id.'"]/'.$mode.'/place[@id="'.$place.'"]')->item(0);
		$placeText = trim($currCity->xpath->query('//station[@number="'.$id.'"]/'.$mode.'/place[@id="'.$place.'"]/text[@lang="'.$lang.'"]')->item(0)->nodeValue);
		if($placeText === null){
			$placeTextQuery = '//station[@number="'.$id.'"]/'.$mode.'/place[@id="'.$place.'"]/text[@lang="'.$lang.'"]';
			return $placeTextQuery;	
		}
		$placeData = array(
			"name" => $stationName,
			"text" => $placeText
		);
		if($placeParams->getElementsByTagName("image")->item(0)->hasAttribute("lang"))
			$placeData["image"] = $currCity->xpath->query('//station[@number="'.$id.'"]/'.$mode.'/place[@id="'.$place.'"]/image[@lang="'.$lang.'"]')->item(0)->nodeValue;
		else
			$placeData["image"] = $placeParams->getElementsByTagName("image")->item(0)->nodeValue;
		$placeActions = array();
		foreach($placeParams->getElementsByTagName("action") as $node){
			//echo '//station[@number="'.$id.'"]/'.$mode.'/place[@id="'.$place.'"]/action[@name="'.$node->getAttribute("name").'"]/hover[@lang="'.$lang.'"]';
			$inMemory = false;
			if($node->getAttribute("onlyOnce") === "true") {
				$placeData["debug"] = array("actionName" => $node->getAttribute("name"));
				if($user !== "none"){
					$userMemory = $user->getElementsByTagName("actionsPassed")->item(0)->childNodes;
					if($userMemory->length > 0){
						foreach($userMemory as $memory){
							//$placeData["debug"]["userMemory"][] = print_r($memory->getAttribute("name"),true);
							if($memory->getAttribute("name") == $node->getAttribute("name"))
								$inMemory = true;
						}
						if($inMemory)
							continue;
					}
				}
			}
			$action = array(
				"name" => $node->getAttribute("name"),
				"coords" => $node->getAttribute("coords"),
				"itemRequired" => $node->getAttribute("itemRequired"),
				"execute" => $node->getElementsByTagName("execute")->item(0)->nodeValue,
				"hover" => trim($currCity->xpath->query('//station[@number="'.$id.'"]/'.$mode.'/place[@id="'.$place.'"]/action[@name="'.$node->getAttribute("name").'"]/hover[@lang="'.$lang.'"]')->item(0)->nodeValue)
			);
			$actionImage = array();
			if($node->getElementsByTagName("actionImage")->length > 0) {
				$imageNode = $node->getElementsByTagName("actionImage")->item(0);
				$actionImage["src"] = $imageNode->getAttribute("src");
				$actionImage["cx1"] = $imageNode->getAttribute("cx1");
				$actionImage["cy1"] = $imageNode->getAttribute("cy1");
				$actionImage["xl"] = $imageNode->getAttribute("xl");
				$actionImage["yl"] = $imageNode->getAttribute("yl");
				$action["actionImage"] = $actionImage;
			}
			if(isset($actionsToVerify) && count($actionsToVerify) > 0){
				if(!in_array($action["name"],$actionsToVerify))
					$placeActions[$action["name"]] = $action;
			}
			else $placeActions[$action["name"]] = $action;
		}
		$placeData["actions"] = $placeActions;
		$placeSoundParams = $placeParams->getElementsByTagName("sound");
		$placeVideoParams = $placeParams->getElementsByTagName("video");
		$placeItemParams = $placeParams->getElementsByTagName("newItem");
		if($placeSoundParams->length > 0){
			echo "Bitte Soundschleife ergänzen!";
		}
		if($placeVideoParams->length > 0){
			echo "Bitte Videoschleife ergänzen!";
		}
		$placeItems = array();
		if($placeItemParams->length > 0){
			foreach ($placeItemParams as $placeItem){
				$itemID = $placeItem->getAttribute("id");
				$itemParams = array(
					"id" => $id,
					"found" => $placeItem->getAttribute("found")
				);
				$placeItems[$itemParams["id"]] = $itemParams;
			}
			$placeData["newItem"] = $placeItems;
		}
		return json_encode($placeData);
	}
	else return "Platz konnte nicht gefunden werden!";
}

function seekForm($city,$form,$lang){
	$result = $city->xpath->query('//form[@fname="'.$form.'" and @lang="'.$lang.'"]/descendant-or-self::*');
	$formParams = array('<form name='.$result->item(0)->getAttribute("fname").'>');
	if($result->item(0)->getElementsByTagName("textInput")->length > 0)
		//array_push($formParams,'textinputfields: ');
		foreach($result->item(0)->getElementsByTagName("textInput") as $textInput){
				array_push($formParams,'<label for="'.$textInput->getAttribute("label").'">'.$textInput->nodeValue.'</label><input type="text" id="'.$textInput->getAttribute("label").'" size="'.$textInput->getAttribute("size").'"><br>');
		}
	if($result->item(0)->getElementsByTagName("radio")->length > 0){
		foreach($result->item(0)->getElementsByTagName("radio") as $radio){
			array_push($formParams,'<h4>'.$radio->getElementsByTagName("label")->item(0)->nodeValue.'</h4>');
			foreach($radio->getElementsByTagName("choice") as $choice){
				array_push($formParams,'<input type="radio" name="'.$radio->getAttribute("name").'" value="'.$choice->getAttribute("value").'">'.$choice->nodeValue.'<br>');
			}
		}
	}
	if($result->item(0)->getElementsByTagName("checkbox")->length > 0){
		foreach($result->item(0)->getElementsByTagName("checkbox") as $checkbox){
			array_push($formParams,'<h4>'.$checkbox->getElementsByTagName("label")->item(0)->nodeValue.'</h4>');
			foreach($checkbox->getElementsByTagName("choice") as $choice){
				array_push($formParams,'<input type="checkbox" name="'.$checkbox->getAttribute("name").'" value="'.$choice->getAttribute("value").'">'.$choice->nodeValue.'<br>');
			}
		}
	}
	if($result->item(0)->getElementsByTagName("dropdown")->length > 0){
		foreach($result->item(0)->dropdown as $dropdown){
			array_push($formParams,'<select name="'.$dropdown->getAttribute("name").'">');
			foreach($dropdown->getElementsByTagName("option") as $option){
				array_push($formParams,'<option value="'.$option->getAttribute("value").'">'.$option->nodeValue.'</option>');
			}
		}
		array_push($formParams,'</select>');
	}
	$finish = $result->item(0)->getElementsByTagName("finish")->item(0);
	array_push($formParams,'<br><input type="button" name="'.$finish->getAttribute("name").'" value="'.$finish->getAttribute("label").'" onclick="'.$finish->getAttribute("onclick").'">');
	foreach($formParams as $form)
		echo $form;
}
?>
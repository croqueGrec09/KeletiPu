<?php
include ("happening.php");

function loadBase($city){
	if (file_exists("$city.xml")){
		return new happening("$city.xml");
	}
	else if (!file_exists("$city.xml"))
		echo "Die Ereignisdaten für $city können nicht geladen werden!";
}

function happening($city,$line,$entry,$lang){
	$eventDB = loadBase($city);
	$eventNode = $eventDB->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/descendant-or-self::*')->item(0);
	$eventObject = array("name" => $eventDB->xpath->query('//stream[@id="'.$line.'"]/@name')->item(0)->nodeValue,
						 "image" => $eventNode->getElementsByTagName("image")->item(0)->nodeValue,
						 "text" => $eventDB->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/eventBody/text[@lang="'.$lang.'"]')->item(0)->nodeValue);
	$nextEvent = $eventNode->getElementsByTagName("nextEvent");
	$previousEvent = $eventNode->getElementsByTagName("previousEvent");
	$exitStream = $eventDB->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/exitStream/child::*');
	$otherHappenings = $eventDB->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/otherHappenings/child::*');
	if($nextEvent->length > 0)
		$eventObject["nextEvent"] = $nextEvent->item(0)->getAttribute("pointRef");
	if($previousEvent->length > 0)
		$eventObject["previousEvent"] = $previousEvent->item(0)->getAttribute("pointRef");
	if($exitStream->length > 0)
		//$eventObject["exitStream"] = print_r($exitStream->item(1),true);
		$eventObject["exitStream"] = array("nextCity" => $exitStream->item(0)->nodeValue,
										   "nextStation" => $exitStream->item(1)->nodeValue,
										   "nextPlace" => $exitStream->item(2)->nodeValue);
	if($otherHappenings->length > 0){
		$eventObject["otherHappenings"] = array();
		foreach($otherHappenings as $happening){
			switch($happening->nodeName){
				case "addItem":
				case "removeItem": $eventObject["otherHappenings"][] = array("command" => $happening->nodeName,
																			 "itemId" => $happening->getAttribute("itemID"));
				break;
				case "addMoney": $eventObject["otherHappenings"][] = array("command" => $happening->nodeName,
																		   "add" => true,
																		   "amount" => $happening->getAttribute("amount"));
				break;
				case "deductMoney": $eventObject["otherHappenings"][] = array("command" => $happening->nodeName,
																			  "add" => false,
																			  "amount" => $happening->getAttribute("amount"));
				break;
			}
			
		}
	}
	//Soundschleife ergänzen
	return json_encode($eventObject);
}
?>
<?php
	
class Happening {
	
	private $document;
	private $xpath;
	
	public function setTown($documentPath){
		$this->document = new DOMDocument();
		$this->document->load($documentPath.'.xml');
		$this->xpath = new DOMXPath($this->document);
		$this->document->schemaValidate(ANALYSISCITY_PATH.'happening.xsd');
	}
	
	public function getPoint($line,$entry,$lang){
		$eventNode = $this->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/descendant-or-self::*')->item(0);
		$eventObject = array("name" => $this->xpath->query('//stream[@id="'.$line.'"]/@name')->item(0)->nodeValue,
							 "image" => $eventNode->getElementsByTagName("image")->item(0)->nodeValue,
							 "text" => $this->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/eventBody/text[@lang="'.$lang.'"]')->item(0)->nodeValue);
		$nextEvent = $eventNode->getElementsByTagName("nextEvent");
		$previousEvent = $eventNode->getElementsByTagName("previousEvent");
		$exitStream = $this->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/exitStream/child::*');
		$otherHappenings = $this->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/otherHappenings/child::*');
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
					case "addItem": $eventObject["otherHappenings"][] = array("command" => $happening->nodeName,
																			  "triggeredItem" => $happening->getAttribute("itemID"),
																			  "valid" => $happening->getAttribute("valid"));
					break;
					case "removeItem": $eventObject["otherHappenings"][] = array("command" => $happening->nodeName,
																				 "triggeredItem" => $happening->getAttribute("itemID"));
					break;
					case "addMoney": 
					case "deductMoney":
					$eventObject["otherHappenings"][] = array("command" => $happening->nodeName,
															  "amount" => $happening->getAttribute("amount"));
					break;
					case "addQuest": 
					$eventObject["otherHappenings"][] = array("command" => $happening->nodeName,
															  "targetQuest" => $happening->getAttribute("targetQuest"));
					break;
					case "updateQuest": $eventObject["otherHappenings"][] = array("command" => $happening->nodeName,
																				  "targetQuest" => $happening->getAttribute("targetQuest"),
																				  "chapter" => $happening->getAttribute("chapter"));
					break;
					case "completeQuest": $success = $happening->getAttribute("success") === "true" ? "yes" : "no";
					$eventObject["otherHappenings"][] = array("command" => $happening->nodeName,
															  "targetQuest" => $happening->getAttribute("targetQuest"),
															  "success" => $success);
					break;
				}
				
			}
		}
		//add sound loop
		return $eventObject;
	}
	
}

?>
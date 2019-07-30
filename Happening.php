<?php
/*
	This is the representation of the happening base. It contains the DOMDocument which is traversable with a DOMXPath.
	It prepares for a given point of a given line the appropriate view.
	
	current version: 0.701, July 7th, 2018
	
	author: András Gálffy, andrisgalffy@gmail.com, matricula number #5584124
*/

class Happening {
	
	//the DOMDocument field
	private $document;
	//the DOMXPath attached to the DOMDocument
	private $xpath;
	
	//loads the given document path and initialises the XPath
	public function setTown($documentPath){
		$this->document = new DOMDocument();
		$this->document->load($documentPath.'.xml');
		$this->xpath = new DOMXPath($this->document);
		$this->document->schemaValidate(ANALYSISCITY_PATH.'happening.xsd');
	}
	
	//returns in an associative array the given point for the line, in the given language
	public function getPoint($line,$entry,$lang){
		//get event root
		$eventNode = $this->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]')->item(0);
		//initialise return array with the name of the stream
		$eventObject = array("name" => $this->xpath->query('//stream[@id="'.$line.'"]/@name')->item(0)->nodeValue);
		//get image and description text if point is textual
		if($eventNode->getElementsByTagName("eventBody")->length > 0) {
			$eventObject["image"] = $eventNode->getElementsByTagName("image")->item(0)->nodeValue;
			$eventObject["text"] = $this->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/eventBody/text/'.$lang)->item(0)->nodeValue;
		}
		else if($eventNode->getElementsByTagName("eventMultimedia")->length > 0) {
			//if event point is a video, get its path details and overlay image paths
			$multimediaNode = $eventNode->getElementsByTagName("eventMultimedia")->item(0);
			foreach($multimediaNode->childNodes as $multimedia) {
				if($multimedia->nodeName === "setImages") {
					$setImages = array();
					foreach($multimedia->getElementsByTagName("assocData") as $assocData) {
						$setImages[] = array("dataType" => $assocData->getAttribute("dataType"),
											 "filePath" => $assocData->getAttribute("filePath"));
					}
					$eventObject["setImages"] = $setImages;
				}
				else if($multimedia->nodeType === XML_ELEMENT_NODE){
					$eventObject[$multimedia->nodeName] = $multimedia->nodeValue;
				}
			}
		}
		//check next and previous points of stream
		$nextEvent = $eventNode->getElementsByTagName("nextEvent");
		$previousEvent = $eventNode->getElementsByTagName("previousEvent");
		//check if exit point exists
		$exitStream = $this->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/exitStream/child::*');
		//fetch other happenings which occur at this place
		$otherHappenings = $this->xpath->query('//stream[@id="'.$line.'"]/event[@id="'.$entry.'"]/otherHappenings/child::*');
		//if next/previous points are set, get the references
		if($nextEvent->length > 0)
			$eventObject["nextEvent"] = $nextEvent->item(0)->getAttribute("pointRef");
		if($previousEvent->length > 0)
			$eventObject["previousEvent"] = $previousEvent->item(0)->getAttribute("pointRef");
		//get exit point data if it exists
		if($exitStream->length > 0)
			$eventObject["exitStream"] = array("nextCity" => $exitStream->item(0)->nodeValue,
											   "nextStation" => $exitStream->item(1)->nodeValue,
											   "nextPlace" => $exitStream->item(2)->nodeValue);
		//if there are other happenings, loop through nodes and add them to array container
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
		return $eventObject;
	}
	
}

?>
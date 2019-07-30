<?php

class Dialogue {

	private $document;
	private $city;
	private $xpath;
	private $user;
	private $character;
	private $stream;
	private $itemList;
	
	//gets the current town data
	public function setTown($dialogPath){
		$this->city = $dialogPath;
		$this->document = new DOMDocument();
		$this->document->load(ANALYSISCITY_PATH.$this->city.'.xml');
		$this->xpath = new DOMXPath($this->document);
		$this->document->schemaValidate(ANALYSISCITY_PATH.'dialogueData.xsd');
	}

	//sets the user
	public function setUser($user) {
		$this->user = $user;
	}
	
	//sets the character and stream to consider
	public function setCharacterStream($character,$stream) {
		$this->character = $character;
		$this->stream = $stream;
	}
	
	//sets the item list
	public function setItemList($itemList) {
		$this->itemList = $itemList;
	}
	
	//retrieves the next point in the given dialogue. Answers are returned with the given conditions and triggers checked
	public function getPoint($point) {
		$query = '//person[@id="'.$this->character.'"]/stream[@id="'.$this->stream.'"]/point[@id="'.$point.'"]';
		//echo $query;
		$dialogData = $this->xpath->query($query)->item(0);
		$action = array();
		//var_dump($this->document);
		//all conditioned actions
		if($dialogData->getElementsByTagName("conditionedAction")->length > 0){	
			$condActions = $dialogData->getElementsByTagName("conditionedAction")->item(0);
			foreach($condActions->childNodes as $condAction) {
				//TODO #202 deploy repeated control structures into function
				//check if condition
				if($condAction->nodeName === "if") {
					//test condition
					switch($condAction->getAttribute("conditionToTest")) {
						case "checkItem": $preconditionMet = $this->user->checkInventory($condAction->getAttribute("requirement"));
						break;
						case "checkMoney": 
							if($this->user->getMoney() >= $condAction->getAttribute("requirement"))
								$preconditionMet = "true";
							else $preconditionMet = "false";
						break;
					}
					//condition met as expected
					if($preconditionMet === $condAction->getAttribute("evaluation")) {
						$actionData = $this->buildActionArray($condAction);
						if($dialogData->hasAttribute("disable"))
							$actionData["disable"] = $this->disablePoints($dialogData->getAttribute("disable"),$point);
						$action[] = $actionData;
					}
					//condition failed, hand to else-if node
					else $ifFailed = true;
				}
				//if fails, go on with else-ifs
				else if($condAction->nodeName === "else-if" && isset($ifFailed)) {
					//test condition
					switch($condAction->getAttribute("conditionToTest")) {
						case "checkItem": $preconditionMet = $this->user->checkInventory($condAction->getAttribute("requirement"));
						break;
						case "checkMoney": 
							if($this->user->getMoney() >= $condAction->getAttribute("requirement"))
								$preconditionMet = "true";
							else $preconditionMet = "false";
						break;
					}
					//condition met as expected
					if($preconditionMet === $condAction->getAttribute("evaluation")) {
						$actionData = $this->buildActionArray($condAction);
						if($dialogData->hasAttribute("disable"))
							$actionData["disable"] = $this->disablePoints($dialogData->getAttribute("disable"),$point);
						$action[] = $actionData;
						unset($ifFailed);
					}
					//condition failed, hand to else-if node
					else $elseIfFailed = true;
				}
				//if or else if fails, go on with else
				else if($condAction->nodeName === "else" && (isset($ifFailed) || isset($elseIfFailed))) {
					$actionData = $this->buildActionArray($condAction);
					if($dialogData->hasAttribute("disable"))
						$actionData["disable"] = $this->disablePoints($dialogData->getAttribute("disable"),$point);
					$action[] = $actionData;
					if(isset($ifFailed))
						unset($ifFailed);
					if(isset($elseIfFailed))
						unset($elseIfFailed);
				}
			}
		}
		//all no-condition actions
		foreach($dialogData->getElementsByTagName("action") as $actionNode) {
			$actionData = $this->buildActionArray($actionNode);
			if($dialogData->hasAttribute("disable"))
				$actionData["disable"] = $this->disablePoints($dialogData->getAttribute("disable"),$point);
			$action[] = $actionData;
		}
		$answer = $dialogData->getElementsByTagName("answer")->item(0)->nodeValue;
		$reaction = array("answer" => $answer,
						  "action" => $action);
		return $reaction;
	}
	
	//special function for the train vendor
	//checks if more towns can be suggested to the player
	public function loadPlaceSuggestions($pointGrp,$pointsPassed) {
		//build up array of suggestible towns
		$suggestiblePoints = array();
		//TODO #201 put this into function so that funtion may be generalised
		foreach($this->user->getUser()["memory"]["townsToVisit"] as $town) {
			//map town strings to according numbers
			//echo $town;
			switch($town) {
				/*
				case "serabis": $suggestion = "1";
				break;
				case "paris": $suggestion = "2";
				break;
				case "nantes-la-jolie": $suggestion = "3";
				break;
				case "conoi": $suggestion = "4";
				break;
				case "trochpathy": $suggestion = "5";
				break;
				case "plattendorf": $suggestion = "6";
				break;
				*/
				case "kvirasim": $suggestion = "7";
				break;
				/*
				case "cite_d_orcive": $suggestion = "8";
				break;
				case "ninaciudad": $suggestion = "9";
				break;
				case "eichlinghausen": $suggestion = "10";
				break;
				*/
				case "karlstadt": $suggestion = "10b";
				break;
				/*
				case "kikinda": $suggestion = "88";
				break;
				*/
				default: $suggestion = false;
				break;
			}
			if($suggestion !== false) {
				//concat prefix with town number
				$suggestiblePlace = $pointGrp.$suggestion;
				//check if appropriate point is not passed already
				if(!in_array($suggestiblePlace,$pointsPassed)) {
					$suggestiblePoints[] = $suggestion;
				}
			}
		}
		//pick a random place among suggestible towns
		if(!empty($suggestiblePoints)) {
			$point = mt_rand(0,count($suggestiblePoints)-1);
			return $suggestiblePoints[$point];
		}
		else return false;
	}
	
	//builds up the array of actions
	public function buildActionArray($actionNode) {
		$commandNode = $actionNode->getElementsByTagName("command")->item(0);
		switch($commandNode->getAttribute("commandName")){
			case "dialogue": $commandData = array("database" => $this->city,
												  "character" => $this->character,
												  "stream" => $this->stream,
												  "point" => $commandNode->getAttribute("point"));
			break;
			case "exit": $commandData = array();
			break;
			case "event": $commandData = array("city" => $commandNode->getAttribute("base"),
											   "stream" => $commandNode->getAttribute("event"),
											   "entry" => $commandNode->getAttribute("id"),
											   "forward" => "true");
			break;
			case "giveItem": 
			case "getItem": $commandData = array("triggeredItem" => 
												 array("id" => $commandNode->getAttribute("triggeredItem"),
												 "valid" => $this->itemList->getItemDefaultValidity($commandNode->getAttribute("triggeredItem"))),
												 "database" => $this->city,
												 "character" => $this->character,
												 "stream" => $this->stream,
												 "point" => $commandNode->getAttribute("point"));
			break;
			case "giveMoney":
			case "getMoney": $commandData = array("amount" => $commandNode->getAttribute("amount"),
												  "database" => $this->city,
												  "character" => $this->character,
												  "stream" => $this->stream,
												  "point" => $commandNode->getAttribute("point"));
			break;
			case "dialogueChoice": $commandData = array("database" => $this->city,
														"character" => $this->character,
														"stream" => $this->stream,
														"pointGrp" => $commandNode->getAttribute("pointGrp"));
			break;
			//TODO #200 add quest manipulation
		}
		$responseNode = $actionNode->getElementsByTagName("response")->item(0);
		$responseText = "";
		foreach($responseNode->childNodes as $responseDetail) {
			switch($responseDetail->nodeName) {
				case "userName": $responseText .= $this->user->getAppellation();
				break;
				default: $responseText .= $responseDetail->nodeValue;
				break;
			}
		}
		return array("name" => $commandNode->getAttribute("commandName"),
					 "response" => $responseText,
					 "command" => $commandData);
	}
	
	//disables places in the dialogue stream
	public function disablePoints($pointsArray,$self) {
		$ret = array();
		foreach(explode(",",$pointsArray) as $disable) {
			if($disable === "self")
				$ret[] = $self;
			else $ret[] = $disable;
		}
		return $ret;
	}
}

?>
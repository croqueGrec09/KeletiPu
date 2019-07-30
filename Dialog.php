<?php
/*
	This is the dialog representation. It contains a DOMDocument and a DOMXPath for document queries.
	Moreover, fields for the current character and stream are set just as the current user and inventory base which are available 
	for condition control
	
	author: András Gálffy, andrisgalffy@gmail.com, matricula number #5584124
*/

class Dialog {

	//DOMDocument of the dialog file
	private $document;
	//current city name
	private $city;
	//DOMXPath for the document
	private $xpath;
	//current user object
	private $user;
	//current character ID
	private $character;
	//current stream key
	private $stream;
	//item base object
	private $itemList;
	
	//gets the current town data
	public function setTown($dialogPath){
		$this->city = $dialogPath;
		$this->document = new DOMDocument();
		//set up document and attach XPath
		$this->document->load(ANALYSISCITY_PATH.$this->city.'.xml');
		$this->xpath = new DOMXPath($this->document);
		$this->document->schemaValidate(ANALYSISCITY_PATH.'dialogData.xsd');
	}

	//sets the user object
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
	
	//retrieves the next point in the given dialog. Answers are returned with the given conditions and triggers checked
	public function getPoint($point) {
		$query = '//person[@id="'.$this->character.'"]/stream[@id="'.$this->stream.'"]/point[@id="'.$point.'"]';
		//get dialog root
		$dialogData = $this->xpath->query($query)->item(0);
		$action = array();
		//all conditioned actions
		if($dialogData->getElementsByTagName("conditionedAction")->length > 0){	
			foreach($dialogData->getElementsByTagName("conditionedAction") as $condActions) {
				foreach($condActions->childNodes as $condAction) {
					//check if condition
					if($condAction->nodeName === "if") {
						//test condition
						$preconditionMet = $this->evaluatePrecondition($condAction);
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
						$preconditionMet = $this->evaluatePrecondition($condAction);
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
		}
		//all no-condition actions
		foreach($dialogData->getElementsByTagName("action") as $actionNode) {
			$actionData = $this->buildActionArray($actionNode);
			if($dialogData->hasAttribute("disable"))
				$actionData["disable"] = $this->disablePoints($dialogData->getAttribute("disable"),$point);
			$action[] = $actionData;
		}
		$answer = "";
		$answerNode = $dialogData->getElementsByTagName("answer")->item(0);
		foreach($answerNode->childNodes as $answerNode) {
			if($answerNode->nodeName === $this->user->getLang())
				$answer = $answerNode->nodeValue;
		}
		$reaction = array("answer" => $answer,
						  "action" => $action);
		return $reaction;
	}
	
	//checks if preconditions are met for a given action node
	public function evaluatePrecondition($condAction) {
		//XML booleans are not parsed as such, evaluation is done against string
		$ret = "false";
		switch($condAction->getAttribute("conditionToTest")) {
			case "checkItem": $ret = $this->user->checkInventory($condAction->getAttribute("requirement"));
			break;
			case "checkMoney": 
				if($this->user->getMoney() >= $condAction->getAttribute("requirement"))
					$ret = "true";
				else $ret = "false";
			break;
		}
		return $ret;
	}
	
	//special function for the train vendor
	//checks if more towns can be suggested to the player
	public function loadPlaceSuggestions($pointGrp,$pointsPassed) {
		//build up array of suggestible towns
		$suggestiblePoints = array();
		foreach($this->user->getUser()["memory"]["townsToVisit"] as $town) {
			//map town strings to according numbers
			//numbers of analysis cities are left inside as reference
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
		$commandData = array();
		//loop through child nodes and assign array according to node name
		foreach($commandNode->childNodes as $command) {
			switch($command->nodeName){
				case "dialog": $commandData[$command->nodeName] = array("database" => $this->city,
													"character" => $this->character,
													"stream" => $this->stream,
													"point" => $command->getAttribute("point"));
				break;
				case "dialogChoice": $commandData[$command->nodeName] = array("database" => $this->city,
														  "character" => $this->character,
														  "stream" => $this->stream,
														  "pointGrp" => $command->getAttribute("pointGrp"));
				break;
				case "exit": $commandData[$command->nodeName] = array();
				break;
				case "event": $commandData[$command->nodeName] = array("city" => $command->getAttribute("base"),
												   "stream" => $command->getAttribute("stream"),
												   "entry" => $command->getAttribute("id"),
												   "forward" => "true");
				break;
				case "giveItem": 
				case "getItem": $commandData[$command->nodeName] = array("triggeredItem" => 
													 array("id" => $command->getAttribute("triggeredItem"),
													 "valid" => $this->itemList->getItemDefaultValidity($command->getAttribute("triggeredItem"))),
													 "database" => $this->city,
													 "character" => $this->character,
													 "stream" => $this->stream);
				break;
				case "giveMoney":
				case "getMoney": $commandData[$command->nodeName] = array("amount" => $command->getAttribute("amount"),
													  "database" => $this->city,
													  "character" => $this->character,
													  "stream" => $this->stream);
				break;
			}
		}
		$responseNode = $actionNode->getElementsByTagName("response")->item(0);
		$responseText = "";
		//loop through language text childs and return the correct one
		foreach($responseNode->childNodes as $response) {
			if($response->nodeName === $this->user->getLang()) {
				foreach($response->childNodes as $responseDetail) {
					switch($responseDetail->nodeName) {
						case "userName": $responseText .= $this->user->getAppellation();
						break;
						default: $responseText .= $responseDetail->nodeValue;
						break;
					}
				}
			}
		}
		return array("response" => $responseText,
					 "command" => $commandData);
	}
	
	//disables places in the dialog stream
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
<?php

class Dialogue {

	private $document;
	private $city;
	private $xpath;
	private $user;
	
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
	
	//retrieves the next point in the given dialogue. Answers are returned with the given conditions and triggers checked
	public function getPoint($character,$stream,$point,$pointsPassed) {
		$query = '//person[@id="'.$character.'"]/stream[@id="'.$stream.'"]/point[@id="'.$point.'"]';
		//echo $query;
		$dialogData = $this->xpath->query($query)->item(0);
		$action = array();
		$debug = null;
		$alt = false;
		//var_dump($this->document);
		if(!empty($dialogData->getAttribute("trigger"))) {
			if(strpos(",",$dialogData->getAttribute("trigger")) > 0) {
				$triggers = explode(",",$dialogData->getAttribute("trigger"));
			}
			else $triggers = array($dialogData->getAttribute("trigger"));
			foreach($triggers as $trigger) {
				switch($trigger) {
					case "loadPlaceSuggestions": 
						//get point group prefix for further reference
						$pointGrp = $dialogData->getAttribute("pointGrp");
						//get next suggested place
						$suggested = $this->loadPlaceSuggestions($pointGrp,$pointsPassed);
						if($suggested !== false)
							$alt = true;
					break;
					case "checkIfPlacesAreSuggestible":
						//get point group prefix for further reference
						$pointGrp = $dialogData->getAttribute("pointGrp");
						//get next suggested place
						$suggested = $this->loadPlaceSuggestions($pointGrp,$pointsPassed);
						if($suggested !== false) {
							//XML booleans are not readable as PHP booleans
							$preconditionsMet = "true";
						}
					break;
				}
			}
		}
		foreach($dialogData->getElementsByTagName("action") as $actionNode) {
			/*continue here:
				- place suggestions are not filtered correctly
				- in a case when no places can be suggested, the dialog shall come to an end
			*/
			if((!$actionNode->hasAttribute("for") && (!$actionNode->hasAttribute("preconditionsMet"))) || 
				$actionNode->getAttribute("for") === $suggested || 
				($actionNode->hasAttribute("preconditionsMet") && $this->checkPreconditions($actionNode->getAttribute("preconditionsMet"),$preconditionsMet))) {
				/*
				if($alt) {
					var_dump($suggested);
					var_dump($actionNode->getAttribute("for"));
				}
				*/
				$commandNode = $actionNode->getElementsByTagName("command")->item(0);
				switch($commandNode->getAttribute("commandName")){
					case "dialogue": $commandData = array("city" => $this->city,
														  "character" => $character,
														  "stream" => $stream,
														  "point" => $commandNode->getAttribute("point"),
														  "from" => $commandNode->getAttribute("from"));
					break;
					case "exit": $commandData = array();
					break;
					case "event": $commandData = array("city" => $commandNode->getAttribute("base"),
													   "stream" => $commandNode->getAttribute("event"),
													   "entry" => $commandNode->getAttribute("id"),
													   "forward" => "true");
					break;
				}
				$action[] = array("name" => $commandNode->getAttribute("commandName"),
								  "response" => $actionNode->getElementsByTagName("response")->item(0)->nodeValue,
								  "command" => $commandData);
			}
			unset($preconditionsMet);
		}
		if($alt) {
			$answer = $this->xpath->query($query.'/answer[@alternative="'.$suggested.'"]')->item(0)->nodeValue;
		}
		else
			$answer = $dialogData->getElementsByTagName("answer")->item(0)->nodeValue;
		$reaction = array("answer" => $answer,
						  "action" => $action,
						  "debug" => $debug);
		return $reaction;
	}
	
	//special function for the train vendor
	//checks if more towns can be suggested to the player
	public function loadPlaceSuggestions($pointGrp,$pointsPassed) {
		//build up array of suggestible towns
		$suggestibleTowns = array();
		foreach($this->user["memory"]["townsToVisit"] as $town) {
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
					$suggestibleTowns[] = $suggestion;
				}
			}
		}
		//pick a random place among suggestible towns
		if(!empty($suggestibleTowns))
			return $suggestibleTowns[rand(0,count($suggestiblePlace)-1)];
		else return false;
	}
	
	public function checkPreconditions($requirement,$preconditionsMet) {
		if($requirement === $preconditionsMet)
			return true;
		else return false;
	}
}

?>
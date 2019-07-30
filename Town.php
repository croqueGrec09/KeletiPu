<?php
/*
	This is the abstract server-side representation for a city. Upon runtime, the appropriate city document may be loaded and 
	processed with DOMXPath.
	
	version 0.701 from July 7th, 2018
	
	author: András Gálffy, andrisgalffy@gmail.com, matricula number #5584124
*/

class Town {

	//the DOMDocument field
	private $townDoc;
	//the DOMXPath field, enabling the query of townDoc
	private $townXPath;
	//the idPrefix of the current town; they are defined in the root of each town definition
	private $idPrefix;
	//the item data base file as DOMDocument field
	private $itemDoc;
	//the DOMXPath field attached to the item base
	private $itemXPath;
	//the language the player uses, needed for text display
	private $lang;
	
	//loads city data
	public function setTown($concerned){
		//check if file exists if the path is being inserted directly
		if (file_exists($concerned.'.xml')){
			$this->townDoc = new DOMDocument();
			$this->townDoc->load($concerned.'.xml');
			$this->townXPath = new DOMXPath($this->townDoc);
			/* temp disabling, config destroyed
			saxon schema validator, should be able to validate against XSD schema 1.1
			$processor = new Saxon\SaxonProcessor();
			$validator = $processor->newSchemaValidator();
			$validator->setProperty('report-node','true');
			$validator->setProperty('verbose','true');
			$validator->registerSchemaFromFile(ANALYSISCITY_PATH.'town.xsd');
			$validator->validate($concerned.'.xml');
			*/
			//libxml schema validator
			$this->townDoc->schemaValidate(ANALYSISCITY_PATH.'town.xsd');
			$this->idPrefix = $this->townXPath->query('/town/@idPrefix')->item(0)->nodeValue;
		}
		//in some cases, the town prefix may be passed instead of the full path. Check then, if regex mathes
		else if (preg_match("/\A[a-z]{2}\z/",$concerned) > 0) {
			//open up new DOMDocument object
			$this->townDoc = new DOMDocument();
			//resolve path according to given prefix
			switch($concerned) {
			case "zd": $this->townDoc->load(ANALYSISCITY_PATH.'zeidel.xml');
			break;
			case "kv": $this->townDoc->load(ANALYSISCITY_PATH.'kvirasim.xml');
			break;
			case "ka": $this->townDoc->load(ANALYSISCITY_PATH.'karlstadt.xml');
			break;
			default: throw new ErrorException("invalid town prefix!");
			break;
			}
			//associate DOMDocument to DOMXPath and validate document
			$this->townXPath = new DOMXPath($this->townDoc);
			$this->townDoc->schemaValidate(ANALYSISCITY_PATH.'town.xsd');
			//assign prefix
			$this->idPrefix = $concerned;
		}
		else if (!file_exists($concerned.'.xml')){
			throw new ErrorException("Die Datei ".$concerned.".xml konnte nicht geladen werden!");
		}
	}
	
	//gets the given place data
	/* to test in Oxygen:
	//station[@number='zd9999']/name|
	//station[@number='zd9999']/attribute::*|
	//station[@number='zd9999']/discoveryContent
	*/
	public function getPlace($placeData) {
		//in case of new user insertion
		if(isset($placeData["currentUser"])) {
			$user = $placeData["currentUser"];
			$this->lang = $user["lang"];
			$number = $user["currentPlace"]["number"];
			$place = $user["currentPlace"]["place"];
		}
		else if(!isset($placeData["currentUser"])) {
			//normal place call
			$number = $placeData["number"];
			$place = $placeData["place"];
			$this->lang = $placeData["lang"];
		}
		//exam mode not implemented yet, sets the mode in which the place content has to be retrieved
		$mode = $placeData["mode"];
		$stationNode = $this->townXPath->query("//station[@number='".$this->idPrefix.$number."']/name|".
											   "//station[@number='".$this->idPrefix.$number."']/attribute::*|".
											   "//station[@number='".$this->idPrefix.$number."']/".$mode."/place[@id='".$place."']/child::*");
		//build up place array which is a representation of the XML place node
		$return = array();
		foreach($stationNode as $node) {
			//loop through each node and assign to array
			switch($node->nodeName) {
				case "name":
				case "additionalMoney":
				case "mapPointX":
				case "mapPointY":
				$return[$node->nodeName] = $node->nodeValue;
				break;
				case "content": 
				foreach($node->childNodes as $content) {
					//load content of given language
					if($content->nodeName === $this->lang)
						$return["content"] = trim($content->nodeValue);
				}
				break;
				case "imagePath": 
				if($node->getAttribute("lang") === "all" || ($node->getAttribute("lang") === $this->lang))
					$return["imagePath"] = $node->nodeValue;
				break;
				case "action":
				//process action nodes
				if(!isset($return["actions"]))
					$return["actions"] = array();
				$actionName = $node->getAttribute("name");
				$return["actions"][$actionName] = $this->processActionNode($node);
				break;
				case "condAction":
				//initialise clause evaluation variables
				$ifClause = false;
				$elseIfClause = false;
				/*
					BEWARE! A server-side check decides whether the action should appear at all or not! The player does NOT get 
					informed that he is lacking some condition! In some cases, it may be useful to inform the user upon a 
					missing condition (e.g. ticket usage). In such a case, the check has to be done on client side!
				*/
				foreach($node->childNodes as $condAction) {
					if(!isset($return["actions"]))
						$return["actions"] = array();
					//process conditioned actions, evaluate conditions and push to action array if condition is met
					switch($condAction->nodeName) {
					case "if": $ifClause = $this->checkConditions($condAction->getElementsByTagName("condition"),$placeData["currentUser"]);
					if($ifClause) {
						$actionName = $condAction->getAttribute("name");
						$return["actions"][$actionName] = $this->processActionNode($condAction);
					}
					break;
					case "else-if": $elseIfClause = $this->checkConditions($condAction->getElementsByTagName("condition"),$placeData["currentUser"]);
					if(!$ifClause && $elseIfClause) {
						$actionName = $condAction->getAttribute("name");
						$return["actions"][$actionName] = $this->processActionNode($condAction);
					}
					break;
					case "else":
					if(!$ifClause && !$elseIfClause) {
						$actionName = $condAction->getAttribute("name");
						$return["actions"][$actionName] = $this->processActionNode($condAction);
					}
					break;
					}
				}
				break;
			}
		}
		return $return;
	}
	
	//builds up an array of the given action node
	public function processActionNode($node) {
		$ret = array("coords" => explode(" ",$node->getAttribute("coords")));
		foreach($node->childNodes as $action) {
			switch($action->nodeName) {
				case "execute":
					$execActions = array();
					foreach($action->childNodes as $execute) {
						if($execute->nodeType === XML_ELEMENT_NODE) {
							$params = array();
							if($execute->hasAttributes()) {
								foreach($execute->attributes as $param) {
									$params[$param->nodeName] = $param->nodeValue;
								}
							}
							$execActions[$execute->nodeName] = $params;
						}
					}
					$ret["execute"] = $execActions;
				break;
				case "hover": foreach($action->childNodes as $hover) {
					if($hover->nodeName === $this->lang)
						$ret["hover"] = $hover->nodeValue;
					}
				break;
				case "actionImage": 
					$actionImage = array();
					foreach($action->attributes as $imageData) {
						$actionImage[$imageData->nodeName] = $imageData->nodeValue;
					}
					$ret["actionImage"] = $actionImage;
				break;
			}
		}
		return $ret;
	}

	//checks conditions of a conditioned action
	//It needs the user data file in order to perform checks of user's memory or inventory
	public function checkConditions($conditionListNode,$user) {
		/*
			procedure flow: go through each condition list (each list is or-linked)
			go through each condition (they are and-linked within one element)
		*/
		$ret = false;
		//or-linked elements
		$outer = array();
		foreach($conditionListNode as $conditionList) {
			//and-linked elements
			$inner = array();
			foreach($conditionList->childNodes as $condition) {
				//distinct between condition types
				switch($condition->nodeName) {
					case "checkAction": $inMemory = in_array($condition->getAttribute("triggeredAction"),$user["memory"]["actionsPassed"]);
					$shouldInMemory = $condition->getAttribute("actionInMemory") === "true" ? true : false;
					if(($inMemory && $shouldInMemory) || (!$inMemory && !$actionInMemory))
						$inner[] = true;
					else $inner[] = false;
					break;
					case "checkItem": $items = array_column($user["inventory"],"id");				
					$inInventory = in_array($condition->getAttribute("triggeredItem"),$items);
					$shouldInInventory = $condition->getAttribute("itemInInventory") === "true" ? true : false;
					if(($inInventory && $shouldInInventory) || (!$inInventory && !$shouldInInventory))
						$inner[] = true;
					else $inner[] = false;
					break;
					case "checkTicketValidity": $inventory = array_column($user["inventory"],"id");
					$ticket = $user["inventory"][array_search($condition->getAttribute("triggeredTicket"),$inventory)];
					$ticketShouldValid = $condition->getAttribute("validity") === "true" ? true : false;
					if(($ticket["valid"] === "true" && $ticketShouldValid) || ($ticket["valid"] !== "true" && !$ticketShouldValid))
						$inner[] = true;
					else $inner[] = false;
					break;
					case "checkQuest": $quests = array_merge($user["memory"]["questsMandatory"],$user["memory"]["questsOptional"]);
					if($condition->getAttribute("questCompleted") !== "notAssigned" && in_array($condition->getAttribute("triggeredQuest"),array_column($quests,"questID"))) {
						$quest = $quests[array_search($condition->getAttribute("triggeredQuest"),$quests)];
						if($quest["completed"] === $condition->getAttribute("questCompleted") && !$condition->hasAttribute("currentChapter"))
							$inner[] = true;
						else if($quest["completed"] === "no" && $condition->getAttribute("currentChapter") === $quest["chapter"])
							$inner[] = true;
						else $inner[] = false;
					}
					else if($condition->getAttribute("completed") === "notAssigned" && !in_array($condition->getAttribute("triggeredQuest"),array_column($quests,"questID"))) {
						$inner[] = true;
					}
					else $inner[] = false;
					break;
					default: if($condition->nodeType === XML_ELEMENT_NODE)
					throw new ErrorException("Unimplemented control structure: ".$condition->nodeName); //forgotten implementation
					break;
				}
			}
			//if one all-linked condition is false, the whole clause is false
			$outer[] = in_array(false,$inner) ? false : true;
		}
		//iff all or-linked conditions are false, the whole clause is false
		$ret = in_array(true,$outer);
		return $ret;
	}
	
	//gets the map coordinates for a given station number
	public function getMapCoords($station) {
		$mapCoordsNode = $this->townXPath->query("//station[@number='$station']/@mapPointX|//station[@number='$station']/@mapPointY");
		$ret = array();
		foreach($mapCoordsNode as $mapCoord) {
			//array[0]: x, array[1]: y
			$ret[$mapCoord->nodeName] = $mapCoord->nodeValue;
		}
		return $ret;
	}
	
	//build up a form with the given ID and language
	public function getForm($formId,$lang) {
		$ret = array();
		$formNode = $this->townXPath->query('//form[@fname="'.$formId.'"][@lang="'.$lang.'"]');
		if($formNode->length > 0) {
			foreach($formNode->item(0)->childNodes as $form) {
				switch($form->nodeName) {
					case "textInput": $ret[] = array("type" => "textInput",
													 "id" => $form->getAttribute("label"),
													 "label" => $form->nodeValue,
													 "size" => $form->getAttribute("size"));
					break;
					case "radio": 
					case "checkbox": $select = array("type" => $form->nodeName,
													 "id" => $form->getAttribute("name"));
						$choice = array();
						foreach($form->childNodes as $child) {
							switch($child->nodeName) {
								case "label": $select["label"] = $child->nodeValue;
								break;
								case "choice": $choice[] = array("value" => $child->getAttribute("value"),"label" => $child->nodeValue);
								break;
							}
						}
						$select["choice"] = $choice;
						$ret[] = $select;
					break;
					case "finish": $ret[] = array("type" => "finish",
												  "label" => $form->getAttribute("label"),
												  "onclick" => "addUser");
					break;
				}
			}
		}
		return $ret;
	}
	
}
?>
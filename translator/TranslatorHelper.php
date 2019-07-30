<?php

class TranslatorHelper {

	private $townDoc;
	private $townXPath;
	private $idPrefix;
	private $townPath;
	
	//loads city data
	public function setTown($concerned){
		if (file_exists(ANALYSISCITY_PATH.$concerned.'.xml')){
			$this->townDoc = new DOMDocument();
			$this->townDoc->load(ANALYSISCITY_PATH.$concerned.'.xml');
			$this->townXPath = new DOMXPath($this->townDoc);
			$this->townDoc->schemaValidate(ANALYSISCITY_PATH.'town.xsd');
			$this->idPrefix = $this->townXPath->query('/town/@idPrefix')->item(0)->nodeValue;
			$this->townPath = ANALYSISCITY_PATH.$concerned.'.xml';
		}
		else if (!file_exists(ANALYSISCITY_PATH.$concerned.'.xml')){
			throw new ErrorException("Die Datei ".ANALYSISCITY_PATH.$concerned.".xml konnte nicht geladen werden!");
		}
	}
	
	//loads dialog data
	public function setDialog($dialogPath){
		$this->townDoc = new DOMDocument();
		$this->townDoc->load(ANALYSISCITY_PATH.$dialogPath.'.xml');
		$this->townXPath = new DOMXPath($this->townDoc);
		$this->townDoc->schemaValidate(ANALYSISCITY_PATH.'dialogData.xsd');
		$this->townPath = ANALYSISCITY_PATH.$dialogPath.'.xml';
	}
	
	//loads happening data
	public function setHappening($documentPath){
		$this->townDoc = new DOMDocument();
		$this->townDoc->load(ANALYSISCITY_PATH.$documentPath.'.xml');
		$this->townXPath = new DOMXPath($this->townDoc);
		$this->townDoc->schemaValidate(ANALYSISCITY_PATH.'happening.xsd');
		$this->townPath = ANALYSISCITY_PATH.$documentPath.'.xml';
	}
	
	//enters the data at the given place node
	/* to test in Oxygen:
	//station[@number='zd9999']/name|
	//station[@number='zd9999']/attribute::*|
	//station[@number='zd9999']/discoveryContent
	*/
	public function enterTranslation($translationData) {
		if(isset($translationData["town"])) {
			$this->setTown($translationData["town"]);
			if($translationData["field"] === "content") {
				$placeNode = $this->townXPath->query("//place[@id='".$translationData["place"]."']");
				if($placeNode->length === 0)
					return "false";
				else if($placeNode->length > 0) {
					$place = $placeNode->item(0);
					$contentNode = $this->townXPath->query("//place[@id='".$translationData["place"]."']/content/".$translationData["lang"]);
					if($contentNode->length === 0) {
						$content = $this->townDoc->createElement($translationData["lang"],$translationData["val"]);
						$contentParent = $place->getElementsByTagName("content");
						$contentParent->item(0)->appendChild($content);
					}
					else if($contentNode->length > 0) {
						$content = $contentNode->item(0);
						$content->nodeValue = $translationData["val"];
					}
				}
			}
			else if($translationData["field"] === "action") {
				$hoverNode = $this->townXPath->query("//place[@id='".$translationData["place"]."']/action[@name='".$translationData["action"]."']/hover/".$translationData["lang"]."|
													  //place[@id='".$translationData["place"]."']//if[@name='".$translationData["action"]."']/hover/".$translationData["lang"]."|
													  //place[@id='".$translationData["place"]."']//else-if[@name='".$translationData["action"]."']/hover/".$translationData["lang"]."|
													  //place[@id='".$translationData["place"]."']//else[@name='".$translationData["action"]."']/hover/".$translationData["lang"]);
				//echo $hoverNode->length;
				if($hoverNode->length === 0) {
					$hover = $this->townDoc->createElement($translationData["lang"],$translationData["val"]);
					$hoverParent = $this->townXPath->query("//place[@id='".$translationData["place"]."']/action[@name='".$translationData["action"]."']/hover|
															//place[@id='".$translationData["place"]."']//if[@name='".$translationData["action"]."']/hover|
															//place[@id='".$translationData["place"]."']//else-if[@name='".$translationData["action"]."']/hover|
															//place[@id='".$translationData["place"]."']//else[@name='".$translationData["action"]."']/hover");
					$hoverParent->item(0)->appendChild($hover);
				}
				else if($hoverNode->length > 0) {
					$hover = $hoverNode->item(0);
					$hover->nodeValue = $translationData["val"];
				}
			}
			if($this->save("town"))
				return "true";
		}
		else if(isset($translationData["dialog"])) {
			$this->setDialog($translationData["dialog"]);
			$speechNodeList = $this->townXPath->query('//answer[@id="'.$translationData["point"].'"]|//response[@id="'.$translationData["point"].'"]');
			if($speechNodeList->length > 0) {
				$speechNode = $speechNodeList->item(0);
				if($speechNode->getElementsByTagName($translationData["lang"])->length === 0) {
					$speech = $this->townDoc->createElement($translationData["lang"],$translationData["val"]);
					$speechNode->appendChild($speech);
				}
				else if($speechNode->getElementsByTagName($translationData["lang"])->length > 0) {
					$speech = $speechNode->getElementsByTagName($translationData["lang"])->item(0);
					$speech->nodeValue = $translationData["val"];
				}
				if($this->save("dialogData"))
					return "true";
			}
		}
		else if(isset($translationData["happening"])) {
			$this->setHappening($translationData["happening"]);
			$eventBody = $this->townXPath->query('//event[@id="'.$translationData["point"].'"]/eventBody/text');
			if($eventBody->length > 0) {
				$textNode = $eventBody->item(0);
				if($textNode->getElementsByTagName($translationData["lang"])->length === 0) {
					$text = $this->townDoc->createElement($translationData["lang"],$translationData["val"]);
					$textNode->appendChild($text);
				}
				else if($textNode->getElementsByTagName($translationData["lang"])->length > 0) {
					$text = $textNode->getElementsByTagName($translationData["lang"])->item(0);
					$text->nodeValue = $translationData["val"];
				}
				if($this->save("happening"))
					return "true";
			}
		}
		else return "false";
	}
	
	//retrieves all translations which have not been done yet
	public function getUndoneTranslations() {
		$ret = array("towns" => array(),
					 "dialogs" => array(),
					 "happenings" => array());
		$towns = array("zeidel","karlstadt","kvirasim");
		foreach($towns as $townName) {
			$this->setTown($townName);
			$town = array();
			$res = $this->townXPath->query("//place[not(@monolingual)]");
			foreach($res as $place) {
				$placeRet = array("content" => array(),
								  "actions" => array());
				foreach($place->getElementsByTagName("content")->item(0)->childNodes as $content) {
					if($content->nodeType === XML_ELEMENT_NODE)
						$placeRet["content"][$content->nodeName] = str_ireplace("!NL","\n",$content->nodeValue);
				}
				$actionBulk = array();
				foreach($place->getElementsByTagName("action") as $a) {
					$actionBulk[] = $a;
				}
				foreach($place->getElementsByTagName("if") as $ifN) {
					$actionBulk[] = $ifN;
				}
				foreach($place->getElementsByTagName("else-if") as $elif) {
					$actionBulk[] = $elif;
				}
				foreach($place->getElementsByTagName("else") as $elseN) {
					$actionBulk[] = $elseN;
				}
				foreach($actionBulk as $action) {
					$actionRet = array();
					foreach($action->getElementsByTagName("hover")->item(0)->childNodes as $hover) {
						if($hover->nodeType === XML_ELEMENT_NODE)
							$actionRet[$hover->nodeName] = $hover->nodeValue;
					}
					$placeRet["actions"][$action->getAttribute("name")] = $actionRet;
				}
				$town[$place->getAttribute("id")] = $placeRet;
			}
			$ret["towns"][$townName] = $town;
		}
		$dialogs = array("zeidel_dialog","karlstadt_dialog");
		foreach($dialogs as $dialogName) {
			$dialog = array();
			$this->setDialog($dialogName);
			$nodeList = $this->townXPath->query("//answer|//response");
			foreach($nodeList as $res) {
				$speechNode = array();
				foreach($res->childNodes as $speech) {
					if($speech->nodeType === XML_ELEMENT_NODE)
						$speechNode[$speech->nodeName] = $speech->nodeValue;
				}
				$dialog[$res->getAttribute("id")] = $speechNode;
			}
			$ret["dialogs"][$dialogName] = $dialog;
		}
		$happenings = array("zeidel_stadtbahn","zvw_intervilles","kvirasim_kvb","karlstadt_kvag");
		foreach($happenings as $happeningName) {
			$happening = array();
			$this->setHappening($happeningName);
			$event = $this->townXPath->query("//event[eventBody/text]");
			foreach($event as $eventBody) {
				$eventNode = array();
				foreach($eventBody->getElementsByTagName("text")->item(0)->childNodes as $text) {
					if($text->nodeType === XML_ELEMENT_NODE)
						$eventNode[$text->nodeName] = $text->nodeValue;
				}
				$happening[$eventBody->getAttribute("id")] = $eventNode;
			}
			$ret["happenings"][$happeningName] = $happening;
		}
		return $ret;
	}
	
	// dump the town database
	public function save($validationData) {
		if($this->townDoc->schemaValidate(ANALYSISCITY_PATH."$validationData.xsd")) {
			$this->preserveWhiteSpace = false;
			$this->formatOutput = true;
			return $this->townDoc->save($this->townPath);
		}
		else return false;
	}
}
?>
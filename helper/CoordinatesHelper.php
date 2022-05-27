<?php

class CoordinatesHelper {

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
		//resolve prefix
		else if (preg_match("/\A[a-z]{2}\z/",$concerned) > 0) {
			$this->townDoc = new DOMDocument();
			switch($concerned) {
			case "zd": $this->townDoc->load(ANALYSISCITY_PATH.'zeidel.xml');
			break;
			case "kv": $this->townDoc->load(ANALYSISCITY_PATH.'kvirasim.xml');
			break;
			case "ka": $this->townDoc->load(ANALYSISCITY_PATH.'karlstadt.xml');
			break;
			}
			$this->townXPath = new DOMXPath($this->townDoc);
			$this->townDoc->schemaValidate(ANALYSISCITY_PATH.'town.xsd');
			$this->idPrefix = $concerned;
		}
		else if (!file_exists(ANALYSISCITY_PATH.$concerned.'.xml')){
			throw new ErrorException("Die Datei ".ANALYSISCITY_PATH.$concerned.".xml konnte nicht geladen werden!");
		}
	}
	
	//enters the data at the given place node
	/* to test in Oxygen:
	//station[@number='zd9999']/name|
	//station[@number='zd9999']/attribute::*|
	//station[@number='zd9999']/discoveryContent
	*/
	public function enterCoordinates($coordinatesData) {
		$this->setTown($coordinatesData["town"]);
		$actionNode = $this->townXPath->query("//place[@id='".$coordinatesData["place"]."']/action[@name='".$coordinatesData["actionName"]."']");
		if($actionNode->length === 0)
			return false;
		else if($actionNode->length > 0) {
			$action = $actionNode->item(0);
			$action->setAttribute("coords",$coordinatesData["coordinates"]);
			return $this->save();
		}
	}
	
	//retrieves all actions which have not been assigned yet
	public function getUnassignedActions($town) {
		$this->setTown($town);
		$ret = array();
		$res = $this->townXPath->query("//place[action/@coords='0.0,0.0 0.0,0.0 0.0,0.0 0.0,0.0']");
		foreach($res as $place) {
			$ret[$place->getAttribute("id")] = array();
			foreach($place->getElementsByTagName("action") as $action) {
				if($action->getAttribute("coords") === '0.0,0.0 0.0,0.0 0.0,0.0 0.0,0.0') {
					$ret[$place->getAttribute("id")][$action->getAttribute("name")] = $place->getElementsByTagName("imagePath")->item(0)->nodeValue;
				}
			}
		}
		return $ret;
	}
	
	// dump the user database
	public function save() {
		if($this->townDoc->schemaValidate(ANALYSISCITY_PATH."town.xsd")) {
			$this->preserveWhiteSpace = false;
			$this->formatOutput = true;
			return $this->townDoc->save($this->townPath);
		}
		else return false;
	}
}
?>
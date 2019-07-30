<?php

class TownData {

	var $document;
	var $idPrefix;
	var $xpath;
	
	function TownData($townPath){
		$this->document = new DOMDocument();
		$this->document->load($townPath);
		$this->xpath = new DOMXPath($this->document);
		$this->document->schemaValidate('town.xsd');
		$this->idPrefix = $this->xpath->query('/town/@idPrefix')->item(0)->nodeValue;
	}

}

?>
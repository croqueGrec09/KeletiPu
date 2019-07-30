<?php

class userDB {

	var $document;
	var $xpath;
	
	function userDB(){
		$this->document = new DOMDocument();
		$this->document->load('userData.xml');
		$this->xpath = new DOMXPath($this->document);
		$this->document->schemaValidate('userData.xsd');
	}
	
	function save(){
		return $this->document->save('userData.xml');
	}
	
}

?>
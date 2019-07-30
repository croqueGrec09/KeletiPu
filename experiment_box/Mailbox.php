<?php

class Mailbox {

	private $document;
	private $xPath;

	function Mailbox($xmlString){
		$this->document = new DOMDocument($xmlString);
		$this->document->schemaValidate("letterbox.xsd");
		$this->xPath = new DOMXPath($this->document);
	}

}

?>
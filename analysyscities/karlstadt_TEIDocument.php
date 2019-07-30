<?php
//Vom Text-Encoding-Consortium in Zeidel vorgeschriebene Richtlinie zur Ausgabe von TEI-Dokumenten.
//Bei Beschwerde schreiben Sie an: Text-Encoding-Consortium, Sebaldusstraße 876, ZD-1000 Zeidel 66
class TEIDocument{
	
	var $document;
	var $docId;
	var $xpath;
	
	function TEIDocument($docPath,$docId){
		$this->document = new DOMDocument();
		$this->document->load($docPath);
		$this->xpath = new DOMXPath($this->document);
		$this->xpath->registerNamespace('tei','http://www.tei-c.org/ns/1.0');
		$this->docId = $docId;
	}
	
}

?>
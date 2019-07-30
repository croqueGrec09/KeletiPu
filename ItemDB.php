<?php
/*
	This is the item data base class; containing the DOMDocument with the item details and a DOMXPath for querying the document.
	It contains methods to retrieve item details, item class and default validity.
	
	current version: 0.701 from July 7th, 2018
	
	author: András Gálffy, andrisgalffy@gmail.com, matricula number #5584124
*/

class ItemDB {

	//the DOMDocument field
	var $document;
	//the DOMXPath attached to the document
	var $xpath;
	
	//set up item base and attach DOMXPath
	public function __construct(){
		$this->document = new DOMDocument();
		$this->document->load('itemList.xml');
		$this->xpath = new DOMXPath($this->document);
		$this->document->schemaValidate('item.xsd');
	}
	
	//gets the details for a given item in the given language
	public function getItemDescription($itemID,$lang) {
		//initialise return array with name, id, description, item class, countability flag and validity flag
		//name and description in given language
		$ret = array("name" => $this->xpath->query("//item[@id='$itemID']/name/$lang")->item(0)->nodeValue,
					 "id" => $itemID,
					 "description" => nl2br($this->xpath->query("//item[@id='$itemID']/description/$lang")->item(0)->nodeValue),
					 "itemClass" => $this->xpath->query("//item[@id='$itemID']/@itemClass")->item(0)->nodeValue,
					 "countable" => $this->xpath->query("//item[@id='$itemID']/@countable")->item(0)->nodeValue,
					 "valid" => $this->xpath->query("//item[@id='$itemID']/@valid")->item(0)->nodeValue);
		//process optional details, in this case, a map file for a map item
		$mapFileNode = $this->xpath->query("//item[@id='$itemID']/mapFile");
		//attach details to return array
		if($mapFileNode->length > 0) {
			$ret["mapFile"] = $mapFileNode->item(0)->nodeValue;
			$ret["forTown"] = $mapFileNode->item(0)->getAttribute("forTown");
		}
		return $ret;
	}
	
	//gets the class for a given item
	public function getItemClass($itemID) {
		return $this->xpath->query("//item[@id='$itemID']/@itemClass")->item(0)->nodeValue;
	}
	
	//gets the default validity for a given item
	public function getItemDefaultValidity($itemID) {
		return $this->xpath->query("//item[@id='$itemID']/@valid")->item(0)->nodeValue;
	}

}

?>
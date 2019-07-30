<?php

class XMLTester {

	private $document;
	private $xpath;
	
	//gets the current town data
	public function __construct(){
		$this->document = new DOMDocument();
		$this->document->load(ANALYSISCITY_PATH.'zeidel_dialog.xml');
		$this->xpath = new DOMXPath($this->document);
		$this->document->schemaValidate(ANALYSISCITY_PATH.'dialogData.xsd');
	}

	//tests empty element replacal
	public function emptyElemReplacalTest() {
		$person = "TelegrapheGroupA1";
		$stream = "0";
		$point = "0";
		$responseNode = $this->xpath->query("//person[@id='$person']/stream[@id='$stream']/point[@id='$point']/action[1]/response")->item(0);
		//adapt from here
		$useName = true; //getter to user
		$responseText = "";
		foreach($responseNode->childNodes as $responseDetail) {
			switch($responseDetail->nodeName) {
				case "userName": 
					if($useName)
						$responseText .= "Apolline Pernet";
					else
						$responseText .= "cérise91";
				break;
				default: $responseText .= $responseDetail->nodeValue;
				break;
			}
		}
		return array("response" => $responseText);
	}
	
}

?>
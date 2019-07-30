<?php
/*
	This is the object representation for the quest base. It contains a DOMDocument which is traversable via DOMXPath just as 
	methods to retrieve quest details.
	
	current version: 0.701 from July 7th, 2018
	
	author: András Gálffy, andrisgalffy@gmail.com, matricula number #5584124
*/

class Quest {

	//DOMDocument field
	var $document;
	//the DOMXPath attached to the document
	var $xpath;
	
	//initialise quest document and attach DOMXPath to it
	public function __construct(){
		$this->document = new DOMDocument();
		$this->document->load('questList.xml');
		$this->xpath = new DOMXPath($this->document);
		$this->document->schemaValidate('questData.xsd');
	}
	
	//gets the details for a given quest at a given chapter for a given language
	public function getQuestData($questID,$chapter,$lang) {
		//set up base query string with given quest ID
		$queryBase = "//quest[@id='$questID']";
		//initialise return array with name and mandatoryness
		$ret = array("name" => $this->xpath->query("$queryBase/name/$lang")->item(0)->nodeValue,
					 "questRequired" => $this->xpath->query("$queryBase/parent::*")->item(0)->nodeName);
		//get quest details node
		$questDetailsNode = $this->xpath->query("$queryBase/chapter[@n='$chapter']/descendant::*");
		//process child nodes and append to return array
		foreach($questDetailsNode as $questDetail) {
			switch($questDetail->nodeName) {
				case $lang: $ret["description"] = nl2br($questDetail->nodeValue);
				break;
				case "place": $ret[$questDetail->nodeName] = $questDetail->nodeValue;
				break;
			}
		}
		return $ret;
	}
	
	//get the reward for a given quest in a given language
	public function getQuestReward($questID,$lang) {
		//set up base query path for given quest ID
		$queryBase = "//quest[@id='$questID']";
		//get reward node
		$rewardNode = $this->xpath->query("$questBase/reward/child::*");
		//initialise return array with the name in the given language
		$ret = array("name" => $this->xpath->query("$questBase/name/$lang"));
		//set up reward actions
		$rewards = array();
		if($rewardNode->length > 0) {
			//process reward child elements
			foreach($rewardNode->childNodes as $reward) {
				switch($reward->nodeName) {
				case "item": $rewards[] = array("addItem" => $reward->nodeValue);
				break;
				case "money": $rewards[] = array("addMoney" => $reward->nodeValue);
				break;
				}
			}
		}
		//attach rewards to return array
		$ret["rewards"] = $rewards;
		return $ret;
	}
	
	//get the reward for a given chapter in a given quest
	public function getChapterReward($questID,$chapter) {
		//get the requested node
		$rewardNode = $this->xpath->query("//quest[@id='$questID']/chapter[@n='$chapter']/reward/child::*");
		//set up return array
		$ret = array();
		if($rewardNode->length > 0) {
			//process children of reward node
			foreach($rewardNode->childNodes as $reward) {
				switch($reward->nodeName) {
				case "item": $ret[] = array("addItem" => $reward->nodeValue);
				break;
				case "money": $ret[] = array("addMoney" => $reward->nodeValue);
				break;
				}
			}
		}
		return $ret;
	}

	//get failure details for a given quest
	public function getQuestFailure($questID,$lang) {
		//get the requested node
		$queryBase = "//quest[@id='$questID']";
		//get failure node
		$failureNode = $this->xpath->query("$questBase/fail/child::*");
		//set up return array with the quest name in the given language
		$ret = array("name" => $this->xpath->query("$questBase/name/$lang"));
		$penalties = array();
		if($failureNode->length > 0) {
			//process failure node details
			foreach($failureNode->childNodes as $penalty) {
				switch($penalty->nodeName) {
 				case "item": $penalties[] = array("removeItem" => $penalty->nodeValue);
				break;
				case "money": $penalties[] = array("deductMoney" => $penalty->nodeValue);
				break;
				}
			}
		}
		//attach penalties to return array
		$ret["penalties"] = $penalties;
		return $ret;
	}
	
}

?>
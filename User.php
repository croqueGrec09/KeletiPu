<?PHP
/*
	This is the server-side representation of the currently playing user. It stores the user data base, ready for query processing, 
	and builds upon request the complete node as an associative array.
	
	version 0.701 from July 7th, 2018
	
	author: András Gálffy, andrisgalffy@gmail.com, matricula number #5584124
*/

// regex for associative array replacal: user\[\"$1\"\]
class User {
	
	//DOMDocument field
	private $document;
	//XPath object for DOMDocument traversal
	private $xpath;
	//user name
	private $user;
	
	//constructor which checks if the user data file exists and if it is valid
	public function __construct(){
		if (file_exists('userData.xml')){
			//load and validate XML file, register DOMXPath for query processing
			$this->document = new DOMDocument();
			$this->document->load('userData.xml');
			$this->xpath = new DOMXPath($this->document);
			$this->document->schemaValidate('userData.xsd');
		}
		else if (!file_exists('userData.xml'))
			throw new ErrorException('Die Benutzerdaten können nicht geladen werden!');
	}
	
	// assigns the given user name to the object
	public function setUser($user) {
		$this->user = $user;
	}
	
	// gets the current user node
	public function getUser() {
		$currUserNode = $this->xpath->query('//user[@name="'.$this->user.'"]/descendant-or-self::*');
		/*
			Build up server-side user object representation. The array represents the XML node in the user data file
		*/
		$currUser = array();
		//general node processing loop
		foreach($currUserNode as $node){
			switch($node->nodeName) {
				case "user": 
					$currUser["username"] = $node->getAttribute("name");
					$currUser["lang"] = $node->getAttribute("userLang");
					$currUser["useName"] = $node->getAttribute("useName");
				break;
				case "inventory":
					$inventory = array();
					foreach($node->getElementsByTagName("item") as $item) {
						$itemData = array("id" => $item->getAttribute("id"),
										  "valid" => $item->getAttribute("valid"));
						$inventory[] = $itemData;
					}
					$currUser["inventory"] = $inventory;
				break;
				case "memory":
					$mapNotes = array();
					$notebookNotes = array();
					$actionsPassed = array();
					$questsMandatory = array();
					$questsOptional = array();
					$townsToVisit = array();
					foreach($node->childNodes as $child) {
						if($child->nodeType === 1) {
							switch($child->nodeName) {
								case "notes": 
									foreach($child->getElementsByTagName("map") as $map) {
										$forMap = $map->getAttribute("city");
										foreach($map->getElementsByTagName("note") as $mapNoteNode) {
											$mapNotes[$mapNoteNode->getAttribute("noteTitle")] = array(
																"noteContent" => $mapNoteNode->nodeValue,
																"pointX" => $mapNoteNode->getAttribute("x"),
																"pointX" => $mapNoteNode->getAttribute("y"),
																"forMap" => $forMap);
										}
									}
									foreach($child->getElementsByTagName("note") as $notebookNoteNode) {
										$notebookNotes[$notebookNoteNode->getAttribute("noteTitle")] = $notebookNoteNode->nodeValue;
									}
								break;
								case "actionsPassed":
									foreach($child->getElementsByTagName("action") as $passed) {
										$actionsPassed[] = $passed->getAttribute("name");
									}
								break;
								case "questsMandatory":
									foreach($child->getElementsByTagName("quest") as $questNode) {
										$questsMandatory[] = array("questID" => $questNode->nodeValue,
																   "chapter" => $questNode->getAttribute("currChapter"),
																   "completed" => $questNode->getAttribute("completed"));
									}
								break;
								case "questsOptional":
									foreach($child->getElementsByTagName("quest") as $questNode) {
										$questsOptional[] = array("questID" => $questNode->nodeValue,
																  "chapter" => $questNode->getAttribute("currChapter"),
																  "completed" => $questNode->getAttribute("completed"));
									}
								break;
								case "townsToVisit":
									foreach($child->getElementsByTagName("townToVisit") as $townToVisit) {
										$townsToVisit[] = $townToVisit->nodeValue;
									}
								break;
							}	
						}
					}
					$memory = array("mapNotes" => $mapNotes,
									"notebookNotes" => $notebookNotes,
									"actionsPassed" => $actionsPassed,
									"questsMandatory" => $questsMandatory,
									"questsOptional" => $questsOptional,
									"townsToVisit" => $townsToVisit);
					$currUser["memory"] = $memory;
				break;
				case "love":
					$loveInterests = array();
					foreach($node->childNodes as $love) {
						if($love->nodeType === 1) {
							switch($love->nodeName){
								case "sex": $currUser["gender"] = $love->nodeValue;
								break;
								case "loveInterest": $loveInterests[] = $love->nodeValue;
								break;
							}
						}
					}
					$currUser["loveInterests"] = $loveInterests;
				break;
				case "currentPlace":
					$childData = array();
					foreach($node->childNodes as $child) {
						if($child->nodeType === 1)
							$childData[$child->nodeName] = $child->nodeValue;
					}
					$currUser[$node->nodeName] = $childData;
				break;
				case "firstname":
				case "lastname":
				case "currentMoney":
					$currUser[$node->nodeName] = $node->nodeValue;
				break;
			}
		}
		return $currUser;
	}
	
	// checks whether the given user name exists
	public function checkUserName($user) {
		$userNameLength = $this->xpath->query('//user[@name="'.$user.'"]')->length;
		//return as string for it may be processed on client side with identity check
		if($userNameLength > 0)
			return "true";
		else return "false";
	}
	
	// updates the user's current place
	public function setPlace($place) {
		//get place node
		$placeNode = $this->xpath->query("//user[@name='$this->user']/currentPlace/child::*");
		//register new data
		foreach($placeNode as $node) {
			if($node->nodeType === 1 && isset($place[$node->nodeName])) {
				$node->nodeValue = $place[$node->nodeName];
			}
		}
		//confirm place node update
		return $this->save();
	}
	
	// updates the user's current language
	public function setLang($lang) {
		$langNode = $this->xpath->query("//user[@name='$this->user']/@userLang")->item(0);
		$langNode->nodeValue = $lang;
		return $this->save();
	}
	
	// get the user's language
	public function getLang() {
		return $this->xpath->query("//user[@name='$this->user']/@userLang")->item(0)->nodeValue;
	}
	
	// updates the user's current money amount
	public function setMoney($amount) {
		$moneyNode = $this->xpath->query("//user[@name='$this->user']/currentMoney")->item(0);
		$moneyNode->nodeValue = (int) $amount;
		//in case of success, return new amount
		if($this->save())
			return array("amount" => $moneyNode->nodeValue);
	}
	
	// gets the current money of the user
	public function getMoney() {
		return $this->xpath->query("//user[@name='$this->user']/currentMoney")->item(0)->nodeValue;
	}
	
	// gets the user's appellation, depending on his/her choice
	public function getAppellation() {
		//gets the user's appellation choice. This choice is done on registration
		$useNameNodeList = $this->xpath->query("//user[@name='$this->user']/@useName|//user[@name='$this->user']/@userLang");
		$useName = $useNameNodeList->item(0)->nodeValue;
		$ret = "";
		if($useName) {
			$nameNode = $this->xpath->query("//user[@name='$this->user']/firstname|//user[@name='$this->user']/lastname");
			//Hungarians give their surname first
			if($useNameNodeList->item(1)->nodeValue === "hu") {
				$ret = $nameNode->item(1)->nodeValue." ".$nameNode->item(0)->nodeValue;
			}
			else {
				$ret = $nameNode->item(0)->nodeValue." ".$nameNode->item(1)->nodeValue;
			}
		}
		else {
			$ret = $this->user;
		}
		return $ret;
	}
	
	// adds an item to the user's inventory
	public function addItem($itemData) {
		//get current inventory node
		$inventoryNode = $this->xpath->query("//user[@name='$this->user']/inventory")->item(0);
		//create item element and add attributes
		$newItem = $this->document->createElement("item");
		$newItem->setAttribute("id",$itemData["id"]);
		$newItem->setAttribute("valid",$itemData["valid"]);
		//add new item element as inventory child
		$inventoryNode->appendChild($newItem);
		//confirm adding
		return $this->save();
	}
	
	// removes an item from the user's inventory
	public function removeItem($itemID) {
		//get current inventory node
		$inventoryNode = $this->xpath->query("//user[@name='$this->user']/inventory")->item(0);
		//loop through item children and remove child iff current child's ID matches the given item ID
		foreach($inventoryNode as $item) {
			if($item->getAttribute("id") === $itemID)
				$inventoryNode->removeChild($item);
		}
		return $this->save();
	}
	
	// inserts the given note into the user data file. If it does not exist, it will be created
	public function updateNotebookNote($noteData) {
		foreach($noteData as $key => $note) {
			//check if note exists
			$noteNode = $this->xpath->query("//user[@name='$this->user']//notebookNotes/note[@noteTitle='$key']");
			if($noteNode->length > 0) {
				$newNote = $noteNode->item(0);
				$newNote->nodeValue = $note;
			}
			else if($noteNode->length === 0) {
				$noteRoot = $this->xpath->query("//user[@name='$this->user']//notebookNotes")->item(0);
				$newNote = $this->document->createElement("note",$note);
				$newNote->setAttribute("noteTitle",$key);
				$noteRoot->appendChild($newNote);
			}
		}
		return $this->save();
	}
	
	// removes the given note from the given user file
	public function deleteNotebookNote($key) {
		//find the given note by its title
		$noteNode = $this->xpath->query("//user[@name='$this->user']//notebookNotes");
		//if note has been found, pop it
		foreach($noteNode->childNodes as $note) {
			if($note->nodeName === "note" && $note->getAttribute("noteTitle") === $key)
				$noteNode->removeChild($note);
		}
		//confirm deletion
		return $this->save();
	}
	
	// removes validity of a given ticket
	public function validateTicket($ticketID) {
		//get requested item in user's inventory
		$ticketNode = $this->xpath->query("//user[@name='$this->user']//item[@id='$ticketID']")->item(0);
		//set validity flag to false
		$ticketNode->setAttribute("valid","false");
		return $this->save();
	}
	
	// checks the user's inventory for a given item
	public function checkInventory($itemID) {
		//query which retrieves the given item element by its ID
		$itemCount = $this->xpath->query("//user[@name='$this->user']/inventory/item[@id='$itemID']");
		//since DOMXPath::query retrieves a DOMNodeList, the length of this list has to be checked 
		//in case of failure, an empty list is being returned
		if($itemCount->length > 0)
			return "true";
		else return "false";
	}
	
	// adds an action to the user's memory
	public function addActionPassed($action) {
		//get passed actions node
		$actionMemoryNode = $this->xpath->query("//user[@name='$this->user']//actionsPassed")->item(0);
		//create action element and set attributes
		$newAction = $this->document->createElement("action");
		$newAction->setAttribute("name",$action);
		//add child to passed actions
		$actionMemoryNode->appendChild($newAction);
		//confirm insertion
		return $this->save();
	}
	
	// remove an action from the user's memory
	public function removeActionPassed($action) {
		//find requested action node by its name
		$actionNode = $this->xpath->query("//user[@name='$this->user']//actionsPassed/action[@name='$action']")->item(0);
		//pop this node
		$this->document->removeChild($actionNode);
		//confirm removal
		return $this->save();
	}
	
	// adds a new quest to the user's memory
	public function addQuest($questRequired,$questID) {
		$questListNode = null;
		//distinct between quest necessity status, load appropriate container node
		if($questRequired === "mandatory") {
			$questListNode = $this->xpath->query("//user[@name='$this->user']//questsMandatory")->item(0);
		}
		else if($questRequired === "optional") {
			$questListNode = $this->xpath->query("//user[@name='$this->user']//questsOptional")->item(0);
		}
		else {
			var_dump($questRequired); //forgotten or erroneous implementation
		}
		//create quest element and define attributes
		$questNode = $this->document->createElement("quest",$questID);
		//since this is a new quest, the first chapter has to be retrieved
		$questNode->setAttribute("currChapter",1);
		$questNode->setAttribute("completed","no");
		//append quest to container node
		$questListNode->appendChild($questNode);
		//confirm insertion
		return $this->save();
	}
	
	// updates a new quest in the user's memory
	public function updateQuest($questID,$chapter) {
		//retrieve quest node in user's memory
		$questNode = $this->xpath->query("//user[@name='$this->user']//quest[.='$questID']");
		//if quest is found, set chapter to given chapter number, else, do nothing
		if($questNode->length > 0)
			$questNode->item(0)->setAttribute("currChapter",$chapter);
		//confirm saving
		return $this->save();
	}
	
	// completes a new quest in the user's memory
	public function completeQuest($questID,$success) {
		//get quest node from user's memory
		$questNode = $this->xpath->query("//user[@name='$this->user']//quest[.='$questID']");
		//if quest has been found ...
		if($questNode->length > 0) {
			//... set completion flag to given value
			if($success)
				$questNode->item(0)->setAttribute("completed","yes");
			else if(!$success)
				$questNode->item(0)->setAttribute("completed","failed");
		}
		//confirm completion
		return $this->save();
	}
	
	// adds a new user to the user database
	public function addUser($newUser) {
		//get user data root
		$userRoot = $this->xpath->query("/userData")->item(0);
		//create element
		$userNode = $this->document->createElement("user");
		//set attributes from the submitted form array
		$userNode->setAttribute("name",$newUser["username"]);
		$userNode->setAttribute("userLang",$newUser["lang"]);
		$userNode->setAttribute("useName",$newUser["useName"]);
		$userRoot->appendChild($userNode);
		$firstname = $this->document->createElement("firstname",$newUser["firstname"]);
		$userNode->appendChild($firstname);
		$lastname = $this->document->createElement("lastname",$newUser["lastname"]);
		$userNode->appendChild($lastname);
		$love = $this->document->createElement("love");
		$userNode->appendChild($love);
		foreach($newUser["loveInterests"] as $loveInterest) {
			$li = $this->document->createElement("loveInterest",$loveInterest);
			$love->appendChild($li);
		}
		$gender = $this->document->createElement("sex",$newUser["gender"]);
		$love->appendChild($gender);
		$currentMoney = $this->document->createElement("currentMoney",$newUser["currentMoney"]);
		$userNode->appendChild($currentMoney);
		$currentPlace = $this->document->createElement("currentPlace");
		$userNode->appendChild($currentPlace);
		//this is the first place for every new registration; it will be read off after user insertion
		$newUser["currentPlace"] = array("town" => "zeidel",
										 "number" => 0,
										 "place" => "placeB");
		foreach($newUser["currentPlace"] as $key => $value) {
			$currentPlace->appendChild($this->document->createElement($key,$value));
		}
		//create user's inventory and insert every item which has been picked up already as TestPerson
		$inventory = $this->document->createElement("inventory");
		$userNode->appendChild($inventory);
		foreach($newUser["inventory"] as $item) {
			$itemNode = $this->document->createElement("item");
			$itemNode->setAttribute("id",$item["id"]);
			$itemNode->setAttribute("valid",$item["valid"]);
			$inventory->appendChild($itemNode);
		}
		//do the same with the memory: create memory root, container and insert all actions memorised as TestPerson
		$memory = $this->document->createElement("memory");
		$userNode->appendChild($memory);
		//set up notebook storage
		$notesRoot = $this->document->createElement("notes");
		$memory->appendChild($notesRoot);
		$mapNotes = $this->document->createElement("mapNotes");
		$notesRoot->appendChild($mapNotes);
		$notebookNotes = $this->document->createElement("notebookNotes");
		$notesRoot->appendChild($notebookNotes);
		$actionsPassed = $this->document->createElement("actionsPassed");
		$memory->appendChild($actionsPassed);
		foreach($newUser["actionsPassed"] as $actionPassed) {
			$action = $this->document->createElement("action");
			$action->setAttribute("name",$actionPassed);
			$actionsPassed->appendChild($action);
		}
		//create quest containers
		$questsMandatory = $this->document->createElement("questsMandatory");
		$memory->appendChild($questsMandatory);
		$questsOptional = $this->document->createElement("questsOptional");
		$memory->appendChild($questsOptional);
		//create town visiting list (so the list of subjects the player wants to learn/visit/revise)
		$townsToVisit = $this->document->createElement("townsToVisit");
		$memory->appendChild($townsToVisit);
		$townsToVisit->appendChild($this->document->createElement("townToVisit","zeidel"));
		foreach($newUser["townsToVisit"] as $town) {
			$townNode = $this->document->createElement("townToVisit",$town);
			$townsToVisit->appendChild($townNode);
		}
		//try to dump DOMDocument to user data
		if($this->save()) {
			//on success, return the user object with the new place
			return $newUser;
		}
		else return false; //some error occured
	}
	
	// clears the memory and the inventory of the test user
	public function clearMemory() {
		//get inventory node ...
		$inventoryNode = $this->xpath->query("//user[@name='TestPerson']/inventory")->item(0);
		foreach($inventoryNode->getElementsByTagName("item") as $item) {
			//remove all items except the rucksack (which is needed to store items in and may be lost during the game!)
			if($item->getAttribute("id") !== "bag")
				$inventoryNode->removeChild($item);
		}
		$actionMemoryNode = $this->xpath->query("//user[@name='TestPerson']//actionsPassed")->item(0);
		foreach($actionMemoryNode->getElementsByTagName("action") as $action) {
			//remove all retained actions so that upon a new game, all fields are accessible again
			$actionMemoryNode->removeChild($action);
		}
		return $this->save();
	}
	
	// dump the user database
	public function save() {
		//validate document before dump so that errors upon insertion or update are found
		if($this->document->schemaValidate("userData.xsd")) {
			//set some saving options
			$this->preserveWhiteSpace = false;
			$this->formatOutput = true;
			//upon success, write updated user data file to file 
			//to make this function work, the server needs writing permissions to the file
			return $this->document->save('userData.xml');
		}
		else return false;
	}

}
?>
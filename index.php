<?php
/*
	Keleti pályaudvar - the game
	main server side controller
	
	version 0.701 from 7th July 2018
	author: András Gálffy, andrisgalffy@gmail.com, matricula number: 5584124
	
	list of do's (also for classes): ##2XX, next is #203
	
	This controller uses the Slim PHP framework (initiated by composer) to serve game data according to the Model-View-Controller 
	principle.
	
	For station number definitions and town prefixes, see the city XML files
*/

//php internal settings
/*
	error reporting. For good coding, it has to be active all time, because even PHP_NOTICEs may cause severe malfunctions later, 
	so instead of suppressing them, fix the bugs
*/
error_reporting(E_ALL);
ini_set("display_errors", true);
//since the developer sits in Cologne ...
date_default_timezone_set('Europe/Berlin');
//main path of the analysis city data
define("ANALYSISCITY_PATH","analysyscities/");

//register Request/Response interfaces
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;

//load classes, done by Slim PHP
require __DIR__ . '/vendor/autoload.php';
spl_autoload_register(function($classname) {
	require_once('Town.php');
	require_once('User.php');
	require_once('ItemDB.php');
	require_once('Dialog.php');
	require_once('Happening.php');
	require_once('Quest.php');
});
//define config params
$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

//container for dependencies and global registers
$container = new \DI\Container();
AppFactory::setContainer($container);

//create app
$app = AppFactory::create();
$app->setBasePath("/Keleti_pu");
$container = $app->getContainer();

//global server-wide parameters
//the town class
$container->set('town', function (\Psr\Container\ContainerInterface $container) {
	//Town class: an abstract singleton; the concrete city data is loaded when calling the setTown() method
	$town = new Town();
	return $town;
});
//the user class
$container->set('user', function (\Psr\Container\ContainerInterface $container) {
	$user = new User();
	return $user;
});
//the item database
$container->set('item', function (\Psr\Container\ContainerInterface $container) {
	$item = new ItemDB();
	return $item;
});
//the happening class
$container->set('happening', function (\Psr\Container\ContainerInterface $container) {
	$happening = new Happening();
	return $happening;
});
//the dialog class
$container->set('dialog', function (\Psr\Container\ContainerInterface $container) {
	$dialog = new Dialog();
	return $dialog;
});
//the quest class
$container->set('quest', function (\Psr\Container\ContainerInterface $container) {
	$quest = new Quest();
	return $quest;
});

//request handling section
/*
	Each request has the same structure: hand with the route a request and a response object (PSR-7) and return the response object.
	In most cases, a JSON object is returned. In case of an error, a Response body is being returned with HTTP status code 500.
	
	what may differ: GET vs. POST handling
*/

//check app up-state
$app->get('/', function (Request $request, Response $response) {
	$newResponse = $response->withStatus(200);
	$body = $newResponse->getBody();
	$body->write("Up state O.K.");
	return $newResponse;
});

//select language to play with
$app->get('/initGame', function (Request $request, Response $response) {
	$town = $this->get('town');
	try {
		//move to language chooser field (station #zd9999)
		$town->setTown(ANALYSISCITY_PATH."zeidel");
		$nextPlace = $town->getPlace(array("number" => 9999,"place" => "languageChooser","lang" => "en","mode" => "discoveryContent"));
		return $response->withJson($nextPlace);
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//start game after picking a language
$app->get('/startGame/{lang}', function (Request $request, Response $response) {
	$town = $this->get('town');
	try {
		//move player to German or French intro field (stations #zd9998 or #zd9996 respectively)
		$town->setTown(ANALYSISCITY_PATH."zeidel");
		switch($request->getAttribute("lang")){
			case "de": $nextPlaceData = array("number" => 9998,"place" => "introde","lang" => "de","mode" => "discoveryContent");
			break;
			case "fr": $nextPlaceData = array("number" => 9996,"place" => "introfr","lang" => "fr","mode" => "discoveryContent");
			break;
			case "en": $nextPlaceData = array("number" => 9995,"place" => "introen","lang" => "en","mode" => "discoveryContent");
			break;
		}
		$nextPlace = $town->getPlace($nextPlaceData);
		return $response->withJson($nextPlace);
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//continue started game
$app->get('/loadGame/{userName}', function (Request $request, Response $response) {
	try {
		$user = $this->get('user');
		$town = $this->get('town');
		/*
			check if user exists, check is done by username. In case of failure, a string "false" is being returned because return 
			of booleans causes issues
		*/
		if($user->checkUserName($request->getAttribute("userName")) === "true") {
			$user->setUser($request->getAttribute("userName"));
			$userData = $user->getUser();
			$town->setTown(ANALYSISCITY_PATH.$userData["currentPlace"]["town"]);
			$userDataCurrentPlace = array("currentUser" => $userData, "mode" => "discoveryContent");
			return $response->withJson(array("userData" => $userData,"place" => $town->getPlace($userDataCurrentPlace)));
		}
		else 
			return $response->getBody()->write("false");
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//start new game
$app->get('/loadGame/TestPerson/{newLang}', function (Request $request, Response $response) {
	try {
		$user = $this->get('user');
		$town = $this->get('town');
		$town->setTown(ANALYSISCITY_PATH."zeidel");
		//#zd0: Never give up
		$startupPlace = array("number" => 0);
		$user->setUser("TestPerson");
		$user->setLang($request->getAttribute("newLang"));
		switch($request->getAttribute("newLang")) {
			case "de": $startupPlace["place"] = "startupScreenGerman";
			break;
			case "fr": $startupPlace["place"] = "startupScreenFrench";
			break;
			case "en": $startupPlace["place"] = "startupScreenEnglish";
			break;
		}
		$user->setPlace($startupPlace);
		/*
			if a game has been started before and items are picked up, there are memory items. They are cleared whenever someone 
			starts a new game
		*/
		$user->clearMemory();
		$userData = $user->getUser();
		$userDataCurrentPlace = array("currentUser" => $userData, "mode" => "discoveryContent");
		return $response->withJson(array("userData" => $userData,"place" => $town->getPlace($userDataCurrentPlace)));
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//move in station
$app->get('/move/{user}/{newTown}/{newNumber}/{newPlace}', function (Request $request, Response $response) {
	try {
		$user = $this->get('user');
		//load requested user data
		$user->setUser($request->getAttribute("user"));
		$town = $this->get('town');
		//load requested town data
		$town->setTown(ANALYSISCITY_PATH.$request->getAttribute("newTown"));
		//update server-side object and user data file
		$userDataCurrentPlace = array("town" => $request->getAttribute("newTown"),
									  "number" => $request->getAttribute("newNumber"),
									  "place" => $request->getAttribute("newPlace"));
		$user->setPlace($userDataCurrentPlace);
		$userData = $user->getUser();
		//return next place data
		return $response->withJson($town->getPlace(array("currentUser" => $userData,"mode" => "discoveryContent")));
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//load happening stream
$app->get('/happening/{city}/{line}/{entry}/{lang}',function (Request $request, Response $response) {
	try {
		//load requested town happening data
		$this->get('happening')->setTown(ANALYSISCITY_PATH.$request->getAttribute("city"));
		//return next stream point data
		return $response->withJson($this->get('happening')->getPoint($request->getAttribute("line"),$request->getAttribute("entry"),$request->getAttribute("lang")));
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//load dialog point
$app->post('/dialog/', function (Request $request, Response $response) {
	try {
		/*
			from a POST request when data is being sent with JSON, this is the method which converts the requested params from JSON 
			to a PHP associative array
		*/
		$dialogData = $request->getParsedBody();
		$this->get('dialog')->setTown($dialogData["city"]);
		$this->get('user')->setUser($dialogData["user"]);
		$this->get('dialog')->setUser($this->get('user'));
		$this->get('dialog')->setCharacterStream($dialogData["character"],$dialogData["stream"]);
		$this->get('dialog')->setItemList($this->get('item'));
		//pointGrp has to be defined iff a choice of points has to be met! Cf. town.js, function dialog()!
		if(isset($dialogData["pointGrp"])) {
			//load among a group of points one chosen randomly
			$suggested = $this->get('dialog')->loadPlaceSuggestions($dialogData["pointGrp"],json_decode($dialogData["dialogPointsPassed"]));
			if($suggested !== false) {
				$nextPoint = $this->get('dialog')->getPoint($dialogData["pointGrp"].$suggested);
			}
			else $nextPoint = $this->get('dialog')->getPoint($dialogData["pointGrp"]."0");
			return $response->withJson($nextPoint);
		}
		else {
			//if a single point has to be retrieved (= default case)
			return $response->withJson($this->get('dialog')->getPoint($dialogData["point"]));
		}
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//fetches the data for a given form
$app->get('/form/{formId}/{town}/{lang}', function(Request $request, Response $response) {
	try {
		$town = $this->get('town');
		//load requested town data
		$town->setTown(ANALYSISCITY_PATH.$request->getAttribute("town"));
		//return the requested form from the given town
		return $response->withJson($town->getForm($request->getAttribute("formId"),$request->getAttribute("lang")));
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//updates a given note for a given user's notebook. If it is not existant, it will be created
$app->post('/updateNotebookNote/', function(Request $request, Response $response){
	try {
		$noteData = $request->getParsedBody();
		$this->get('user')->setUser($noteData["user"]);
		unset($noteData["user"]);
		$this->get('user')->updateNotebookNote($noteData);
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//removes a given note from a given user's notebook
$app->get('/deleteNotebookNote/{user}/{key}', function(Request $request, Response $response){
	try {
		$this->get('user')->setUser($request->getAttribute("user"));
		$this->get('user')->deleteNotebookNote($request->getAttribute("key"));
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//removes an already passed action from user's memory
$app->get('/removeActionPassed/{user}/{actionName}', function(Request $request, Response $response) {
	try {
		$user = $this->get('user');
		//load requested user data
		$user->setUser($request->getAttribute("user"));
		if($user->removeActionPassed($request->getAttribute("actionName"))) {
			$body = $response->getBody();
			$body->write("action ".$request->getAttribute("actionName")." removed from memory");
			return $response;
		}
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//add new item to inventory
$app->post('/addItem/{user}', function(Request $request, Response $response) {
	try {
		$itemData = $request->getParsedBody();
		$user = $this->get('user');
		//load requested user data
		$user->setUser($request->getAttribute("user"));
		//add given user to server-side inventory and user data file
		$itemAdded = $user->addItem($itemData);
		//get language
		$userLang = $user->getUser()["lang"];
		if($itemAdded) {
			$itemDetails = $this->get('item')->getItemDescription($itemData["id"],$userLang);
			$itemAddedText = "";
			switch($userLang) {
				case "de": $itemAddedText = "Du hast soeben folgenden Gegenstand erhalten:!NL".$itemDetails["name"]."!NL".$itemDetails["description"];
				break;
				case "hu": $itemAddedText = "Tárgyat találtál:!NL".$itemDetails["name"]."!NL".$itemDetails["description"];
				break;
				case "fr": $itemAddedText = "Tu viens de trouver l'objet suivant :!NL".$itemDetails["name"]."!NL".$itemDetails["description"];
				break;
				case "en": $itemAddedText = "You have just found the following item:!NL".$itemDetails["name"]."!NL".$itemDetails["description"];
				break;
			}
			//display response according to the given language
			return $response->withJson(array("text" => $itemAddedText,"details" => $itemDetails));
		}
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//removes an item from inventory (inverse of addItem)
$app->get('/removeItem/{user}/{itemID}', function(Request $request, Response $response) {
	try {
		$user = $this->get('user');
		//load requested user data
		$user->setUser($request->getAttribute("user"));
		//get user's language
		$userLang = $user->getUser()["lang"];
		//remove item from server-side inventory and user data file
		$itemRemoved = $user->removeItem($request->getAttribute("itemID"));
		if($itemRemoved) {
			$itemDetails = $this->get('item')->getItemDescription($itemRemoved,$userLang);
			$itemRemovedText = "";
			switch($userLang) {
				case "de": $itemRemovedText = "Du hast soeben folgenden Gegenstand verloren:!NL".$itemDetails["name"]."!NL".$itemDetails["description"];
				break;
				case "hu": $itemRemovedText = "T%E1rgyat vesztett%E9l el:!NL".$itemDetails["name"]."!NL".$itemDetails["description"];
				break;
				case "fr": $itemRemovedText = "Tu viens de perdre l%27objet suivant :!NL".$itemDetails["name"]."!NL".$itemDetails["description"];
				break;
				case "en": $itemRemovedText = "You have just lost the following item:!NL".$itemDetails["name"]."!NL".$itemDetails["description"];
				break;
			}
			//display response according to the given language
			return $response->withJson(array($itemRemovedText));
		}
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//removes the validity of the given ticket
$app->get('/validateTicket/{user}/{ticketID}', function(Request $request, Response $response) {
	try {
		$user = $this->get('user');
		//load requested user data
		$user->setUser($request->getAttribute("user"));
		//set validity flag of given ticket on server side
		if($user->validateTicket($request->getAttribute("ticketID"))) {
			$body = $response->getBody();
			//report success
			$body->write("Ticket ".$request->getAttribute("ticketID")." validated");
			return $response;
		}
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//gets details to a given item
$app->get('/getItemDetails/{itemID}/{lang}', function(Request $request, Response $response) {
	try {
		return $response->withJson($this->get('item')->getItemDescription($request->getAttribute("itemID"),$request->getAttribute("lang")));
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//gets the class of a given item
$app->get('/getItemClass/{itemID}', function(Request $request, Response $response) {
	try {
		$itemClass = $this->get('item')->getItemClass($request->getAttribute("itemID"));
		$body = $response->getBody();
		$body->write($itemClass);
		return $response;
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//adds a given quest to the given user
$app->get('/addQuest/{user}/{questID}', function(Request $request, Response $response) {
	try {
		$user = $this->get('user');
		//load requested user data
		$user->setUser($request->getAttribute("user"));
		//get first chapter of requested quest, according to user's language
		$questData = $this->get('quest')->getQuestData($request->getAttribute("questID"),1,$user->getUser()["lang"]);
		//add quest on server side and user data file, on success, report new quest to user
		if($user->addQuest($questData["questRequired"],$request->getAttribute("questID")))
			return $response->withJson($questData);
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//updates a given quest for the given user
$app->get('/updateQuest/{user}/{questID}/{chapter}', function(Request $request, Response $response){
	try {
		$user = $this->get('user');
		//load requested user data
		$user->setUser($request->getAttribute("user"));
		//update to given chapter on server side and in the user data file; on success, report this next chapter to user
		if($user->updateQuest($request->getAttribute("questID"),$request->getAttribute("chapter"))) {
			$ret = array("nextChapter" => $this->get('quest')->getQuestData($request->getAttribute("questID"),$request->getAttribute("chapter"),$user->getUser()["lang"]),
						 "chapterReward" => $this->get('quest')->getChapterReward($request->getAttribute("questID"),$request->getAttribute("chapter")));
			return $response->withJson($ret);
		}
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//completes a given quest for the given user
$app->get('/completeQuest/{user}/{questID}/{success}', function(Request $request, Response $response){
	try {
		$user = $this->get('user');
		//load requested user data
		$user->setUser($request->getAttribute("user"));
		//enter quest completion according to given success flag on server side and in user data file
		$success = $request->getAttribute("success") === "true" ? true : false;
		if($user->completeQuest($request->getAttribute("questID"),$success)) {
			//report quest completion to user
			if($success)
				$ret = $this->get('quest')->getQuestReward($request->getAttribute("questID",$user->getUser["lang"]));
			else if(!$success)
				$ret = $this->get('quest')->getQuestFail($request->getAttribute("questID",$user->getUser["lang"]));
			return $response->withJson($ret);
		}
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//lists all quests of a given user
$app->get('/listAllQuests/{user}/{lang}', function(Request $request, Response $response){
	try {
		$user = $this->get('user');
		//loads requested user data
		$user->setUser($request->getAttribute("user"));
		$ret = array();
		//fetch all quest nodes, loop through their IDs and fetch all details for returning them to user
		foreach(array_merge($user->getUser()["memory"]["questsMandatory"],$user->getUser()["memory"]["questsOptional"]) as $quest) {
			$questData = $this->get('quest')->getQuestData($quest["questID"],$quest["chapter"],$request->getAttribute("lang"));
			//display place coordinates on map
			if(isset($questData["place"])) {
				$prefix = array();
				//isolate town prefix
				preg_match("/[a-z]{2}/",$questData["place"],$prefix);
				$town = $this->get('town');
				//load requested town data
				$town->setTown($prefix[0]);
				//get coordinates of the place from town base
				$questData["place"] = $town->getMapCoords($questData["place"]);
			}
			$ret[] = $questData;
		}
		return $response->withJson($ret);
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//gets the information for a given quest according to the given language
$app->get('/getQuestData/{questID}/{chapter}/{lang}', function(Request $request, Response $response) {
	try {
		return $response->withJson($this->get('quest')->getQuestData($request->getAttribute("questID"),$request->getAttribute("chapter"),$request->getAttribute("lang")));
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//manipulates the money amount
$app->get('/setMoney/{user}/{newMoney}', function(Request $request, Response $response) {
	try {
		$user = $this->get('user');
		//load requested user data
		$user->setUser($request->getAttribute("user"));
		//manipulate user's virtual account (on server side/user data file) and output new account balance 
		return $response->withJson($user->setMoney($request->getAttribute("newMoney")));
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//checks if a name exists in the user database
$app->get('/checkUserName/{name}', function(Request $request, Response $response) {
	try {
		$user = $this->get('user');
		$body = $response->getBody();
		//return if given username is contained in the user data file as string (boolean returns tend to fail)
		$body->write($user->checkUserName($request->getAttribute("name")));
		return $response;
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//adds a new user to the database
$app->get('/addUser/{firstname}/{lastname}/{username}/{useName}/{lang}/{loveInterests}/{gender}/{currentMoney}/{inventory}/{actionsPassed}/'.
		  '{townsToVisit}', function(Request $request, Response $response) {
	try {
		$user = $this->get('user');
		//fetch submitted user data
		$newUser = array("firstname" => $request->getAttribute("firstname"),
						 "lastname" => $request->getAttribute("lastname"),
						 "username" => $request->getAttribute("username"),
						 "useName" => $request->getAttribute("useName"),
						 "lang" => $request->getAttribute("lang"),
						 "loveInterests" => explode(",",$request->getAttribute("loveInterests")),
						 "gender" => $request->getAttribute("gender"),
						 "currentMoney" => $request->getAttribute("currentMoney"),
						 "inventory" => json_decode($request->getAttribute("inventory"),true),
						 "actionsPassed" => explode(",",$request->getAttribute("actionsPassed")),
						 "townsToVisit" => explode(",",$request->getAttribute("townsToVisit")));
		/*
			Enter the submitted data to user data base, as a return, we get the user data with additionally added data on 
			server side. To see those, see method addUser() in User.php
		*/
		$userAdded = $user->addUser($newUser);
		if(is_array($userAdded)) {
			$this->get('town')->setTown(ANALYSISCITY_PATH."zeidel");
			/*
				To be in conformance with function updatePlace() in town.js which expects the next place data because on successful 
				user registration, s/he is being moved to the centre of 'Never give up' platform
			*/
			return $response->withJson($this->get('town')->getPlace(array("currentUser" => $userAdded,"mode" => "discoveryContent")));
		}
	}
	catch (Exception $e) {
		$newResponse = $response->withStatus(500);
		$body = $newResponse->getBody();
		$body->write("Error occured: ".$e);
		return $newResponse;
	}
});

//enable webapp, so that requests can be processed
$app->run();

?>
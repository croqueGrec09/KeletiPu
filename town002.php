<?php
include ('town_functions.php');
include ('user.php');
include ('karlstadt.php');
include ('voyage.php');

// Einlesen der Stadtparameter
$city = null;
if (isset($_GET["city"])){
	$city = loadCity($_GET["city"]);
}

// Einlesen der Benutzerkartei
$userData = null;
if (file_exists('userData.xml')){
	$userData = new userDB('userData.xml');
}
else if (!file_exists('userData.xml')){
	echo "Die Datei userData.xml konnte nicht geladen werden!";
}

//Ausgabe eines Formulars
//muss angepasst werden, falls mehrere Formulare auf einer Seite erscheinen sollen!
if (isset($_GET["form"])){
	seekForm($city,$_GET["form"]);
}

//Besteigen einer Linie
if (isset($_GET["onLine"])){
	mountLine($_GET['city'],$_GET['line'],$_GET['entry'],$_GET['stationNumberGrowing']);
}

//Bewegung innerhalb einer Station
if (isset($_GET["newImage"])){
	getNextPlaceData($city,$_GET["station"],$_GET["place"],$userData,$_GET["user"]);
	if($_GET["user"] != "none"){
		$currentPlace = $userData->xpath('/userData/user[@name="'.$_GET["user"].'"]/currentPlace');
		$currentPlace[0]->town = $_GET["city"];
		$currentPlace[0]->number = $_GET["station"];
		$currentPlace[0]->place = $_GET["place"];
		$userData->asXML('userData.xml');
	}
}
?>
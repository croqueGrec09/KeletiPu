var stationNumber = 0;
var city = 'zeidel';
var place = 'main';
var text = new Array();
var images = new Array();
var eye = new Array();
var fliesstext = ' ';
var person = null;
var image = null;
var currTime = 0;
var newItem = new Array();
var hasItemRequired = false;
var randomLetterIndex = Math.floor((Math.random()*3)+1);
var itemAcquirable = new Array();
var usedBrowser = null;

// Ladebefehle
function askUser(){
	person = prompt(unescape("Gib hier deinen Namen ein, solltest du kein Konto haben, gebe bitte 'TestPerson' f%FCr ein neues Spiel ein: "));
	if (person == ' ')
		person = prompt(unescape("Ung%FCltiger Name./nGib hier deinen Namen ein, solltest du kein Konto haben, gebe bitte 'TestPerson' f%FCr ein neues Spiel ein: "));
	else if (person == 'PHP-Error'){
		alert("Kein Spiel gestartet!");
	}		
	else if (person != ' ')
		pageInit();
}

function pageInit(){
	//usedBrowser = browserStore(navigator.userAgent);
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}	
	/* Aufspaltung der soeben hereingekommenen Antwort. Die Indizes sind wie folgt aufgeteilt, nicht genannte Zahlen werden nicht verwendet:
		0 = Name der Stadt
		1 = Bahnhofsnummer
		2 = Standort an der Station selbst
	*/
	userPosition = new Array();
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status == 200) {
			try {
				var userPosition = sender.responseText.split('§');
				writeStation(userPosition[1].trim(),userPosition[0].trim(),userPosition[2].trim(),false);
			}
			catch (ex) {
				askUser();
			}	
		}
	}
	sender.open("GET","town.php?person=" + person + "&pageReload=" + true ,true);
	sender.send();
}

function random(stationNumber,city,placeGroup){
	console.log(randomLetterIndex);
	var currentLetter = 'noTrain';
	switch(randomLetterIndex){
		case 1: currentLetter = 'a';
		break;
		case 2: currentLetter = 'b';
		break;
		case 3: currentLetter = 'c';
		break;
	}	
	var trainState = Math.random();
	if (trainState <= 0.2){
		place = placeGroup+currentLetter;
		writeStation(stationNumber,city,place,true);
		if (randomLetterIndex < 3)
			randomLetterIndex++;
		else if (randomLetterIndex >= 3)
			randomLetterIndex = 1;
	}
	else {
		place = placeGroup+'noTrain';
		writeStation(stationNumber,city,place,true);
	}
}

function mountLine(city,number,currentStation,stationNumberGrowing){
	if (confirm(unescape('M%F6chtest du den Zug im Enteckungsmodus (OK) oder im Pr%FCfungsmodus (Abbrechen) besteigen?'))) {
		var sender = null;
		if (window.XMLHttpRequest){
			sender = new XMLHttpRequest();
		}	
		else if (window.ActiveXObject){
			sender = new ActiveXObject("Microsoft.XMLHTTP");
		}
		sender.onreadystatechange=function(){
			if (sender.readyState == 4 && sender.status==200){
				var nextStation = sender.responseText;		
				place = "voyage"+currentStation+nextStation+number+stationNumberGrowing;
				writeStation(nextStation,city,place,true);
			}
		}	
		sender.open("GET","town.php?onLine=true&city=" + city + "&number=" + number + "&currentStation=" + currentStation + "&stationNumberGrowing=" + stationNumberGrowing,true);
		sender.send();
	}
	else {
		document.getElementById("bilder").innerHTML = ' ';
		document.getElementById("buttons").innerHTML = ' ';
		document.getElementById("richtungsanzeige").innerHTML = ' ';
		document.getElementById("fliesstext").innerHTML = ' ';
		var sender = null;
		if (window.XMLHttpRequest){
			sender = new XMLHttpRequest();
		}	
		else if (window.ActiveXObject){
			sender = new ActiveXObject("Microsoft.XMLHTTP");
		}
		sender.onreadystatechange=function(){
			if (sender.readyState == 4 && sender.status==200){
				var response = sender.responseText.split('§');
				document.getElementById("stationname").innerHTML = response[0];
				document.getElementById("formular").innerHTML = response[1];
			}
		}	
		sender.open("GET","town.php?exam=true&city=" + city + "&number=" + number + "&currentStation=" + currentStation + "&stationNumberGrowing=" + stationNumberGrowing,true);
		sender.send();
	}
}

function writeStation(stationNumber, city, place, movement){
	if (document.getElementById("sound") != null)
		currTime = document.getElementById("sound").currentTime;
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status==200){
			var stationName = sender.responseText;
			document.getElementById("stationname").innerHTML = stationName.trim();
		}
	}
	if (movement == true)
		sender.open("GET", "town.php?city=" + city + "&station=" + stationNumber + "&place=" + place + "&newImage=" + true + "&person=" + person + "&part=name" , true);
	else sender.open("GET", "town.php?city=" + city + "&station=" + stationNumber + "&place=" + place + "&newImage=" + true + "&part=name", true);
	sender.send();
	nextText(stationNumber, city, place, "text");
	nextImages(stationNumber, city, place, "images");
	nextEye(stationNumber, city, place, "eye");
	nextItem(stationNumber, city, place, "item");
	nextSound(stationNumber, city, place, "sound");
}

function nextText(stationNumber, city, place, part){
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status==200){
			text = sender.responseText.split("!NL");
			document.getElementById("fliesstext").innerHTML = ' ';
			for (var i=0;i<text.length;i++){
				fliesstext += "<p>" + text[i].trim() + "<\/p>";
			}
			document.getElementById("fliesstext").innerHTML = fliesstext;
			fliesstext = ' ';
		}	
	}
	sender.open("GET", "town.php?city=" + city + "&station=" + stationNumber + "&place=" + place + "&newImage=" + true + "&part=" + part, true);
	sender.send();	
}

function nextImages(stationNumber, city, place, part){
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status==200){
		images = sender.responseText.split('§');
		document.getElementById("schild").src = images[0].trim();
		document.getElementById("auge").src = images[1].trim();
		}
	}
	sender.open("GET", "town.php?city=" + city + "&station=" + stationNumber + "&place=" + place + "&newImage=" + true + "&part=" + part, true);
	sender.send();	
}

function nextEye(stationNumber, city, place, part){
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status==200){
			eye = sender.responseText.split('§');			
			var x1 = eye[1];
			var y1 = eye[2];
			var x2 = eye[3];
			var y2 = eye[4];
			var onclick = eye[5].trim();
			var onmouseover = eye[6].trim();
			document.getElementById("aktion").innerHTML = '<area id="steuerfeld1" shape="rect" coords="'+x1+','+y1+','+x2+','+y2+'" target="_self" href="#fliesstext" onclick="'+onclick+'" onmouseover="'+onmouseover+'" onmouseout="directionNull()" alt="Aktion"\/>'
			if (eye[0].trim() > 1){
				var i=7;
				var j=2;
				while (i<eye.length-2){
					var x1 = eye[i+0];
					var y1 = eye[i+1];
					var x2 = eye[i+2];
					var y2 = eye[i+3];
					var onclick = eye[i+4];
					var onmouseover = eye[i+5];
					document.getElementById("aktion").innerHTML += '<area id="steuerfeld'+j+'" shape="rect" coords="'+x1+','+y1+','+x2+','+y2+'" target="_self" href="#fliesstext" onclick="'+onclick+'" onmouseover="'+onmouseover+'" onmouseout="directionNull()" alt="Aktion"\/>'
					i+=6;
					j++;
				}	
			}	
		}
	}	
	sender.open("GET", "town.php?city=" + city + "&station=" + stationNumber + "&place=" + place + "&newImage=" + true + "&part=" + part, true);
	sender.send();
}

function nextItem(stationNumber, city, place, part){
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status==200){
			if (sender.responseText == 'No item acquired!'){
				console.log('No item acquired!');
			}
			else {
				newItem = sender.responseText.split('§');
				sender.onreadystatechange=function(){
					if (sender.readyState == 4 && sender.status == 200){
						var onload = newItem[0].trim();
						if (onload == 'true'){
							inventoryAdd(newItem[1],newItem[2],newItem[3].trim());
						}
						else if (onload == false && newItem != '') {
							alert(newItem);
							itemAcquirable = [newItem[1],newItem[2],newItem[3].trim()];
						}
					}
				}	
				sender.open("GET", "town.php?city=" + city + "&station=" + stationNumber + "&place=" + place,true);
				sender.send();
			}
		}
	}
	sender.open("GET", "town.php?city=" + city + "&station=" + stationNumber + "&place=" + place + "&newImage=" + true + "&part=" + part + "&person=" + person, true);
	sender.send();
}

function nextSound(stationNumber, city, place, part){
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status==200){
			if (sender.responseText == 'No sound available!'){
				console.log('No sound available!');
				document.getElementById('ohr').innerHTML = null;
			}
			else if (sender.responseText.indexOf('§') != -1){
				var soundData = sender.responseText.split('§');
				document.getElementById('ohr').innerHTML = '<audio id="sound" controls="controls" autoplay="true" onended="'+soundData[1]+'"> <source src="'+soundData[0]+'" type="audio/mpeg"> Ihr Browser unterst&uuml;tzt das Audio-Element NICHT! <\/audio>';
			}
			else {
				document.getElementById('ohr').innerHTML = '<audio id="sound" controls="controls"> <source src="'+sender.responseText+'" type="audio/mpeg"> Ihr Browser unterst&uuml;tzt das Audio-Element NICHT! <\/audio>';
			}
		}
	}
	sender.open("GET", "town.php?city=" + city + "&station=" + stationNumber + "&place=" + place + "&newImage=" + true + "&part=" + part, true);
	sender.send();
}

// Prüfungsmodus-Verwaltung
function ready(number,currentStation,stationNumberGrowing) {
	var questions = document.getElementsByName('question');
	var responses = new Array();
	for(var i = 0;i<questions.length;i++){		
		var fieldsWithoutExamples = document.getElementsByName("q"+(i+1));
		if (typeof fieldsWithoutExamples !== undefined){
			for(var j = 0; j < fieldsWithoutExamples.length; j++){
				responses.push("q"+(i+1)+":"+fieldsWithoutExamples[j].value);
			}
		}
		var examples = getElementsByAttribute("for");
		if (typeof examples !== undefined){
			for(var k = 0; k < examples.length; k++){
				var exField = document.getElementById("q"+(i+1)+k);
				if (exField !== undefined)
					responses.push("q"+(i+1)+k+":"+exField.value);
			}
		}
	}
	console.log(responses.toString());
	/* var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status==200){
			alert(sender.responseText);
		}
	}
	sender.open("GET", "town.php?exam=true&check=true&responses="+responses+"&city=" + city + "&number=" + number + "&currentStation=" + currentStation + "&stationNumberGrowing=" + stationNumberGrowing, true);
	sender.send(); */
}

// Befehle, die die Benutzeroberfläche betreffen:
function directionChange(movement){
	document.getElementById("richtungsanzeige").innerHTML = movement;
}	


function directionNull(){
	document.getElementById("richtungsanzeige").innerHTML = "Kein Feld angew&auml;hlt";
}

function showInventory(){
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
		sender.onreadystatechange=function(){
			if (sender.readyState == 4 && sender.status==200){
				image = document.getElementById("bilder").innerHTML;
				var itemsCarried = sender.responseText.split('§');
				document.getElementById("bilder").innerHTML = "Du hast zur Zeit folgende Gegenst&auml;nde: <br>";
				var i = 1;
				var j = 1;
				while (i < itemsCarried.length-1){
					document.getElementById("bilder").innerHTML += "Element " + j + ": " + itemsCarried[i].trim() + "<br>Beschreibung: " + itemsCarried[i+1].trim() + "<br>";
					i += 3;
					j++;
				}
				document.getElementById("buttons").innerHTML = '<input type="button" value="Zur&uuml;ckschalten" onclick="resetImage()"\/>';
			}
		}
	sender.open("GET", "town.php?showInventory=" + true + "&person=" + person, true);
	sender.send();	
}

function inventoryAdd(id,itemName,itemDescription){
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status==200){
			alert("Du hast einen neuen Gegenstand in dein Inventar bekommen:\n\n" + itemName + "\n\n" + itemDescription);
		}
	}
	sender.open("GET", "town.php?person=" + person + "&newItem=" + itemName + "&id=" + id + "&itemDescription=" + itemDescription, true);
	sender.send();
}

function removeItem(id,person){
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
	sender.onreadystatechange=function(){
		if (sender.readyState == 4 && sender.status==200){
			alert(sender.responseText);
		}
	}
	sender.open("GET","town.php?remove=true&person="+person+"&IDItemAffected="+id);
	sender.send();
}

function resetImage(){
	document.getElementById("bilder").innerHTML = image;
	document.getElementById("formular").innerHTML = ' ';
	document.getElementById("buttons").innerHTML = '<input type="button" value="Inventar anzeigen" onclick="showInventory()" \/>';
}

function askExit(currentStation,city,place,line,stationNumberGrowing){
	if (confirm('Moechtest du hier aussteigen?') == true){
		random(currentStation,city,place);
	}
	else mountLine(city,line,currentStation,stationNumberGrowing);
}

// Andere, stadtspezifische Befehle:

// Zeidel: Erstellen eines neuen Benutzerkontos
function register(stationNumber, city, place){
	image = document.getElementById("bilder").innerHTML;
	document.getElementById("bilder").innerHTML = ' ';
	var sender = null;
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
		sender.onreadystatechange=function(){
			if (sender.readyState == 4 && sender.status==200){
				hasItemRequired = sender.responseText;
				if (hasItemRequired == "true"){
					document.getElementById("formular").innerHTML = '<h2> Bitte f&uuml;lle das unten stehende Formular aus: <br> <\/h2> <form name="register" action=""> <label> Dein Vor- und Nachname, bitte mit Leerzeichen getrennt: <\/label> <br> <input name="userName" type="text" size="20" maxlength="20" \/> <br> <label> Vor- und Nachname deiner Liebe: <\/label> <br> <input name="loveName" type="text" size="20" maxlength="20" \/> <br> <label> Geschlecht deiner Liebe: <\/label> <br> <input type="radio" name="loveSex"  value="m" \/> m&auml;nnlich <input type="radio" name="loveSex" value="w" \/> weiblich <br> <label> Gew&uuml;nschtes Reiseziel (zur Zeit ist nur Ni&ntilde;aciudad m&ouml;glich; falls Fr. Kurz ihren Segen gibt, werden es mehr): <\/label> <br> <select name="destination"> <option value="ninaciudad">Ni&ntilde;aciudad, Intercity<\/option> <option value="cite_d_orcive">Cit&eacute; d&acute;Orcive, per Kurswagen im Nachtschnellzug<\/option> <option value="kikinda">Kikinda, mit Umstieg in Cit&eacute; d&acute;Orcive<\/option> <\/select> <input name="finish" type="button" value="Fertig" onclick="createNewAccount()"\/>  <br> <\/form>';
					document.getElementById("buttons").innerHTML = ' ';
				}
				else if (hasItemRequired == "false")
					alert(unescape("Du musst kein neues Benutzerkonto mehr er%F6ffnen!"));
				
		}
	}		
	sender.open("GET","town.php?city=" + city + "&station=" + stationNumber + "&place=" + place + "&action=register" + "&person=" + person,true);
	sender.send();		
}

function createNewAccount(){
	person = document.register.userName.value
	console.log("person = " + person);
	var loveName = document.register.loveName.value.split(' ');	
	console.log("love = " + loveName[0]);
	var loveSex;
 	if (document.register.loveSex[0].checked == true)
		loveSex = 'm';
	else if (document.register.loveSex[0].checked == false) 
		loveSex = 'w';
	console.log("loveSex = " + loveSex);
	var destination = document.register.destination.value;
	console.log("destination = " + destination);
	var sender = null;
	resetImage();	
 	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}	
	else if (window.ActiveXObject){
		sender = new ActiveXObject("Microsoft.XMLHTTP");
	}
		sender.onreadystatechange=function(){
			if (sender.readyState == 4 && sender.status==200){
				if (sender.responseText == true){
					removeItem('initPass','TestPerson');
					writeStation(0,'zeidel','centerEntranceSuccess_'+destination,true);
				}
				else alert("Benutzer konnte nicht hinzugefuegt werden!");
			}
		}
	sender.open("GET","town.php?newAccount=" + true + "&person=" + person + "&loveFirstName=" + loveName[0] + "&loveLastName=" + loveName[1] + "&loveSex=" + loveSex + "&destination=" + destination,true);
	sender.send();
}

// Dummies:

function getElementsByAttribute(attribute){
	var matchingElements = new Array();
	var allElements = document.getElementsByTagName('*');
		for (var i = 0; i < allElements.length; i++){
			if (allElements[i].getAttribute(attribute)){
				matchingElements.push(allElements[i]);
			}
		}
	return matchingElements;
}

function noAction(whatShouldHappen){
	alert("Sorry, this method is not implemented yet. Report the programmer that this should have happen here:\n" + whatShouldHappen + "\nBy then, you should take:\n Your first cup of Java: Hello World!!");
}

function synchronWarn(){
	alert('Current version of program: version 0.21 from July 2nd, 2013.\n\nChanges:\n\nProlog-based examinator installed.\n\nTODO:\n\nConnect Kvirasim, CiteDOrcive and Zeidel with each other. (postponed)\nImplement Plattendorf. (postponed)\nImplement interchange routines. (postponed)\nContinue implementing Ninaciudad.\nImplement Browsercheck-Method.\nRefine examinator.\nURGENT: Verify field checkup\n\nDid you synchronize and update this box?');
}

// Funktionsbausteine
// writeStation(0,'ninaciudad','nextPlace')
// directionChange('Muss noch eingebaut werden!')
// mountLine('town','line',station,stationNumberGrowing)
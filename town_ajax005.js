var currentPanel = {};
var items = null;
var actions;
var image = null;
var ctx = null;
var eye = null;
var user = null;
var station = null;
var city = null;
var place = null;
var mode = "discoveryContent";
var nextTrainSet = false;
var line = null;
var forward = false;
var lang = "en";
var directionNullText = "No field chosen!";
var itemMissingText = "You need the following item: ";
var exitHere = "Would you like to exit here?";
var ticketValidityText = "Ticket valid: ";

//Seiteninitialisierung
function synchronWarn(){
	alert('Current version of program: version 0.52 from May 1st, 2017.\n\nChanges:\n\nMVC-model based on Slim framework implemented.\n\nTODO:\nImplement regexp replacements.\nCheck towns to visit-node\nAdd sounds.\nContinue the towns!!\n\nDid you synchronize and update this box?');
	var params = {
		user: "none",
		newImage: "true",
		city: "zeidel",
		station: 9999,
		place: "languageChooser",
		lang: "en",
		mode: "discoveryContent"
	};
	$.get("town.php",params,function(response){
		updateScreen(response);
	});
	//databaseFetcher("town.php?user=none&newImage=true&city=zeidel&station=9999&place=languageChooser&lang=en&mode=discoveryContent",debugOutput);
}

// Ladebefehle
function setLang(lang){
	//alert("Language chosen: "+lang);
	this.lang = lang;
	switch(lang){
	case "de":
		directionNullText = "Kein Feld angew&auml;hlt!";
		itemMissingText = "Du ben%F6tigst folgenden Gegenstand: ";
		exitHere = "M%F6chtest du hier aussteigen?";
		ticketValidityText = "Fahrkarte g&uuml;ltig: ";
	break;
	case "hu":
		directionNullText = "Nem jel&ouml;lt&eacute;l mez&#337;t!";
		itemMissingText = "Hi%E1nyzik a k%F6vetkez%F4 t%E1rgy: ";
		exitHere = "Lesz%E1llsz itt?";
		ticketValidityText = "Jegy &eacute;rv&eacute;nyes: ";
	break;
	case "fr":
		directionNullText = "Pas de champ choisi !";
		itemMissingText = "Il te manque l'objet suivant :";
		exitHere = "Est-ce que tu veux descendre ici ?";
		ticketValidityText = "Ce billet est valable : ";
	break;
	}
	var params = {
		user: "none",
		initGame: "true", 
		lang: lang
	};
	$.get("town.php",params,function(response){
		//console.log(response);}
		updateScreen(response);}
	);
}

function askUser(){
	var askName = "Enter your name here. If you don't have an account, enter 'TestPerson' to start a new game: ";
	var invalidName = "Invalid name./nEnter your name here. If you don't have an account, enter 'TestPerson' to start a new game: ";
	var errorNull = "No game started!";
	switch (lang){
	case "de": {
		askName = "Gib hier deinen Namen ein, solltest du kein Konto haben, gebe bitte 'TestPerson' f%FCr ein neues Spiel ein: ";
		invalidName = "Ung%FCltiger Name./nGib hier deinen Namen ein, solltest du kein Konto haben, gebe bitte 'TestPerson' f%FCr ein neues Spiel ein: ";
		errorNull = "Kein Spiel gestartet!";
		}
	break;
	case "hu": {
		askName = "Add be a nevedet, ha nem vagy m%E9g bejegyezve, akkor %EDrd azt, hogy 'TestPerson', hogy egy %FAj j%E1t%E9kot kezdj%E9l: ";
		invalidName = "N%E9v nincs a jegyz%E9kben./nAdd be a nevedet, ha nem vagy m%E9g bejegyezve, akkor %EDrd azt, hogy 'TestPerson', hogy egy %FAj j%E1t%E9kot kezdj%E9l: ";
		errorNull = "J%E1t%E9k nem indult el!";
		}
	break;
	case "fr": {
		askName = "Entre ton nom ici, si tu n'avais pas de compte, entre 'TestPerson' pour d%E9marrer un nouveau jeu: ";
		invalidName = "Nom ne pas trouv%E9./nEntre ton nom ici, si tu n'avais pas de compte, entre 'TestPerson' pour d%E9marrer un nouveau jeu: ";
		errorNull = "Pas de jeu d%E9marr%E9 !";
		}
	break;
	}
	user = prompt(unescape(askName));
	if (user == ' ')
		user = prompt(unescape(invalidName));
	else if (user == 'PHP-Error' || user == null){
		alert(unescape(errorNull));
	}
	else {
		var params = {
			user: user,
			pageReload: "true"
		};
		$.get("town.php",params,function(response){
			if(response[0] == "{"){
				var currentLocation = JSON.parse(response);
				//console.log();}
				writeStation(currentLocation.station,currentLocation.city,currentLocation.place);
				if(user !== 'TestPerson' && user !== 'none')
					$("#invShow").show();
			}
			else alert("Error on loading user data: "+response);
		});
	}
}

function writeStation(nextStation,nextCity,nextPlace){
	station = nextStation;
	city = nextCity;
	place = nextPlace;
	console.log(station+' '+city+' '+place+' '+lang+' '+mode);
	var params = {
		newImage: "true",
		user: user,
		city: city,
		station: station,
		place: place,
		lang: lang,
		mode: mode
	};
	$.get("town.php",params,function(response){
		updateScreen(response)
	});
}

function updateScreen(stationData) {
	$("#steuerfeld").empty();
	//console.log(stationData.charCodeAt(0));
	var nextPlaceData = JSON.parse(stationData);
	console.log(nextPlaceData);
	$("#stationname").html(nextPlaceData.name);
	$("#fliesstext").html(nextPlaceData.text.replace(/!NL/g,"<br> <br>"));
	actions = nextPlaceData.actions;
	items = nextPlaceData.items;
	$("#background").attr("src",nextPlaceData.image);
	$.each(actions, function(actionName, action){
		//console.log(key + " -> " + param);
		var points = '';
		var coords = action.coords.split(" ");
		for(var i = 0;i < coords.length; i++){
			//console.log($("#background").width());
			point = coords[i].split(",");
			points += Math.floor($("#background").width()*(point[0]/100))+",";
			points += Math.floor($("#background").height()*(point[1]/100))+" ";
		}
		points = points.slice(0,-1);
		//console.log(JSON.stringify(action));
		if(typeof(action.actionImage) !== "undefined"){
			//console.log(typeof(action.actionImage));
			drawItem(actionName, action.actionImage);
		}
		if(action.itemRequired === "none")
			$("#steuerfeld").append('<polygon id="'+actionName+'" points="'+points+'" style="fill:black" onmouseover="'+action.hover+'" onmouseout="directionNull()" onclick="executeAction('+action.execute+',\''+action.itemRequired+'\','+null+')">');
		else if(action.itemRequired !== "none")
			$("#steuerfeld").append('<polygon id="'+actionName+'" points="'+points+'" style="fill:black" onmouseover="'+action.hover+'" onmouseout="directionNull()" onclick="verifyItem(\''+action.execute.replace(/'/g, '&quot;')+'\',\''+action.itemRequired+'\')">');
	});
	$.each(items, function(itemName, item){
		console.log(itemName + " -> " + item);
	});
	$("#controlScreen").html($("#controlScreen").html());
	//console.log(key + " -> " + JSON.stringify(actions[key]));	
}

function executeAction(currAction, itemRequired, hasItem){
	if (hasItem == null || hasItem === "true") {
		var execute = new Function(currAction);
		execute();
	}
	else if(hasItem === "false")
		alert(unescape(itemMissingText+itemRequired));
}

function callLink(address){
	window.open(address);
}

//Gegenstandsverwaltung
function verifyItem(currAction, itemRequired){
	var params = {
		request: itemRequired,
		user: user
	};
	console.log(currAction);
	$.get("town.php",params,function(hasItem){
		//alert(hasItem);
		if(hasItem == "true")
			executeAction(currAction, itemRequired, hasItem);
		else alert(unescape(itemMissingText+hasItem));
	});	
}

var Item = function(id,src,x,y,sx,sy) {
	this.id = id;
	this.src = src;
	this.x = x;
	this.y = y;
	this.sx = sx;
	this.sy = sy;
	console.log('Gegenstand mit folgenden Eigenschaften erzeugt: ' + this.id + ',' + this.src + ',' + this.x + ',' + this.y + ',' + this.sx + ',' + this.sy);
};

function drawItem(action, item){
	var x = Math.floor($("#background").width()*(item.cx1/100));
	var y = Math.floor($("#background").height()*(item.cy1/100));
	var xl = Math.floor($("#background").width()*(item.xl/100));
	var yl = Math.floor($("#background").height()*(item.yl/100));
	console.log('Quelle des nächsten Gegenstandes = ' + item.src);
	$("#controlScreen").append('<img id="'+action+'Img" class="item" src="'+item.src+'" />');
	$("#"+action+"Img").css({
		"position": "relative",
		"top": y,
		"left": x,
		"width": xl,
		"height": yl
	});
}

function pickUpItem(action, item){
	if($("#"+action+"Img").length)
		$("#"+action+"Img").remove();
	var itemData = {
		"itemId": item,
		"found": true,
		"actionToEliminate": action
	};
	addItem(itemData);
}

//Anzeige von Stadtkarten
function showMap(mapFile,xPoint,yPoint){
	$('#background').attr('src',mapFile);
	$('#buttons').html('<input type="button" value="Zur&uuml;ck" onclick=hideMap()>');
}

function hideMap(){
	$('#buttons').html('<input type="button" value="Inventar anzeigen" onclick=showInventory()>');
}

//Dialogverwaltung
function dialogue(database,character,stream,point){
	savePanel();
	$("#background").animate({
		opacity: 0.2
	});
	var params = {
		"dialogue": "true",
		"database": database,
		"character": character,
		"stream": stream,
		"point": point
	};
	$.get("town.php",params,function(response){
		//$("#fliesstext").html(response);
		var reaction = JSON.parse(response);
		$("#fliesstext").html(reaction.answer.replace(/!NL/g,"<br> <br>"));
		$.each(reaction.action, function(actionName,action){
			$("#fliesstext").append('<p class="dialogItem" onclick="'+action.command+'">'+action.response+'</p>');
		});
	});
}

function exitDialogue(){
	$("#background").animate({
		opacity: 0.8
	});
	restorePanel();
}

function triggerHappening(city,line,entry,forward){
	exitDialogue();
	happening(city,line,entry,forward);
}

//Züge
function random(stationNumber,city,placeGroup,numOfPlaces){
	var letter = 97;
	var currentLetter = new Array(numOfPlaces);
	for(var i = 0; i < numOfPlaces; i++){
		currentLetter[i] = String.fromCharCode(letter);
		letter++;
	}	
	var trainState = Math.random();
	if(!nextTrainSet)
		setNextTrain(numOfPlaces);
	console.log(randomLetterIndex);	
	if (trainState <= 0.2){
		place = placeGroup+currentLetter[randomLetterIndex];
		writeStation(stationNumber,city,place,numOfPlaces);
		if (randomLetterIndex < numOfPlaces)
			randomLetterIndex++;
		else if (randomLetterIndex >= numOfPlaces)
			randomLetterIndex = 0;
		nextTrainSet = false;
	}
	else {
		place = placeGroup+'noTrain';
		writeStation(stationNumber,city,place,numOfPlaces);
	}
}

function setNextTrain(numOfPlaces){
	randomLetterIndex = Math.floor(Math.random()*numOfPlaces);
	if (randomLetterIndex >= numOfPlaces) randomLetterIndex--;
	nextTrainSet = true;
}

// Formulare
function seekForm(city,formName){
	var params = {
		city: city,
		form: formName,
		lang: lang
	};
	$.get("town.php",params,function(response){
		$('#background').animate({
			opacity: 0.2
		});
		directionNull();
		$('#inventory').hide();
		$('#steuerfeld').hide();
		$('#formular').html(response).animate({
			opacity: 1.0
		});
	});
}

// Prüfungsmodus-Verwaltung
function ready(number,currentStation,forward) {
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
}

//Steuerfeld-Zusatzfunktionen
function directionChange(movement){
	//console.log('Methode 1 aufgerufen!');
	$("#richtungsanzeige").html(movement);
}	

function directionNull(){
	//console.log('Methode 2 aufgerufen!');
	$("#richtungsanzeige").html(directionNullText);
}

function savePanel(){
	$("#steuerfeld").hide();
	$("#richtungsanzeige").hide();
	$("#buttons").hide();
	currentPanel = {
		"fliesstext": $("#fliesstext").text()
	};
}

function restorePanel(){
	$("#steuerfeld").show();
	$("#richtungsanzeige").show();
	$("#buttons").show();
	$("#fliesstext").text(currentPanel.fliesstext);
}

// Debug-Kontrollfunktionen:
function noAction(whatShouldHappen){
	alert("Sorry, this method is not implemented yet. Report the programmer that this should have happen here:\n" + whatShouldHappen + "\nBy then, you should take:\n Your first cup of Java: Hello World!!");
}

function seekArray(array){
	for (var i = 0; i < array.length; i++)
		console.log("Arrayparameter " + i + ": " + array[i]);
}

function debugOutput(phpOutput){
	$("#fliesstext").html(phpOutput);
}

// Funktionsbausteine
// writeStation(0,'ninaciudad','nextPlace')
// directionChange('Muss noch eingebaut werden!')
// mountLine('city','line',entry,forward)
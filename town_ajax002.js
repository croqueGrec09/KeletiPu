var sender = null;
var mousePos = null;
var items = null;
var actions;
var image = null;
var steuerfeld = null;
var ctx = null;
var eye = null;
var user = null;
var station = null;
var city = null;
var place = null;
var nextTrainSet = false;
var line = null;
var stationNumberGrowing = false;

//Seiteninitialisierung
function synchronWarn(){
	alert('Current version of program: version 0.41 from May 1st, 2014.\n\nChanges:\n\nMap implemented.\nKarlstadt almost complete.\n\nTODO:\nTerminate client-side and server-side TEI-functions.\nCreate journey databases and actions (the pre-study for films).\nAdd sounds.\nCheck user application behaviour. Include possibility for pseudonyms.\n\nDid you synchronize and update this box?');
	databaseFetcher("town.php?user=none&newImage=true&city=zeidel&station=9999&place=languageChooser&lang=en",updateScreen);
}

// Ladebefehle
function askUser(){
	user = prompt(unescape("Gib hier deinen Namen ein, solltest du kein Konto haben, gebe bitte 'TestPerson' f%FCr ein neues Spiel ein: "));
	if (user == ' ')
		user = prompt(unescape("Ung%FCltiger Name./nGib hier deinen Namen ein, solltest du kein Konto haben, gebe bitte 'TestPerson' f%FCr ein neues Spiel ein: "));
	else if (user == 'PHP-Error' || user == null){
		alert("Kein Spiel gestartet!");
	}
	else {
		databaseFetcher("town.php?user="+user+"&pageReload=true",function(response){
		writeStation(response.split('§')[1].trim(),response.split('§')[0].trim(),response.split('§')[2].trim())});
	}
}

function writeStation(nextStation,nextCity,nextPlace){
	station = nextStation;
	city = nextCity;
	place = nextPlace;
	console.log(station+' '+city+' '+place);
	databaseFetcher("town.php?newImage=true&user="+user+"&city="+city+"&station="+station+"&place="+place,updateScreen);
}

function databaseFetcher(query,nextFunction){
	if (window.XMLHttpRequest){
		sender = new XMLHttpRequest();
	}
	else if (window.ActiveXObject){
		try {
			sender = new ActiveXObject("Msxml2.HTTP");
		}
		catch (ex) {
			try {
				sender = new ActiveXObject("Microsoft.HTTP");
			}
			catch (ex) {
				alert('ActiveXSteuerobjekt konnte nicht erstellt werden!');
			}
		}
	}
	sender.onreadystatechange=function(){
		if (sender.readyState === 4 && sender.status === 200) {
			nextFunction(sender.responseText.trim());
		}
	}
	sender.open("GET", query, true);
	sender.send();
}

function updateScreen(stationData) {
	//console.log(stationData);	
	var stationParameter = stationData.split('§');
	for (var h = 0; h < stationParameter.length-1; h++)
		console.log(h+": "+stationParameter[h]);
	document.getElementById("stationname").innerHTML = stationParameter[0];
	document.getElementById("fliesstext").innerHTML = stationParameter[1].replace(/!NL/g,"<br> <br>");
	document.getElementById("schild").src = stationParameter[2];
	var i = 4;
	actions = new Array();
	items = new Array();
	while (i < stationParameter.length-1){
		console.log("i = "+i+" stationParameter: " + stationParameter[i]);	
		if(stationParameter[i].search(".mp3") != -1){
			document.getElementById("ohr").innerHTML = '<audio controls autoplay=true><source src="'+stationParameter[i]+'" type="audio\/mp3"><\/audio>';
			i++;		
		}
		if(stationParameter[i].search("nextItem") != -1) {
			var itemParameter = stationParameter[i].split("!NI!");
			/*
			Arrayparameter 0: item-ID
			Arrayparameter 1: onload
			Arrayparameter 2: cost
			Arrayparameter 3: valid: ist eine evtl. Fahrkarte gültig?
			Arrayparameter 4: name
			Arrayparameter 5: description
			Arrayparameter 6: actionToEliminate
			Arrayparameter 7: Bildparameter, nur gesetzt, wenn Parameter 1 auf false (= nicht beim Laden des Standortes) gesetzt ist!
			*/
			itemParameter[0] = itemParameter[0].replace("nextItem: ","");
			if(itemParameter[1] == 'true'){
				console.log("Gegenstand an Stelle " + i + " gefunden: " + itemParameter[0] + " " + itemParameter[4] + " " + itemParameter[5]);
				addItem(itemParameter[0],itemParameter[3],itemParameter[4],itemParameter[5],itemParameter[2],false);
			}
			else if(itemParameter[1] == 'false'){
				var itemImageParams = itemParameter[7].split("!NIM!");
				/*
				Arrayparameter 0: Bildquelle
				Arrayparameter 1: x-Position
				Arrayparameter 2: y-Position
				Arrayparameter 3: x-Länge
				Arrayparameter 4: y-Länge			
				*/
				itemImageParams[0] = itemImageParams[0].replace("itemImage: ","");
				var item = new Item(itemParameter[0],parseInt(itemParameter[2]),itemParameter[3],itemParameter[4],itemParameter[5],itemParameter[6],itemImageParams[0],itemImageParams[1],itemImageParams[2],itemImageParams[3],itemImageParams[4]);
				items.push(item);
				actions.push(new Action('takeUp'+itemParameter[0],'none',true,itemImageParams[1],itemImageParams[2],itemImageParams[1]+itemImageParams[3],itemImageParams[2]+itemImageParams[4],"addItem('"+itemParameter[0]+"','"+itemParameter[3]+"','"+itemParameter[4]+"','"+itemParameter[5]+"','"+itemParameter[2]+"','"+itemParameter[6]+"')","directionChange(\'"+itemParameter[4]+" aufheben\')"));
			}
			i++;
		}
		if(stationParameter[i].search("nextAction") != -1) {
			var actionParameter = stationParameter[i].split("!NA!");
			actionParameter[0] = actionParameter[0].replace("nextAction: ","");
			if (actionParameter[9].search("actionImage") != -1) {
				var actionImage = actionParameter[9].split("!NAM!");
				actionImage[0] = actionImage[0].replace("actionImage: ","");
				var actionItem = new ActionItem(actionImage[0],actionImage[1],actionImage[2],actionImage[3],actionImage[4]);
				items.push(actionItem);				
			}
			actions.push(new Action(actionParameter[0],actionParameter[1],actionParameter[2],actionParameter[3],actionParameter[4],actionParameter[5],actionParameter[6],actionParameter[7],actionParameter[8]));
			i++;
		}
		else i++;
	}
	steuerfeld = document.getElementById('steuerfeld');
	ctx = steuerfeld.getContext('2d');
	drawBackground(stationParameter[3],0,0,items);
	steuerfeld.addEventListener('mousemove', function(evt) {
		mousePos = getMousePos(steuerfeld,evt);
		for (var a = 0; a < actions.length; a++){
			if (mousePos.x > actions[a].x1 && mousePos.x < actions[a].x2 && mousePos.y > actions[a].y1 && mousePos.y < actions[a].y2){
				//console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y + ' ' + actions[a].hover);
				actions[a].hover();
				break;
			}
			else directionNull();
		}
	},false);	
}

function drawBackground(src,x,y,items){
	var tb = new Image();
	tb.onload = function(){
		console.log('Hintergrund geladen: ' + tb.complete);
		ctx.drawImage(tb,0,0);
		if (typeof items !== 'undefined'){
			drawItem(items);			
		}			
	};
	tb.src = src;
}

function getMousePos(canvas, evt){
	var feld = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - feld.left,
		y: evt.clientY - feld.top
	}
}

function doAction() {
	for (var a = 0; a < actions.length; a++){
		if (mousePos.x > actions[a].x1 && mousePos.x < actions[a].x2 && mousePos.y > actions[a].y1 && mousePos.y < actions[a].y2){
			//console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y + ', Function to execute: ' + actions[a].execute);
			if (actions[a].itemRequired != 'none'){
				currAction = actions[a];
				databaseFetcher("town.php?request=true&person="+user+"&city="+city+"&station="+station+"&place="+place+"&request="+actions[a].itemRequired,executeAction);
			}	
			else
				actions[a].execute();
		}
	}
}

function executeAction(hasItem){
	if(hasItem === 'true')
		currAction.execute();
	else if (hasItem === 'true') {
		console.log(hasItem);
		alert(unescape('Du ben%F6tigst folgenden Gegenstand: '+currAction.itemRequired));
	}
}

var Action = function(name,itemRequired,onlyOnce,x1,y1,x2,y2,execute,hover) {
	this.name = name;
	this.itemRequired = itemRequired;
	this.onlyOnce = onlyOnce;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.execute = new Function(execute);
	this.hover = new Function(hover);
	console.log('Neue Aktion erzeugt: ' + this.name + this.itemRequired + this.onlyOnce + this.x1 + this.y1 + this.x2 + this.y2 + this.execute + this.hover);
}

//Gegenstandsverwaltung
var Item = function(id,cost,valid,name,description,actionToEliminate,src,x,y,sx,sy) {
	this.id = id;
	this.cost = cost;
	this.valid = valid;
	this.name = name;
	this.description = description;
	this.actionToEliminate = actionToEliminate;
	this.src = src;
	this.x = x;
	this.y = y;
	this.sx = sx;
	this.sy = sy;
	console.log('Gegenstand mit folgenden Eigenschaften erzeugt: ' + this.id + ',' + this.cost + ',' + this.valid +  ',' + this.name + ',' + this.description + ',' + this.src + ',' + this.x + ',' + this.y + ',' + this.sx + ',' + this.sy);
};

var ActionItem = function(src,x,y,sx,sy) {
	this.src = src;
	this.x = x;
	this.y = y;
	this.sx = sx;
	this.sy = sy;
	console.log('Gegenstand mit folgenden Eigenschaften entdeckt: ' + this.src + ',' + this.x + ',' + this.y + ',' + this.sx + ',' + this.sy);
};

function drawItem(items){
	for (var i = 0; i < items.length; i++){
		var x = items[i].x;
		var y = items[i].y;
		var sx = items[i].sx;
		var sy = items[i].sy
		var tb2 = new Image();		
		tb2.onload = function() {
			console.log('Gegenstand geladen.' + x + ',' + y + ',' + sx + ',' + sy);
			ctx.drawImage(tb2,x,y,sx,sy);
			ctx.strokeRect(x,y,sx,sy);
		}
		tb2.src = items[i].src;
		console.log('Quelle des nächsten Gegenstandes = ' + tb2.src);
	}
}

//Anzeige von Stadtkarten
function showMap(mapFile,xPoint,yPoint){
	steuerfeld.hidden = true;
	karte = document.getElementById('zusatzfeld');
	var kartenzeichner = karte.getContext('2d');
	var map = new Image();
	map.src = mapFile;
	map.onload = function() {
		karte.width = map.width;
		karte.height = map.height;
		kartenzeichner.drawImage(map,0,0);
		var point = kartenzeichner.createRadialGradient(xPoint,yPoint,5,xPoint,yPoint,20);
		point.addColorStop(0,"red");
		point.addColorStop(1,"white");
		kartenzeichner.beginPath();
		kartenzeichner.arc(xPoint,yPoint,20,0,2*Math.PI);
		kartenzeichner.closePath();
		kartenzeichner.fillStyle = point;
		kartenzeichner.fill();
		document.getElementById('buttons').innerHTML = '<input type="button" value="Zur&uuml;ck" onclick=hideMap()>';
		karte.hidden = false;
	}
}

function hideMap(){
	steuerfeld.hidden = false;
	karte.hidden = true;
	document.getElementById('buttons').innerHTML = '<input type="button" value="Inventar anzeigen" onclick=showInventory()>';
}

//Züge
function random(stationNumber,city,placeGroup,numOfPlaces){
	var letter = 97;
	var currentLetter = new Array(numOfPlaces);
	for(var i = 0; i < numOfPlaces; i++){
		currentLetter[i] = String.fromCharCode(letter);
		letter++;
		console.log(currentLetter[i]);
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

function mountLine(city,line,entry,stationNumberGrowing){
	nextTrainSet = false;
	this.line = line;
	this.stationNumberGrowing = stationNumberGrowing;
	cityDB = city;
	databaseFetcher("town.php?onLine=true&city="+city+"&line="+line+"&entry="+entry+"&stationNumberGrowing="+stationNumberGrowing,voyage,false);
}

function voyage(response){
	//document.getElementsByTagName("h1")[0].innerHTML = response;
	var object = JSON.parse(response);
	document.getElementById("stationname").innerHTML = object.lineName;
	document.getElementById("fliesstext").innerHTML = object.text.replace(/!NL/g,"<br> <br>");
	document.getElementById("schild").src = object.lineImage;
	drawBackground(object.image,0,0,undefined);
	document.getElementById("ohr").innerHTML = '<audio controls autoplay=true onended="askExit(\''+object.nextStation+'\',\''+object.nextCity+'\',\''+object.nextPlace+'\')"><source src="'+object.sound+'" type="audio\/mp3"><\/audio>';
	//console.log(object.image[2]);
}

//Formulare
function seekForm(city,formName){
	databaseFetcher("town.php?city="+city+"&form="+formName,function(response){
		document.getElementById('steuerfeld').style.display = 'none';
		document.getElementById('richtungsanzeige').innerHTML = ' ';
		document.getElementById('inventory').style.display = 'none';
		document.getElementById('formular').innerHTML = response;
	});
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
}

//Steuerfeld-Zusatzfunktionen
function directionChange(movement){
	//console.log('Methode 1 aufgerufen!');
	document.getElementById("richtungsanzeige").innerHTML = movement;
}	

function directionNull(){
	//console.log('Methode 2 aufgerufen!');
	document.getElementById("richtungsanzeige").innerHTML = "Kein Feld angew&auml;hlt";
}

function askExit(currentStation,city,place){
	document.getElementById("ohr").innerHTML = '';
	if (confirm('Moechtest du hier aussteigen?') == true){
		writeStation(currentStation,city,place);
	}
	else {
		databaseFetcher("town.php?onLine=true&city="+cityDB+"&line="+line+"&entry="+currentStation+"&stationNumberGrowing="+stationNumberGrowing,voyage,false);
	}
}

// Debug-Kontrollfunktionen:

function noAction(whatShouldHappen){
	alert("Sorry, this method is not implemented yet. Report the programmer that this should have happen here:\n" + whatShouldHappen + "\nBy then, you should take:\n Your first cup of Java: Hello World!!");
}

function seekArray(array){
	for (var i = 0; i < array.length; i++)
		console.log("Arrayparameter " + i + ": " + array[i]);
}

// Funktionsbausteine
// writeStation(0,'ninaciudad','nextPlace')
// directionChange('Muss noch eingebaut werden!')
// mountLine('city','line',entry,stationNumberGrowing)
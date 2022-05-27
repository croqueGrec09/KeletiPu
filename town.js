/* client-side functions for Keleti pályaudvar - the game
author: András Gálffy, agalffy@smail.uni-koeln.de / marticula number 5584124

general client-handling functions which are linked to town movement in general (but not for a town in special!)
version 0.701 from July 7th, 2017

list of do's: ##1XX, next: TODO #100
*/

//session-wide - variables valid over several javascripts
//the currently picked action
currAction = null;
//the currently playing user, client-side instance
currUser = new User();
//variable for the description text saving
descriptionText = null;
//the main path for the game, if incorrectly set, the application will not work!
gameRoot = "/Keleti_pu/";
//the subpath for the analysis cities, the misspelling of analysiscities is historical and a change will cause loading malfunction
analysiscitiesPath = gameRoot+"analysyscities/";
//the current place at which the player currently is
currPlace = null;
//the current actions at a dialog point the user may take
currDialogActions = null;
//array container for dialog/happening action chains
pendingActions = [];
//an initial minute for the clock animation
initMinute = Math.floor(Math.random()*60);
//the next minute based upon the initial
nextMinute = initMinute+1;
//an initial hour for the clock animation
initHour = Math.floor(Math.random()*360);

// functions valid over several javascripts
// loads the new place data into the frontend
function updateScreen(screenData) {
	//map response to global variable so that it is accessible in the city-related subscripts
	currPlace = screenData;
	//screenData or currPlace is keeping the current location of the player and maps exactly the XML structure in a JSON object
	$("#stationName").html('<h1>'+currPlace.name+'</h1>');
	descriptionText = currPlace.content.replace(/!NL/g,"<br>");
	$("#background").attr("src",analysiscitiesPath+currPlace.imagePath);
	//clear the old action fields and unpicked items
	$("#controlArea").html("");
	$(".item").remove();
	//insert new action fields
	$.each(currPlace.actions, function(actionName, action){
		var points = '';
		var coords = action.coords;
		//convert relative coordinates to absolute ones for SVG canvas
		for(var i = 0;i < coords.length; i++){
			point = coords[i].split(",");
			points += Math.floor($("#background").width()*(point[0]/100))+",";
			points += Math.floor($("#background").height()*(point[1]/100))+" ";
		}
		points = points.slice(0,-1);
		//draw action illustration images (such as the glove in "Never give up")
		if(typeof(action.actionImage) !== "undefined"){
			drawItem(actionName, action.actionImage);
		}
		//set up and draw action fields
		//function name conversion to string does not work when functions are generated within the document-ready callback
		let methods = Object.keys(action.execute);
		$("#controlArea").append('<polygon id="'+actionName+'" class="areaField '+methods.join(" ")+'" points="'+points+'"/>');
	});
	//for Firefox: reload main container to display appended SVG elements
	$("#mainWrapper").html($("#mainWrapper").html());
	//display description text and backdrop field
	$("#backdrop").fadeIn();
	$("#textCommunicationWrapper").fadeIn();
	$("#textCommunicationField").html(descriptionText);
}

// draws the given images to the place of action
function drawItem(action, item){
	//convert relative coordinates to absolute points
	const position = convertCoords(item.cx1,item.cy1);
	const length = convertCoords(item.xl,item.yl);
	//insert image element and position it
	$("#controlArea").before('<img id="'+action+'Img" class="item" src="'+analysiscitiesPath+item.src+'" />');
	$("#"+action+"Img").css({
		"top": position.y,
		"left": position.x,
		"width": length.x,
		"height": length.y
	});
}

// gets the class of the given item. The class is important to determine its function and usability
function getItemClass(item) {
	const itemClass = $.ajax({
		url: gameRoot+"getItemClass/"+item
	}).done(function(response){
		return response;
	}).fail(function(xhr,textStatus,error){
		alert("An error occurred, please consult script:\n"+textStatus+": "+error);
	});
	return itemClass;
}

// hides the elements of the main control panel
function savePanel(){
	$("#controlArea, #directionIndicator, #buttonRow, #imprint, #clock, #clockField").hide();
}

// shows initially hiden panels except the clock
function restorePanel(){
	$("#controlArea, #directionIndicator, #buttonRow, #imprint").show();
}

// defines the static text fields accoring to the given language
function defineButtons(lang){
	let textShow = "show description text for field";
	let invShow = "show inventory";
	let questShow = "show quests";
	let nextPointText = "click to next point or to skip film";
	let closeBackdropText = "click here to return to game";
	let questEnumHeaderText = "Quest list - keep your tasks always in mind!";
	let mandatoryHeadingText = "Mandatory quests";
	let optionalHeadingText = "Optional quests";
	let noteBlockHeader = "Personal note block";
	let noteBlockSubheader = "For everything what does not find place in the own brain!";
	let noteBlockTableHeader = "<th>Currently inserted notes</th><th>click to one to edit it or to the bottom row to insert a new one</th>";
	let newNoteText = "insert new note";
	let namePlaceholer = "Enter note name here";
	let noteContentPlaceholder = "Insert note content here";
	let submitNoteText = "Submit";
	let deleteNoteText = "Delete note";
	switch(currUser.getLang()) {
		case "de": textShow = "Beschreibungstext anzeigen";
			invShow = "Inventar anzeigen";
			questShow = "Quests anzeigen";
			nextPointText = "Klicke hier, um fortzufahren oder Film überspringen";
			closeBackdropText = "Klicke hier, um zum Spiel zurückzukehren";
			questEnumHeaderText = "Questliste - behalte deine Aufgaben stets im Auge!";
			mandatoryHeadingText = "Obligatorische Quests";
			optionalHeadingText = "Optionale Quests";
			noteBlockHeader = "Persönlicher Notizblock";
			noteBlockSubheader = "Für alles, was in deinem Gehirn keinen Platz mehr findet!";
			noteBlockTableHeader = "<th>Derzeit eingetragene Notizen</th><th>klicke auf einen, um ihn zu bearbeiten, oder auf die unterste Reihe, um eine neue hinzuzufügen<th>";
			newNoteText = "neue Notiz hinzufügen";
			namePlaceholer = "Namen der Notiz hier eingeben";
			noteContentPlaceholder = "Text der Notiz hier eingeben";
			submitNoteText = "Bestätigen";
			deleteNoteText = "Notiz löschen";
		break;
		case "hu": textShow = "mutasd a leíró szöveget";
			invShow = "mutasd a tárgyaidat";
			questShow = "mutast a feladataidat";
			nextPointText = "Kattints a következő helyre vagy a film átugrására";
			closeBackdropText = "Kattints ide, hogy a játékhoz visszatérj";
			questEnumHeaderText = "Feladatlista - tartsd mindig szem előtt a feladataidat!";
			mandatoryHeadingText = "Kötelező feladatok";
			optionalHeadingText = "Fakultativ feladatok";
			noteBlockHeader = "Személyes jegyzettömb";
			noteBlockSubheader = "Mindenre, ami az agyadban már nem kap helyet!";
			noteBlockTableHeader = "<th>Pillanatnyilag beírt jegyzetek</th><th>kattints valamelyikre, hogy megváltoztasd, vagy a legalsó sorba, hogy egy újat írjál</th>";
			newNoteText = "új jegyzetet hozzáadni";
			namePlaceholer = "Jegyzet neve";
			noteContentPlaceholder = "Jegyzet szövege";
			submitNoteText = "Elfogad";
			deleteNoteText = "Jegyzet törlése";
		break;
		case "fr": textShow = "afficher text de déscription";
			invShow = "afficher inventaire";
			questShow = "afficher quêtes";
			nextPointText = "Cliquer pour passer au prochain point ou faire passer le film";
			closeBackdropText = "Cliquer pour retourner au jeu";
			questEnumHeaderText = "Liste des quêtes - garde ted devoirs toujours en vue !";
			mandatoryHeadingText = "Quêtes obligatoires";
			optionalHeadingText = "Quêtes optionels";
			noteBlockHeader = "Carnet des notes personel";
			noteBlockSubheader = "Pour tout ce qui ne trouve plus de place dans ton cerveau !";
			noteBlockTableHeader = "<th>Notes entrées pour l'instant</th><th>clique sur n'importe quelle pour le modifier ou dans la ligne tout en bas pour écrire une nouvelle note<th>";
			newNoteText = "ajouter nouvelle note";
			namePlaceholer = "Saisir nom de la note";
			noteContentPlaceholder = "Saisir texte de la note";
			submitNoteText = "Confirmer";
			deleteNoteText = "Effacer note";
		break;
	}
	$("#happeningOverlay h3").text(nextPointText);
	$("#backdrop h3").text(closeBackdropText);
	$("#textShow").val(textShow);
	$("#invShow").val(invShow);
	$("#questShow").val(questShow);
	$("#questEnumerationHeader").text(questEnumHeaderText);
	$("#mandatoryTable th").text(mandatoryHeadingText);
	$("#optionalTable th").text(optionalHeadingText);
	$("h4.noteBlockHeader").text(noteBlockHeader);
	$("h5.noteBlockHeader").text(noteBlockSubheader);
	$("tr.noteBlockHeader").html(noteBlockTableHeader);
	$("#newNoteText").text(newNoteText);
	$("#name").attr("placeholder",namePlaceholer);
	$("#noteContent").attr("placeholder",noteContentPlaceholder);
	$("#submitNotebookNote").text(submitNoteText);
	$("#deleteNotebookNote").text(deleteNoteText);
}

// convert relative coordinates into absolute pixel values
function convertCoords(oldx,oldy) {
	const ret = {
		x: Math.floor($("#background").width()*(oldx/100)),
		y: Math.floor($("#background").height()*(oldy/100))
	}
	return ret;
}

//start of local functions, hook event handling here
$(document).ready(function(){
	//script-wide variables
	//move forward or backward on a line
	var forward = false;
	//flag to check whether a new train has to be loaded when skipping one at a station
	var nextTrainSet = false;
	//in case of a rendered voyage, this is the interval in seconds in which a new image is loaded
	var imgInterval = 10; //default value
	
	//start game
	$("#stationName, #warped").fadeIn();
	$("#h1").css({"margin": "0% 25%"});
	$("#h2").css({"margin": "0% 20%"});
	
//------------------------------------------------------------------ event handling area ---------------------------------------------------------------------
	
	//leads the potential user to the language loading screen; starts the app
	$("#mainWrapper").on("click",".startGame",function(){
		$("#background, #warped").removeClass("startGame");
		$("h2").fadeOut();
		$("#warped").fadeOut();
		//desactivate event listener on h1 element
		$("#mainWrapper").off("mouseover mouseout","h1");
		$.ajax({
			url: gameRoot+"initGame"
		}).done(function(response) {
			$(".normal, h1, h2").animate({margin:0});
			$("#directionIndicator").empty();
			$("#buttonRow").fadeIn({"complete":function(){
				$("#controlArea").css({"z-index":2});
				updateScreen(response);
			}});
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	});
	
	//reveals the changelog and hides the outline
	$("#mainWrapper").on("mouseover","h1",function(){
		$("#outline").fadeOut();
		$("#changelog").fadeIn();
	});
	
	//hides the changelog and reveals the outline (reverse of h1 mouseover)
	$("#mainWrapper").on("mouseout","h1",function(){
		$("#changelog").fadeOut();
		$("#outline").fadeIn();
	});
	
	//changes the direction indicator
	$("#mainWrapper").on("mouseover",".areaField",function(){
		$(this).animate({"opacity":"0.4"});
		$("#directionIndicator").html(currPlace.actions[$(this).attr("id")].hover);
	});
	
	//resets the direction indicator and defines the field accoring to the user's language
	$("#mainWrapper").on("mouseout",".areaField",function(){
		var directionNullText = "No field chosen!";
		switch(currUser.getLang()) {
			case "de": directionNullText = "Kein Feld angew&auml;hlt!";
			break;
			case "hu": directionNullText = "Nem jel&ouml;lt&eacute;l mez&#337;t!";
			break;
			case "fr": directionNullText = "Pas de champ choisi !";
			break;
		}
		$(this).animate({"opacity":"0.2"});
		$("#directionIndicator").html(directionNullText);
	});
	
	//fetches the currently clicked action so that it may be processed among all javascripts
	$("#mainWrapper").on("click",".areaField",function(){
		//pick the action node from the array
		currAction = currPlace.actions[$(this).attr("id")];
		//store the chosen action name
		currAction.name = $(this).attr("id");
	});
	
	//sets the language for the current user and leads the user to the start game page
	$("#mainWrapper").on("click",".setLang",function(){
		const exec = currAction.execute["setLang"];
		currUser.setLang(exec.lang);
		//load start screen for given language
		var settings = gameRoot+"startGame/"+currUser.getLang();
		$.ajax({
			url: settings,
		}).done(function(response) {
			//set start screen
			updateScreen(response);
			//set button texts
			defineButtons(currUser.getLang());
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+
				  textStatus+": "+error);
		});
	});
	
	//shows the description text for the current field
	$("#mainWrapper").on("click","#textShow",function(){
		//activate Bootstrap-like backdrop
		$("#backdrop").fadeIn();
		$("#textCommunicationWrapper").fadeIn();
		//show text field
		$("#textCommunicationField").html(descriptionText);
	});
	
	//asks the user for his name - log in field to determine if a new game has to be started or a started game to be continued
	$("#mainWrapper").on("click",".askUser",function(){
		var askName = "Enter your username here. If you don't have an account, enter 'TestPerson' to start a new game: ";
		var invalidName = "Invalid name./nEnter your username here. If you don't have an account, enter 'TestPerson' to start a new game: ";
		var errorNull = "No game started!";
		switch (currUser.getLang()){
		case "de": {
			askName = "Gib hier deinen Benutzernamen ein, solltest du kein Konto haben, gebe bitte 'TestPerson' f%FCr ein neues Spiel ein: ";
			invalidName = "Ung%FCltiger Name.\nGib hier deinen Benutzernamen ein, solltest du kein Konto haben, gebe bitte 'TestPerson' f%FCr ein neues Spiel ein: ";
			errorNull = "Kein Spiel gestartet!";
			}
		break;
		case "hu": {
			askName = "Add be a felhasználónevedet, ha nem vagy m%E9g bejegyezve, akkor %EDrd azt, hogy 'TestPerson', hogy egy %FAj j%E1t%E9kot kezdj%E9l: ";
			invalidName = "N%E9v nincs a jegyz%E9kben.\nAdd be a felhasználónevedet, ha nem vagy m%E9g bejegyezve, akkor %EDrd azt, hogy 'TestPerson', hogy egy %FAj j%E1t%E9kot kezdj%E9l: ";
			errorNull = "J%E1t%E9k nem indult el!";
			}
		break;
		case "fr": {
			askName = "Entre ton nom d'utilisateur ici, si tu n'avais pas de compte, entre 'TestPerson' pour d%E9marrer un nouveau jeu: ";
			invalidName = "Nom ne pas trouv%E9.\nEntre ton nom d'utilisateur ici, si tu n'avais pas de compte, entre 'TestPerson' pour d%E9marrer un nouveau jeu: ";
			errorNull = "Pas de jeu d%E9marr%E9 !";
			}
		break;
		}
		//the prompt in which the user is asked his username
		user = prompt(unescape(askName));
		//no name entered
		if (user.trim().length === 0)
			user = prompt(unescape(invalidName));
		else if (user === null){
			alert(unescape(errorNull));
		}
		else {
			//try to load user data
			var url = gameRoot+"loadGame/"+user;
			//start game
			if(user === "TestPerson")
				url += "/"+currUser.getLang();
			else {
				$("#invShow").show();
				
			}
			$.ajax({
				url: url,
			}).done(function(response) {
				//restore loaded game or report invalid user
				if(response !== "false") {
					currUser.setUserData(response.userData);
					if(currUser.hasItem("notebook")) {
						$("#questShow").show();
					}
					defineButtons(currUser.getLang());
					updateScreen(response.place);
				}
				else prompt(unescape(invalidName))
			}).fail(function(xhr,textStatus,error) {
				alert("An error occurred, please consult script:\n"+textStatus+": "+error);
			});
			
		}
	});
	
	//move in station
	$("#mainWrapper").on("click",".movement",function(){
		//remove animation residuals
		$("#backdrop,#textCommunicationWrapper").removeAttr("style");
		const exec = currAction.execute["movement"];
		if(currUser.getNumber() !== exec.nextStation)
			randomLetterIndex = 0;
		//store next field data (city, place and station number)
		currUser.setTown(exec.nextCity);
		currUser.setPlace(exec.nextPlace);
		currUser.setNumber(exec.nextStation);
		//execute actual movement
		move();
	});
	
	//activate a ticket machine. Hides normal control panel and triggers the ticket machine
	//loadHome(machineImage) is defined in karlstadt.js
	$("#mainWrapper").on("click",".useMachine",function(){
		const exec = currAction.execute["useMachine"];
		savePanel();
		loadHome(exec.machineImage);
	});
	
	//leave a ticket machine (reverse of .useMachine)
	$("#mainWrapper").on("click","#leaveMachine",function(){
		restorePanel();
		$("#automatOutput").hide();
		$("#background").css({opacity:0.6}).attr("src",analysiscitiesPath+currPlace.imagePath);
	});
	
	//item pickup handler section: adds item picked up to client- and server-side inventory and remove the action image
	$("#mainWrapper").on("click",".itemPickup",function(){
		const exec = currAction.execute["itemPickup"];
		currUser.addItem({"id":exec.triggeredItem,"valid":exec.triggeredValidity});
		$(this).fadeOut().remove();
		$("#"+currAction.name+"Img").fadeOut().remove();
	});
	
	//triggers notebook display
	$("#mainWrapper").on("click",".notebook",function(){
		$("#noteBlockWrapper").fadeIn();
		$.each(currUser.getNotebookNotes(),function(index,note){
			const tableRow = '<tr data-index="'+index+'" class="notebookNote"><td>'+index+'</td><td>'+note+'</td></tr>';
			$("#newNotebookNote").before(tableRow);
		});
	});
	
	//opens the form for note editing
	$("#mainWrapper").on("click",".notebookNote",function(){
		editNote($(this).attr("data-index"));
	});
	
	//opens the form for a new note
	$("#mainWrapper").on("click","#newNotebookNote",function(){
		editNote("new");
	});
	
	//deletes a note
	$("#mainWrapper").on("click","#deleteNotebookNote",function(e){
		e.preventDefault();
		let notebook = currUser.getNotebookNotes();
		delete notebook[$("#name").val()];
		currUser.setNotebookNotes(notebook);
		$('[data-index="'+$("#name").val()+'"]').remove();
		$.ajax({
			url: gameRoot+"deleteNotebookNote/"+currUser.getUsername()+"/"+$("#name").val(),
		}).done(function(response){
			$("#noteBlockWrapper form").fadeOut();
			$("#noteBlockWrapper table").fadeIn();
			$("#name,#noteContent").empty();
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	});
	
	//submit the note content
	$("#mainWrapper").on("click","#submitNotebookNote",function(e){
		e.preventDefault();
		//validate entries
		let errorArray = {};
		$(".error").remove();
		if($("#name").val().length === 0) {
			errorArray.name = true;
			switch(currUser.getLang()) {
				case "de": $("#name").before('<span class="error">Kein Name eingegeben!</span>');
				break;
				case "hu": $("#name").before('<span class="error">Nem adtál be nevet!</span>');
				break;
				case "fr": $("#name").before('<span class="error">Pas de nom entré !</span>');
				break;
				case "en": $("#name").before('<span class="error">No name entered!</span>');
				break;
			}
		}
		if($("#noteContent").val().length === 0) {
			errorArray.content = true;
			switch(currUser.getLang()) {
				case "de": $("#noteContent").before('<span class="error">Keine Notiz eingegeben!</span>');
				break;
				case "hu": $("#noteContent").before('<span class="error">Nem adtál be jegyzetet!</span>');
				break;
				case "fr": $("#noteContent").before('<span class="error">Pas de note entrée !</span>');
				break;
				case "en": $("#noteContent").before('<span class="error">No note entered!</span>');
				break;
			}
		}
		if(Object.values(errorArray).length === 0) {
			const newNote = {};
			newNote[$("#name").val()] = $("#noteContent").val();
			let notebook = currUser.getNotebookNotes();
			notebook[$("#name").val()] = $("#noteContent").val();
			currUser.setNotebookNotes(notebook);
			newNote["user"] = currUser.getUsername();
			if($("[data-index='"+$("#name").val()+"']").length === 0) {
				const tableRow = '<tr data-index="'+$("#name").val()+'" class="notebookNote"><td>'+$("#name").val()+'</td><td>'+$("#noteContent").val()+'</td></tr>';
				$("#newNotebookNote").before(tableRow);
			}
			else if($("[data-index='"+$("#name").val()+"']").length > 0) {
				$("[data-index='"+$("#name").val()+"'] td")[1].innerHTML = $("#noteContent").val();
			}
			$.ajax({
				url: gameRoot+"updateNotebookNote/",
				method: "POST",
				data: newNote
			}).done(function(response){
				$("#noteBlockWrapper form").fadeOut();
				$("#noteBlockWrapper table").fadeIn();
				$("#name,#noteContent").empty();
			}).fail(function(xhr,textStatus,error) {
				alert("An error occurred, please consult script:\n"+textStatus+": "+error);
			});
		}
	});
	
	//highlights the clicked field
	$("#mainWrapper").on("mousedown","#currentNotes tr",function(){
		$(this).addClass("clicked");
	});
	
	//dehighlights a clicked field
	$("#mainWrapper").on("mouseup","#currentNotes tr",function(){
		$(this).removeClass("clicked");
	});
	
	//closes notebook or changes from form to list view
	$("#mainWrapper").on("click","#backdrop, #closeNotebook",function(){
		if($("#noteBlockWrapper form").is(":visible")) {
			$("#noteBlockWrapper form").fadeOut();
			$("#noteBlockWrapper table").fadeIn();
		}
		else {
			$("#noteBlockWrapper").fadeOut();
			$(".notebookNote").remove();
		}
		$("#name, #noteContent").val("");
	});
	
	//triggers map opening from a game place
	$("#mainWrapper").on("click",".showMap",function(){
		const exec = currAction.execute["showMap"];
		showMap({"mapFile":exec.mapFile,"forTown":exec.forTown});
	});
	
	//triggers map opening from inventory
	$("#mainWrapper").on("click",".map",function(){
		showMap({"mapFile":$(this).attr("data-mapFile"),"forTown":$(this).attr("data-forTown")});
	});
	
	//closes the map view (reverse of .map / .showMap)
	$("#mainWrapper").on("dblclick","#map",function(){
		$("#mapImage").css({"width":"100%","height":"100%","top":"0px","left":"0px"});
		$("#posDesc").hide();
		$("#map").hide();
		$("circle").remove();
		restorePanel();
		$("#stationName").show();
	});
	
	//zooms in a map
	$("#mainWrapper").on("mousedown","#zoomIn",function(){
		$("#mapImage, #mapControl").width($("#mapImage, #mapControl").width() * 1.15);
		$("#mapImage, #mapControl").height($("#mapImage, #mapControl").height() * 1.15);
		$("circle").each(function(i){
			$(this).attr("cx",$(this).attr("cx") * 1.15);
			$(this).attr("cy",$(this).attr("cy") * 1.15);
		});
		//make map element draggable only in case of zoom!
		if($("#mapImage, #mapControl").width() > $("body").width()) {
			$("#map").draggable();
		}
	});
	
	//zooms out a map (reverse of #zoomIn)
	$("#mainWrapper").on("mousedown","#zoomOut",function(){
		if($("#mapImage, #mapControl").width() < $("body").width())
			$("#map").draggable('disable');
		$("#mapImage, #mapControl").width($("#mapImage, #mapControl").width() * 0.85);
		$("#mapImage, #mapControl").height($("#mapImage, #mapControl").height() * 0.85);
		$("circle").each(function(i){
			$(this).attr("cx",$(this).attr("cx") * 0.85);
			$(this).attr("cy",$(this).attr("cy") * 0.85);
		});
	});
	
	//initiates train waiting sequence
	$("#mainWrapper").on("click",".random",function(){
		const exec = currAction.execute["random"];
		//set town and station number
		currUser.setTown(exec.city);
		currUser.setNumber(exec.station);
		//get count of possible states
		var numOfPlaces = exec.situationCount;
		//set to ASCII 'a'
		var letter = 97;
		//initialise array of possible states
		var currentLetter = new Array(numOfPlaces);
		//fill array up
		for(var i = 0; i < numOfPlaces; i++){
			currentLetter[i] = String.fromCharCode(letter);
			letter++;
		}
		//determine by random is a train arrives
		var trainState = Math.random();
		//if next train has not been set, set index of next train
		if(!nextTrainSet || typeof(currentLetter[randomLetterIndex]) === "undefined")
			setNextTrain(numOfPlaces);
		//get limit which has to be passed for train arrival
		if(typeof(exec.probabilityOfArrival) === "undefined") {
			if(numOfPlaces > 1)
				exec.probabilityOfArrival = 1/numOfPlaces;
			else exec.probabilityOfArrival = 0.25;
		}
		//if a train or bus arrives
		if (trainState <= exec.probabilityOfArrival){
			place = exec.platformGroup+currentLetter[randomLetterIndex];
			if (randomLetterIndex < numOfPlaces)
				randomLetterIndex++;
			else if (randomLetterIndex >= numOfPlaces)
				randomLetterIndex = 1;
			currUser.setPlace(place);
			$("#clock, #clockField").hide();
			initMinute = nextMinute;
			$("#hour, #minute").remove();
			move();
			setNextTrain(numOfPlaces);
		}
		else {
			//if no train arrives (= user has to wait)
			if(currUser.getPlace().search("noTrain") < 0) {
				currUser.setPlace(exec.platformGroup+"noTrain");
				move();
			}
			if($("#clock").is(":hidden")) {
				$("#clock, #clockField").show();
				const centreX = $("#clock").width()/2;
				const centreY = $("#clock").height()/2;
				const hourLength = $("#clock").height()/2.75;
				const minuteLength = $("#clock").height()/4;
				const minute = '<line id="minute" x1="'+centreX+'" y1="'+centreY+'" x2="'+centreX+'" y2="'+minuteLength+'"/>';
				const hour = '<line id="hour" x1="'+centreX+'" y1="'+centreY+'" x2="'+centreX+'" y2="'+hourLength+'"/>';
				$("#clockField").append(minute);
				$("#clockField").append(hour);
				$("line").css({'transform-origin': centreX+'px '+centreY+'px'});
				$("#minute").css({'transform':'rotate('+(initMinute*6)+'deg)'});
				$("#hour").css({'transform':'rotate('+((initHour-initHour%24)+initMinute*(24/60))+'deg)'});
				$("#mainWrapper").html($("#mainWrapper").html());
			}
			else if($("#clock").is(":visible")) {
				$("#minute").css({'transform':'rotate('+(nextMinute*6)+'deg)'});
				$("#hour").css({'transform':'rotate('+((initHour-initHour%24)+nextMinute*(24/60))+'deg)'});
				nextMinute++;
			}
		}
	});
	
	//trigger happening stream: reset train setting, get details and enter happening mode
	$("#mainWrapper").on("click",".happening",function(){
		const exec = currAction.execute["happening"];
		//show dark overlay which enables reading of light texts
		$("#happeningOverlay").show();
		$("#descriptionText").on("click",function(){
			$("#happeningOverlay").trigger("click");
		});
		savePanel();
		nextTrainSet = false;
		if(exec.forward === "true")
			forward = true;
		else if(exec.forward === "false")
			forward = false;
		happening(exec.happeningBase,exec.stream,exec.startID);
	});
	
	//mount line (= get on a train or bus), subset of happening trigger
	$("#mainWrapper").on("click",".mountLine",function(){
		var exec = currAction.execute["mountLine"];
		$("#happeningOverlay").show();
		//get needed ticket details
		$.ajax({
			url: gameRoot+"getItemDetails/"+exec.usedTicket+"/"+currUser.getLang()
		}).done(function(response){
			//check if user possesses ticket, report failure if ticket is missing or invalid
			if(currUser.checkTicket(exec.usedTicket) === true) {
				//if it is a single fare ticket, validate it
				if(response.itemClass === "singleFareTicket")
					currUser.validateTicket(exec.usedTicket);
				//reset next train and determine movement direction
				nextTrainSet = false;
				if(exec.forward === "true")
					forward = true;
				else if(exec.forward === "false")
					forward = false;
				//move
				happening(exec.happeningBase,exec.stream,exec.startID);
			}
			else if(currUser.checkTicket(exec.usedTicket) === "ticket invalid") {
				reportInvalidTicket(response);
			}
			else if(!currUser.checkTicket(exec.usedTicket)) {
				reportMissingItem(response);
			}
		}).fail(function(xhr,textStatus,error){
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
		
	});
	
	//get next point of happening
	$("#mainWrapper").on("click","#happeningOverlay",function(){
		var city = currAction.city;
		var line = currAction.line;
		//waypoint exit
		if(typeof(currAction.exitStream) !== "undefined"){
			$("#descriptionText").text("");
			//if the end of line is not reached, ask user if s/he wants to get off
			if((typeof(currAction.previousEvent) !== "undefined") && (typeof(currAction.nextEvent) !== "undefined")) {
				if(confirm(unescape(exitHere))){
					currUser.setTown(currAction.exitStream.nextCity);
					currUser.setNumber(currAction.exitStream.nextStation);
					currUser.setPlace(currAction.exitStream.nextPlace);
					move();
					$("#happeningOverlay").hide();
					$("#descriptionText").off("click");
					$("#buttons, #directionIndicator, #background").show();
					$("#ear").hide().empty();
				}
			}
			else {
				currUser.setTown(currAction.exitStream.nextCity);
				currUser.setNumber(currAction.exitStream.nextStation);
				currUser.setPlace(currAction.exitStream.nextPlace);
				move();
				$("#happeningOverlay").hide();
				$("#descriptionText").off("click");
				$("#buttons, #directionIndicator, #background").show();
				$("#ear").hide().empty();
			}
		}
		$("#textCommunicationWrapper").fadeOut();
		//work down other actions at this point
		if(pendingActions.length > 0) {
			workDownActions(pendingActions.pop());
		}
		//move according to direction
		if((typeof(currAction.previousEvent) !== "undefined") && !forward)
			happening(city,line,currAction.previousEvent);
		else if((typeof(currAction.nextEvent) !== "undefined") && forward)
			happening(city,line,currAction.nextEvent);
	});

	//trigger dialog mode: get dialog data and start dialog mode
	$("#mainWrapper").on("click",".dialog",function(){
		const exec = currAction.execute["dialog"];
		var dialogStartData = {
			"database": exec.dialogBase,
			"character": exec.character,
			"stream": exec.stream,
			"point": exec.point,
			"from": ""
		};
		dialog(dialogStartData);
	});
	
	//handles the response of the user
	$("#mainWrapper").on("click",".dialogItem",function(){
		actions = currDialogActions[$(this).attr("data-actionno")].command;
		//multiple command process loop
		$.each(actions,function(key,currAction){
			switch(key) {
				case "dialog": dialog(currAction,false);
				break;
				case "dialogChoice": dialog(currAction,true);
				break;
				case "event": 
					//change from dialog to happening mode
					exitDialog();
					$("#happeningOverlay").show();
					$("#descriptionText").on("click",function(){
						$("#happeningOverlay").trigger("click");
					});
					// for the moment, only streams forward are defined
					forward = true;
					happening(currAction.city,currAction.stream,currAction.entry);
				break;
				case "exit": exitDialog();
				break;
				case "giveMoney": currUser.manipulateMoney(currAction.amount,false);
				break;
				case "getMoney": currUser.manipulateMoney(currAction.amount,true);
				break;
				case "giveItem": currUser.removeItem(currAction.triggeredItem);
				break;
				case "getItem": currUser.addItem(currAction.triggeredItem);
				break;
			}
		});
	});
	
	//adds a quest to the user's memory
	$("#mainWrapper").on("click",".addQuest",function(){
		const exec = currAction.execute["addQuest"];
		currUser.addQuest(exec.targetQuest);
	});

	//shows all quests assigned to the user. The output is sorted in tables in mandatory vs. optional.
	$("#mainWrapper").on("click","#questShow",function(){
		$("#backdrop").fadeIn();
		currUser.listQuests("table");
	});
	
	//retrieve form data
	$("#mainWrapper").on("click",".seekForm",function(){
		seekForm($(this).attr("id"));
	});
	
	//show inventory
	$("#mainWrapper").on("click","#invShow",function(){
		currUser.displayInventory();
	});
	
	//hide opened window and return game controls
	$("#mainWrapper").on("click","#backdrop, #closeWindow",function(){
		if(pendingActions.length === 0 && $("#noteBlockWrapper").not(":visible")) {
			$("#backdrop").fadeOut();
			$("#textCommunicationWrapper").fadeOut();
			$("#questEnumerationWrapper").fadeOut();
		}
		else if(pendingActions.length > 0) {
			workDownActions(pendingActions.pop());
		}
	});
	
	//call external link
	$("#mainWrapper").on("click",".callLink",function(){
		const exec = currAction.execute["callLink"];
		switch(currUser.getLang()) {
		case "hu": window.open(exec.linkToCallHu);
		break;
		case "fr": window.open(exec.linkToCallFr);
		break;
		case "en": window.open(exec.linkToCallEn);
		break;
		default: window.open(exec.linkToCall);
		break;
		}
	});
	
	//reporting section - replaces some alerts
	//reports a missing item after getting its details
	$("#mainWrapper").on("click",".missingItemReport",function(){
		const exec = currAction.execute["missingItemReport"];
		$.ajax({
			url: gameRoot+"/getItemDetails/"+exec.triggeredItem+"/"+currUser.getLang()
		}).done(function(response){
			reportMissingItem(response);
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+
				  textStatus+": "+error);
		});
	});
	
	//reports an invalid ticket after getting its details
	$("#mainWrapper").on("click",".invalidTicketReport",function(){
		const exec = currAction.execute["invalidTicketReport"];
		$.ajax({
			url: gameRoot+"/getItemDetails/"+exec.triggeredItem+"/"+currUser.getLang()
		}).done(function(response){
			reportInvalidTicket(response);
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+
				  textStatus+": "+error);
		});
	});
	
	// debugging functions
	// action dummy for fields - keeping in the developer's mind what he should implement here
	$("#mainWrapper").on("click",".noAction",function(){
		const exec = currAction.execute["noAction"];
		alert("Sorry, this method is not implemented yet. Report the programmer that this should have happen here:\n" + exec.whatShouldHappen + "\nBy then, you should take:\n Your first cup of Java: Hello World!!");
	});
	
//------------------------------------------------------------ local function area ---------------------------------------------------------------------

	// moves the user to a given position and initiates the screen reload
	function move() {
		//get currently stored place data
		$.ajax({
			url: gameRoot+"move/"+currUser.getUsername()+"/"+currUser.getTown()+"/"+currUser.getNumber()+"/"+currUser.getPlace()
		}).done(function(response) {
			//hand retrieved place data to screen replacal function
			updateScreen(response);
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+
				  textStatus+": "+error);
		});
	}

	// sets randomly the next train index
	function setNextTrain(numOfPlaces){
		randomLetterIndex = Math.floor(Math.random()*numOfPlaces);
		if (randomLetterIndex >= numOfPlaces) randomLetterIndex--;
			nextTrainSet = true;
	}
	
	// lets the user occur a happening, defined by the given parameters
	function happening(city,line,point){
		//enter happening mode by switching off control panel elements
		$("#buttons, #directionIndicator").fadeOut();
		//get given point of happening stream
		$.ajax({
			url: gameRoot+"happening/"+city+"/"+line+"/"+point+"/"+currUser.getLang()
		}).done(function(response){
			//set up chain of actions, process elements backwards because we will use array.pop()
			if(typeof(response.otherHappenings) !== "undefined") {
				for(let i = response.otherHappenings.length-1;i > -1;i--) {
					pendingActions.push(response.otherHappenings[i]);
				}
			}
			//fill current point data (equivalent to updateScreen for normal area movements)
			$("#controlArea").empty();
			$("h1").text(response.name);
			//determine point type
			if(typeof(response.text) !== "undefined") {
				$("#descriptionText").html(response.text.replace(/!NL/g,"<br> <br>"));
				$("#background").attr("src",analysiscitiesPath+response.image);
			}
			else if(typeof(response.baseFile) !== "undefined") {
				//get interval in seconds in which a new overlay image will be displayed
				imgInterval = parseInt(response.imgInterval);
				$("#background").hide();
				//insert video element, mp4 with H.264 codec is mandatory
				$("#ear").append('<video id="baseVideo" autoplay><source src="'+analysiscitiesPath+response.baseFile+'" type="video/mp4"></video>').show();
				//insert event listeners for video, for functionality reasons, this is done with native javascript instead of jQuery
				document.addEventListener("timeupdate",function(e) {
					if($(e.target).is("#baseVideo")){
						let sec = Math.floor($("#baseVideo")[0].currentTime);
						//if interval is passed, load new image
						if(sec >= imgInterval) {
							$(".eventElement").remove();
							//get file path from array of file paths
							let nextFile = response.setImages[Math.floor(Math.random() * (response.setImages.length-1))];
							switch(nextFile.dataType){
								case "image": $("#ear").append('<img src="'+analysiscitiesPath+nextFile.filePath+'" class="eventElement">');
								break;
							}
							imgInterval += parseInt(response.imgInterval);
						}
					}
				}, true);
				//remove event listeners in case of video end
				document.addEventListener("ended",function(e) {
					if($(e.target).is("#baseVideo")){
						$("#ear").empty();
						$("#happeningOverlay").trigger("click");
						$("#background").show();
						document.removeEventListener("timeupdate");
						document.removeEventListener("ended");
					}
				}, true);
			}
			//set action node, city and line to global variable
			currAction = response;
			currAction.city = city;
			currAction.line = line;
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+
				  textStatus+": "+error);
		});
	}
	
	// enters the given dialog stream
	function dialog(dialogData,choice){
		savePanel();
		//enter dialog mode
		$("#background").animate({
			opacity: 0.2
		});
		var passedOptions = currUser.getDialogPoints();
		//set dialog options
		var dialogOptions = {
			user: currUser.getUsername(),
			city: dialogData.database,
			character: dialogData.character,
			stream: dialogData.stream,
			dialogPointsPassed: JSON.stringify(passedOptions)
		};
		//pointGrp has to be defined iff a choice of points has to be met! Cf. index.php, /dialog/ route!
		if(choice)
			dialogOptions.pointGrp = dialogData.pointGrp;
		else
			dialogOptions.point = dialogData.point;
		//load given point data
		$.ajax({
			url: gameRoot+"dialog/",
			dataType: "json",
			type: "POST",
			data: dialogOptions
		}).done(function(response){
			//get response details
			var reaction = response;
			//display response text
			$("#descriptionText").html(reaction.answer.replace(/!NL/g,"<br> <br>"));
			currDialogActions = reaction.action;
			//loop through actions at given point
			$.each(reaction.action, function(actionKey,action){
				//disable points
				if(typeof(action.disable) !== "undefined") {
					$.each(action.disable,function(d,disable) {
						if($.inArray(disable,currUser.getDialogPoints()) < 0)
							currUser.addDialogPoint(disable);
					});
				}
				//insert response texts
				$("#descriptionText").append('<p class="dialogItem" data-actionno="'+actionKey+'">'+action.response+'</p>');
			});
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+
				  textStatus+": "+error);
		});
	}
	
	// exits the current dialog stream and return normal control panel
	function exitDialog(){
		$("#background").animate({
			opacity: 0.8
		});
		//clear passed actions
		currUser.clearDialogMemory();
		$("#descriptionText").text("");
		restorePanel();
	}
	
	// loads a given form and replaces the control screen
	function seekForm(formId) {
		$("#descriptionText, #directionIndicator, #buttonRow").fadeOut();
		$("#background").animate({"opacity":0.2});
		//get form details
		$.ajax({
			url: gameRoot+"form/"+formId+"/"+currUser.getTown()+"/"+currUser.getLang()
		}).done(function(response) {
			//process each element and build up form page
			$.each(response,function(i,elem){
				var nextElem = "";
				switch(elem.type) {
					case "textInput": nextElem = '<label for="'+elem.id+'">'+elem.label+'</label><input type="text" id="'+elem.id+'" size="'+elem.size+'">';
					break;
					case "radio": 
					case "checkbox": nextElem = '<p>'+elem.label+'</p><ul>';
						$.each(elem.choice,function(c,choice){
							nextElem += '<li><label for="'+elem.id+c+'">'+choice.label+'</label><input type="'+elem.type+'" name="'+elem.id+'" id="'+elem.id+c+'" value="'+choice.value+'"></li>';
						});
						nextElem += '</ul>';
					break;
					case "finish": $("#submitFormData").attr({"class":elem.onclick,"value":elem.label});
					break;
				}
				$("#submitFormData").before(nextElem+"<br>");
			});
			$("#formWrapper").fadeIn();
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+
				  textStatus+": "+error);
		});
	}
	
	// opens the note editing form. If the argument is not "new", the form is opened for editing
	function editNote(noteKey) {
		$("#noteBlockWrapper table").fadeOut();
		if(noteKey !== "new") {
			const noteRow = $("[data-index='"+noteKey+"'] td");
			$("#name").val(noteRow[0].innerHTML);
			$("#noteContent").val(noteRow[1].innerHTML);
		}
		$("#noteBlockWrapper form").fadeIn();
	}
	
	// opens the map from any place
	function showMap(mapData) {
		//leave control panel
		savePanel();
		$("#stationName").hide();
		//set up style properties
		const mapStyleProperties = {
			"width":"100%",
			"height":"100%",
		};
		//display map including controls
		$("#mapImage").attr("src",analysiscitiesPath+mapData.mapFile).css(mapStyleProperties);
		$("#map, #posDesc").show();
		const pointCentre = convertCoords(currPlace.mapPointX,currPlace.mapPointY);
		if(mapData.forTown === currUser.getTown()) {
			$("#mapControl").append('<circle cx="'+pointCentre.x+'" cy="'+pointCentre.y+'" r="10" fill="red" filter="url(#f1)">'+
			'<animate attributeName="r" begin="0s" dur="0.3s" repeatCount="indefinite" from="0px" to="20px"/>'+
			'</circle>');
		}
		/*
			Anina's suggestions: 1. mark places where the player has already been
			2. mark NPCs
			left in as an in-code outlook for section 4 of the thesis paper
		*/
		//list points on map the player has to visit
		currUser.listQuests("points");
	}
	
	// reports a missing item according to given name
	function reportMissingItem(item) {
		var itemMissingText = "You need the following item: ";
		switch(currUser.getLang()){
			case "de":
				itemMissingText = "Du benötigst folgenden Gegenstand: ";
			break;
			case "hu":
				itemMissingText = "Hiányzik a következő tárgy: ";
			break;
			case "fr":
				itemMissingText = "Il te manque l'objet suivant :";
			break;
		}
		//display text in overlay field
		$("#backdrop").fadeIn();
		$("#textCommunicationWrapper").fadeIn();
		$("#textCommunicationField").html(itemMissingText+item.name);
	}
	
	// reports an invalid ticket 
	function reportInvalidTicket(ticket) {
		var ticketValidityText = " invalid!";
		switch(currUser.getLang()){
			case "de":
				ticketValidityText = " ungültig!";
			break;
			case "hu":
				ticketValidityText = " nem érvényes!";
			break;
			case "fr":
				ticketValidityText = " n'est pas valable !";
			break;
		}
		//display text in overlay field
		$("#backdrop").fadeIn();
		$("#textCommunicationWrapper").fadeIn();
		$("#textCommunicationField").html(ticket.name+ticketValidityText);
	}
	
	// works down pending actions
	/*
		procedure flow: if otherHappenings is set, then set up event listener for backdrop.
		On click: check if there are actions in array, pop next, delete after execution.
	*/
	function workDownActions(happeningVal) {
		switch(happeningVal.command){
			case "addItem":
			var itemData = {
				"id": happeningVal.triggeredItem,
				"valid": happeningVal.valid
			};
			currUser.addItem(itemData);
			break;
			case "removeItem":
			currUser.removeItem(happeningVal.triggeredItem);
			break;
			case "addMoney":
			currUser.manipulateMoney(happeningVal.amount,true);
			break;
			case "deductMoney":
			currUser.manipulateMoney(happeningVal.amount,false);
			break;
			case "addQuest":
			currUser.addQuest(happeningVal.targetQuest);
			break;
			case "updateQuest":
			currUser.updateQuest(happeningVal.targetQuest,happeningVal.chapter);
			break;
			case "completeQuest":
			currUser.completeQuest(happeningVal.targetQuest,happeningVal.success);
			break;
		}
	}
	
});	
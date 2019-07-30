/*
	Client-side representation of the current user. It is imitating OOP, using private class fields and getter/setter methods to 
	control input and output. Moreover, there are methods which ensure communication with the server and synchronisation with the 
	server-side user data.
	
	version: 0.701 from 7th July, 2018
	
	author: András Gálffy, andrisgalffy@gmail.com, matricula number #5584124
*/

var User = function() {
	var firstname = '';
	var lastname = '';
	var username = 'none';
	var useName = false;
	var lang = 'en';
	var loveInterests = [];
	var gender = 'm';
	var currentMoney = '0';
	var town = 'zeidel';
	var number = 'zd9999';
	var place = 'languageChooser';
	var inventory = [{id: 'bag', valid: 'none'}];
	var mapNotes = [];
	var notebookNotes = [];
	var actionsPassed = [];
	var questsMandatory = [];
	var questsOptional = [];
	var townsToVisit = ['zeidel'];
	//only client-side!
	var dialogPointsPassed = [];

	//getter and setter section
	this.setFirstname = function(newFirstname) {
		firstname = newFirstname;
	}
	
	this.getFirstname = function() {
		return firstname;
	}

	this.setLastname = function(newLastname) {
		lastname = newLastname;
	}
	
	this.getLastname = function() {
		return lastname;
	}
	
	this.setUsername = function(newUsername) {
		username = newUsername;
	}
	
	this.getUsername = function() {
		return username;
	}
	
	this.setUseName = function(newUseName) {
		useName = newUseName;
	}
	
	this.isUseName = function() {
		return isUseName;
	}
	
	this.setLang = function(newLang) {
		lang = newLang;
	}
	
	this.getLang = function() {
		return lang;
	}
	
	this.setLoveInterests = function(newLoveInterests) {
		loveInterests = newLoveInterests;
	}
	
	this.getLoveInterests = function() {
		return loveInterests;
	}
	
	this.setGender = function(newGender) {
		gender = newGender;
	}
	
	this.getGender = function() {
		return gender;
	}
	
	this.setMoney = function(newMoney) {
		currentMoney = parseInt(newMoney);
	}
	
	this.getMoney = function() {
		return currentMoney;
	}
	
	this.setTown = function(newTown) {
		town = newTown;
	}
	
	this.getTown = function() {
		return town;
	}
	
	this.setNumber = function(newNumber) {
		number = newNumber;
	}
	
	this.getNumber = function() {
		return number;
	}
	
	this.setPlace = function(newPlace) {
		place = newPlace;
	}
	
	this.getPlace = function() {
		return place;
	}
	
	this.setInventory = function(newInventory) {
		inventory = newInventory;
	}
	
	this.getInventory = function() {
		return inventory;
	}
	
	this.hasItem = function(item) {
		for(let i = 0;i < inventory.length;i++) {
			if(inventory[i].id === item)
				return true;
		}
		return false;
	}
	
	this.setMemory = function(newMemory) {
		this.setMapNotes(newMemory.mapNotes);
		this.setNotebookNotes(newMemory.notebookNotes);
		this.setActionsPassed(newMemory.actionsPassed);
		this.setQuestsMandatory(newMemory.questsMandatory);
		this.setQuestsOptional(newMemory.questsOptional);
		this.setTownsToVisit(newMemory.townsToVisit);
	}
	
	this.setMapNotes = function(newMapNotes) {
		mapNotes = newMapNotes;
	}
	
	this.getMapNotes = function() {
		return mapNotes;
	}
	
	this.setNotebookNotes = function(newNotebookNotes) {
		notebookNotes = newNotebookNotes;
	}
	
	this.getNotebookNotes = function() {
		return notebookNotes;
	}
	
	this.setActionsPassed = function(newActionsPassed) {
		actionsPassed = newActionsPassed;
	}
	
	this.getActionsPassed = function() {
		return actionsPassed;
	}
	
	this.addActionPassed = function(action) {
		actionsPassed.push(action);
	}
	
	//remove action passed from client side and synchronise with server side object/user data file
	this.removeActionPassed = function(actionName) {
		$.each(actionsPassed,function(i,action) {
			if(action.name === actionName)
				actionsPassed[i] = null;
		});
		$.ajax({
			url: gameRoot+"removeActionPassed/"+username+"/"+actionName
		}).done(function(response){
			$("#backdrop").fadeIn();
			$("#textCommunicationWrapper").fadeIn();
			$("#textCommunicationField").html(response[0].replace(/!NL/g,"<br>"));
		}).fail(function(xhr,textStatus,error){
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
	this.setQuestsMandatory = function(newQuestsMandatory) {
		questsMandatory = newQuestsMandatory;
	}
	
	this.getQuestsMandatory = function() {
		return questsMandatory;
	}

	this.setQuestsOptional = function(newQuestsOptional) {
		questsOptional = newQuestsOptional;
	}
	
	this.getQuestsOptional = function() {
		return questsOptional;
	}
	
	//adds a given quest, this method synchronises with the server side object/user data file
	this.addQuest = function(quest) {
		//submit quest adding to server and get as response its details to display to user
		$.ajax({
			url: gameRoot+"addQuest/"+username+"/"+quest,
			quest: quest
		}).done(function(response){
			//output response in the user's language
			let newQuest = "Quest added: "+response.name;
			switch(lang) {
				case "de": newQuest = "Aufgabe hinzugefügt: "+response.name;
				break;
				case "hu": newQuest = "Új küldetés: "+response.name;
				break;
				case "fr": newQuest = "Quête ajoutée : "+response.name;
				break;
			}
			if(response.questRequired === "mandatory")
				questsMandatory.push(this.quest);
			else if(response.questRequired === "optional")
				questsOptional.push(this.quest);
			if($("#happeningOverlay").not(":visible"))
				$("#backdrop").fadeIn();
			$("#textCommunicationWrapper").fadeIn();
			$("#textCommunicationField").html("<h4>"+newQuest+"</h4><p>"+response.description+"</p>");
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
	//updates a given quest to the current chapter, this method synchronises with the server side object/user data file
	this.updateQuest = function(quest,chapter) {
		//submit quest ID and chapter, on update success communicate new chapter with player
		$.ajax({
			url: gameRoot+"updateQuest/"+username+"/"+quest+"/"+chapter
		}).done(function(response){
			//output response in user's language
			let newQuest = "Quest updated: "+response.nextChapter.name;
			switch(lang) {
				case "de": newQuest = "Aufgabe aktualisiert: "+response.nextChapter.name;
				break;
				case "hu": newQuest = "Küldetés pontosítva: "+response.nextChapter.name;
				break;
				case "fr": newQuest = "Quête mise à jour : "+response.nextChapter.name;
				break;
			}
			if($("#happeningOverlay").not(":visible"))
				$("#backdrop").fadeIn();
			$("#textCommunicationWrapper").fadeIn();
			$("#textCommunicationField").html("<h4>"+newQuest+"</h4><p>"+response.nextChapter.description+"</p>");
			//if a chapter reward has been assigned, pay it off
			if(typeof(response.nextChapter.chapterReward) !== "undefined" && response.nextChapter.chapterReward.length > 0) {
				const rewards = response.nextChapter.chapterReward;
				$.each(rewards,function(key,value) {
					//pendingActions.push(value);
					//execute chain of functions
				});
			}
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
	//completes a given quest according to the given flag
	this.completeQuest = function(quest,success) {
		//submit quest ID and completion flag; fetch on success the quest details
		$.ajax({
			url: gameRoot+"completeQuest/"+username+"/"+quest+"/"+success,
			success: success
		}).done(function(response){
			//output response in user's language
			let newQuest = "Quest completed: "+response.name;
			switch(lang) {
				case "de": newQuest = "Aufgabe beendet: "+response.name;
				break;
				case "hu": newQuest = "Küldetés befejezve: "+response.name;
				break;
				case "fr": newQuest = "Quête completée : "+response.name;
				break;
			}
			if($("#happeningOverlay").not(":visible"))
				$("#backdrop").fadeIn();
			$("#textCommunicationWrapper").fadeIn();
			$("#textCommunicationField").html("<h4>"+newQuest+"</h4><p>"+this.success+"</p>");
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
	//lists all quests the user currently has. As a parameter, the processing destination is expected
	this.listQuests = function(processTo) {
		$.ajax({
			url: gameRoot+"listAllQuests/"+username+"/"+lang,
			processTo: processTo
		}).done(function(response){
			//switch between listings
			switch(this.processTo) {
				case "table":
					$(".quest").remove();
					$.each(response,function(key,value){
						const questRow = '<tr class="quest"><td><h4>'+value.name+'</h4></td><td>'+value.description+'</td></tr>';
						switch(value.questRequired) {
							case "mandatory": $("#mandatoryTable").after(questRow);
							break;
							case "optional": $("#optionalTable").after(questRow);
							break;
						}
					});
					$("#questEnumerationWrapper").fadeIn();
				break;
				case "points":
					$.each(response,function(key,value){
						if(typeof(value.place) !== "undefined") {
							const pointCentre = convertCoords(value.place.mapPointX,value.place.mapPointY);
							$("#mapControl").append('<circle cx="'+pointCentre.x+'" cy="'+pointCentre.y+'" r="10" fill="yellow" filter="url(#f1)">'+
							'<animate attributeName="r" begin="0s" dur="0.3s" repeatCount="indefinite" from="0px" to="20px"/>'+
							'</circle>');
						}
					});
					//for Firefox: refresh view
					$("#mainWrapper").html($("#mainWrapper").html());
				break;
			}
		}).fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
	this.addDialogPoint = function(alternative) {
		dialogPointsPassed.push(alternative);
	}
	
	this.getDialogPoints = function() {
		return dialogPointsPassed;
	}
	
	this.setTownsToVisit = function(newTownsToVisit) {
		townsToVisit = newTownsToVisit;
	}
	
	this.getTownsToVisit = function() {
		return townsToVisit;
	}
	
	//maps the server's response or the entered data from the form to the client class
	this.setUserData = function(userData) {
		this.setFirstname(userData.firstname);
		this.setLastname(userData.lastname);
		this.setUsername(userData.username);
		this.setLang(userData.lang);
		this.setLoveInterests(userData.loveInterests);
		this.setGender(userData.gender);
		this.setMoney(userData.currentMoney);
		this.updatePlace(userData.currentPlace);
		this.setInventory(userData.inventory);
		this.setMemory(userData.memory);
	}
	
	//converts the given user data for the database insertion
	this.encodeData = function() {
		var actionsPassedString;
		if(actionsPassed.length > 0)
			actionsPassedString = actionsPassed.join(",");
		else actionsPassedString = "none";
		//returns a GET query string
		return firstname+"/"+lastname+"/"+username+"/"+useName+"/"+lang+"/"+loveInterests.join(",")+"/"+gender+"/"+currentMoney+
		"/"+JSON.stringify(inventory)+"/"+actionsPassedString+"/"+townsToVisit.join(",");
	}
	
	//updates the current place of the user
	//pay attention upon the response format!
	this.updatePlace = function(place) {
		town = place.town;
		number = place.number;
		place = place.place;
	}
	
	//clears the user's memory of passed points
	this.clearDialogMemory = function() {
		dialogPointsPassed = [];
	}
	
	//adds a new item to the inventory, this method synchronises with the server-side object
	this.addItem = function(data) {
		inventory[inventory.length] = data;
		$.ajax({
			url: gameRoot+"addItem/"+username,
			dataType: "json",
			type: "POST",
			data: data
		}).done(function(response){
			//in case of successful response, display the item details
			if($("#happeningOverlay").not(":visible"))
				$("#backdrop").fadeIn();
			$("#textCommunicationWrapper").fadeIn();
			$("#textCommunicationField").html(response.text.replace(/!NL/g,"<br>"));
			//trigger additional actions depending upon item class or id
			switch(response.details.id) {
				case "notebook": $("#questShow").show();
				break;
			}
		}).fail(function(xhr,textStatus,error){
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
	//removes an item from the inventory, this method synchronises with the server side object and user data file
	this.removeItem = function(itemID) {
		//loop through client side array
		$.each(inventory,function(i,item) {
			//take out item with matching ID
			if(item.id === itemID)
				inventory[i] = null;
		});
		//alert item loss in case of successful removal
		$.ajax({
			url: gameRoot+"removeItem/"+username+"/"+itemID
		}).done(function(response){
			alert(unescape(response[0].replace(/!NL/g,"\n")));
		}).fail(function(xhr,textStatus,error){
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
	//removes the validity of a given ticket, this method updates also the server side object and user data file
	this.validateTicket = function(ticketID) {
		$.ajax({
			url: gameRoot+"validateTicket/"+username+"/"+ticketID
		}).done(function(response){
			//message only for the developer
			console.log(response);
			$.each(inventory,function(i,item) {
				if(item.id === ticketID)
					inventory[i].valid = "false";
			});
		}).fail(function(xhr,textStatus,error){
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
	//adds or deducts money to the user's account, this method updates also the server-side object and user data file
	this.manipulateMoney = function(amount,add) {
		if(add)
			currentMoney += parseInt(amount);
		else if(!add)
			currentMoney -= parseInt(amount);
		$.ajax({
			url: gameRoot+"setMoney/"+username+"/"+currentMoney,
		}).done(function(response){
			//on successful update, print new balance to playes
			var moneyText = "";
			switch(lang) {
				case "de": moneyText = "Dein Kontostand beträgt jetzt: "+response.amount+" Z";
				break;
				case "hu": moneyText = "Ennyi pénzed van: "+response.amount+" Z";
				break;
				case "fr": moneyText = "Tu as tant d\'argent sur toi : "+response.amount+" Z";
				break;
				case "en": moneyText = "You currently have: "+response.amount+" Z";
				break;
			}
			alert(moneyText);
		}).fail(function(xhr,textStatus,error){
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
	//checks whether an item exists in the inventory
	this.checkItem = function(itemID) {
		var ret = false;
		$.each(inventory,function(i,item) {
			if(item.id === itemID)
				ret = item;
		});
		//return boolean false or item ID
		return ret;
	}
	
	//checks user has a given ticket and if it is valid
	this.checkTicket = function(ticketID) {
		var ret = false;
		$.each(inventory,function(i,item){
			if(item.id === ticketID && item.valid === "true")
				ret = true;
			else if(item.id === ticketID && item.valid === "false")
				ret = "ticket invalid";
		});
		return ret;
	}
	
	//show/hide-toggle for the inventory
	this.displayInventory = function() {
		$("#backdrop").fadeIn();
		$("#textCommunicationWrapper").fadeIn();
		//if inventory list is not filled, fill it up
		if($("#inventoryList").length === 0) {
			$("#textCommunicationField").html('<ol id="inventoryList"></ol>');
			//get item details for each ID in client-side array
			$.each(inventory,function(i,item){
				$.ajax({
					url: gameRoot+"getItemDetails/"+item.id+"/"+lang
				}).done(function(response){
					//for tickets
					validity = "";
					if(item.valid === "true") {
						switch(currUser.getLang()) {
							case "de": validity = "<br>Diese Fahrkarte ist gültig.";
							break;
							case "hu": validity = "<br>Ez a jegy érvényes.";
							break;
							case "fr": validity = "<br>Ce billet est valable.";
							break;
							case "en": validity = "<br>This ticket is valid.";
							break;
						}
					}
					else if(item.valid === "false") {
						switch(currUser.getLang()) {
							case "de": validity = "<br>Diese Fahrkarte ist ungültig.";
							break;
							case "hu": validity = "<br>Ez a jegy nem érvényes.";
							break;
							case "fr": validity = "<br>Ce billet n'est pas valable.";
							break;
							case "en": validity = "<br>This ticket is not valid.";
							break;
						}
					}
					//tag usable items so that from the inventory view, they can be clicked and used
					let itemClass = 'class="'+response.itemClass;
					switch(response.itemClass) {
						case "map":
						case "notebook":
							itemClass += ' usableFromInventory';
						break;
					}
					itemClass += '"';
					//append information for map items
					let mapFile = '';
					if(typeof(response.mapFile) !== 'undefined')
						mapFile = ' data-mapFile="'+response.mapFile+'" data-forTown="'+response.forTown+'"';
					$("#inventoryList").append('<li '+itemClass+mapFile+'><h4>'+response.name+'</h4><p>'+response.description+validity+'</p></li>');
				}).fail(function(xhr,textStatus,error) {
					alert("An error occurred, please consult script:\n"+
						  textStatus+": "+error);
				});
			});
		}
	}

}
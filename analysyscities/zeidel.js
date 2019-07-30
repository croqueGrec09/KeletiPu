//Zeidel - capital city - function area
//This document contains the new user entry form validation and, in case of success, the adding of a new user.

//uppermost level
$(document).ready(function(){
//------------------------------------------------------------- event handling area --------------------------------------------------------------------

	//validates form entry for the registration
	$("#mainWrapper").on("click",".addUser",function() {
		$(".error").remove();
		errorArray = {};
		//go through all cases which may cause an error; if an error is found, obstruct form submission and report error in given language
		if($("#userFirstName").val().length === 0) {
			errorArray.firstName = true;
			switch(currUser.getLang()) {
				case "de": $("#userFirstName").before('<span class="error">Kein Vorname eingegeben!</span>');
				break;
				case "hu": $("#userFirstName").before('<span class="error">Nem adtál be keresztnevet!</span>');
				break;
				case "fr": $("#userFirstName").before('<span class="error">Pas de prénom entré !</span>');
				break;
				case "en": $("#userFirstName").before('<span class="error">No first name entered!</span>');
				break;
			}
		}
		if($("#userLastName").val().length === 0) {
			errorArray.lastName = true;
			switch(currUser.getLang()) {
				case "de": $("#userLastName").before('<span class="error">Kein Nachname eingegeben!</span>');
				break;
				case "hu": $("#userLastName").before('<span class="error">Nem adtál be családnevet!</span>');
				break;
				case "fr": $("#userLastName").before('<span class="error">Pas de nom de famille entré !</span>');
				break;
				case "en": $("#userLastName").before('<span class="error">No last name entered!</span>');
				break;
			}
		}
		if($("#userName").val().length === 0) {
			errorArray.userName = true;
			switch(currUser.getLang()) {
				case "de": $("#userName").before('<span class="error">Kein Benutzername eingegeben!</span>');
				break;
				case "hu": $("#userName").before('<span class="error">Nem adtál be felhasználói nevet!</span>');
				break;
				case "fr": $("#userName").before('<span class="error">Pas de nom d\'utilisateur entré !</span>');
				break;
				case "en": $("#userName").before('<span class="error">No user name entered!</span>');
				break;
			}
		}
		//check if user with the given user name exists already
		$.ajax({
			url: gameRoot+"checkUserName/"+$("#userName").val()
		})
		.done(function(response){
			//continue all checks after this check
			if(response !== "false") {
				errorArray.userName = true;
				switch(currUser.getLang()) {
					case "de": $("#userName").before('<span class="error">Es gibt bereits einen Nutzer dieses Namens!</span>');
					break;
					case "hu": $("#userName").before('<span class="error">Már van egy felhasználó ezzel a névvel!</span>');
					break;
					case "fr": $("#userName").before('<span class="error">Il y a déjà un utilisateur avec ce nom !</span>');
					break;
					case "en": $("#userName").before('<span class="error">There is already a user with this name!</span>');
					break;
				}
			}
			if($("#loveInterests").val().length === 0) {
				errorArray.loveInterests = true;
				switch(currUser.getLang()) {
					case "de": $("#loveInterests").before('<span class="error">Für irgendwas wird sich deine Liebe doch interessieren, oder?</span>');
					break;
					case "hu": $("#loveInterests").before('<span class="error">Valami azért csak fogja érdekelni a szerelmedet, ugye?</span>');
					break;
					case "fr": $("#loveInterests").before('<span class="error">Ton amour s\'intéressera quand même en quelque chose, non ?</span>');
					break;
					case "en": $("#loveInterests").before('<span class="error">Your love will have some interests, won\'t it?</span>');
					break;
				}
			}
			if($("[name=useName]:checked").length === 0) {
				errorArray.useName = true;
				switch(currUser.getLang()) {
					case "de": $("[name=useName]").parents("ul").before('<span class="error">Die Charaktere sind ratlos ... wie sollen sie dich denn ansprechen?</span>');
					break;
					case "hu": $("[name=useName]").parents("ul").before('<span class="error">A szereplők nem tudják, hogy hogyan szólítsanak ... </span>');
					break;
					case "fr": $("[name=useName]").parents("ul").before('<span class="error">Les charactères sont désemparés... ils ne savent pas comment t\'appeller !</span>');
					break;
					case "en": $("[name=useName]").parents("ul").before('<span class="error">The characters are helpless ... they don\'t know how to call you!</span>');
					break;
				}
			}
			if($("[name=loveSex]:checked").length === 0) {
				errorArray.loveSex = true;
				switch(currUser.getLang()) {
					case "de": $("[name=loveSex]").parents("ul").before('<span class="error">Es ist bisher noch nie vorgekommen, dass die große Liebe kein Geschlecht hat ...</span>');
					break;
					case "hu": $("[name=loveSex]").parents("ul").before('<span class="error">Eddig még nem fordult elő, hogy a nagy szerelemnek ne legyen neme!</span>');
					break;
					case "fr": $("[name=loveSex]").parents("ul").before('<span class="error">Jusqu\'à présent, il ne s\'est jamais passé que le grand amour n\'ait pas de genre !</span>');
					break;
					case "en": $("[name=loveSex]").parents("ul").before('<span class="error">Until now, it never happened that the great love would have no gender!</span>');
					break;
				}
			}
			if($("[name=interests]:checked").length === 0) {
				errorArray.interests = true;
				switch(currUser.getLang()) {
					case "de": $("[name=interests]").parents("ul").before('<span class="error">Du spielst das Spiel doch nicht, ohne dich für Prüfungsinhalte zu interessieren!<br>'+
																		  'Und der Modus Dozent/Forscher ist bisher noch nicht implementiert.</span>');
					break;
					case "hu": $("[name=interests]").parents("ul").before('<span class="error">Te nem játszod a játékot anélkül, hogy egy tantárgy érdekelne!<br>'+
																		  'És a docens/kutató mód még nincs elkészítve!</span>');
					break;
					case "fr": $("[name=interests]").parents("ul").before('<span class="error">Tu ne joues pas le jeu sans t\'intéresser à aucun sujet !<br>'+
																		  'Et le mode enseignant/chercheur n\'est pas encore implémenté !</span>');
					break;
					case "en": $("[name=interests]").parents("ul").before('<span class="error">You don\'t play the game without being interested in a subject!<br>'+
																		  'And the instructor/researcher mode is not implemented yet!</span>');
					break;
				}
			}
			//no errors = form is valid, submit data
			if(Object.values(errorArray).length === 0)
				addUser();
		})
		.fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+
				  textStatus+": "+error);
		});
		
	});
	
//------------------------------------------------------------- function area --------------------------------------------------------------------------

	//add new user
	function addUser() {
		//get the form data and map to the client-side object
		currUser.setFirstname($("#userFirstName").val());
		currUser.setLastname($("#userLastName").val());
		currUser.setUsername($("#userName").val());
		currUser.setLoveInterests($("#loveInterests").val().split(/[;,] ?/g));
		currUser.setUseName($("[name=useName]:checked").val());
		currUser.setGender($("[name=loveSex]:checked").val());
		//restrict infinite registration
		currUser.addActionPassed("toTicketAutomat");
		//move new player to 'Never give up' centre
		currUser.updatePlace({town:"zeidel",number:0,place:"placeB"});
		var townsToVisit = [];
		$.each($("[name=interests]:checked"),function(key,townToVisit){
			townsToVisit[key] = townToVisit.value;
		});
		//define towns to be passed
		currUser.setTownsToVisit(townsToVisit);
		//submit data to server
		$.ajax({
			url: gameRoot+"addUser/"+currUser.encodeData()
		})
		.done(function(response) {
			var accountSuccessText = "";
			//report about success
			switch(currUser.getLang()) {
				case "de": accountSuccessText = "Account erfolgreich angelegt! Du hast jetzt auch eine Fahrkarte für das Verbundnetz! Nimm jetzt die Stadtbahn oder den Bus, um weiterzukommen.";
				break;
				case "hu": accountSuccessText = "Felhaszn%E1l%F3 sikeresen bejegyezve! Most m%E1r van jegyed a megye ter%FClet%E9n; sz%E1llj fel villamosra vagy buszra, hogy tov%E1bb haladj.";
				break;
				case "fr": accountSuccessText = "Comte entr%E9gistr%E9 ! Tu as maintenant un billet valable pour l%27ar%E9al de l%27association; prends le tramway ou le bus pour avancer.";
				break;
				case "en": accountSuccessText = "Account successfully registered! You have now a valid ticket for the association area; take the tramway or the bus to advace.";
				break;
			}
			//clear form
			$("#formWrapper").fadeOut();
			$("#formWrapper").not("input").remove();
			//return control field
			$("#descriptionText, #directionIndicator, #buttonRow, #invShow").fadeIn();
			//set static language fields to given language
			defineButtons(currUser.getLang());
			//the account entering takes some time; wait some moments until new item is being entered
			$("#background").animate({"opacity":0.6},{duration:1200,complete:function(){
				alert(unescape(accountSuccessText));
				let itemData = {id:"ZVWticket",valid:"true"};
				currUser.addItem(itemData);
				updateScreen(response);
			}});
		})
		.fail(function(xhr,textStatus,error) {
			alert("An error occurred, please consult script:\n"+
				  textStatus+": "+error);
		});
	}

});
//Benutzerbezogene Funktionen

//Neuen Benutzer hinzufügen
function addUser(data){
	var person = data.userName.value;
	var firstname = data.userFirstName.value;
	var lastname = data.userLastName.value;
	var loveSexOptions = document.getElementsByName('loveSex');
	var loveSex = null;
	var interestOptions = document.getElementsByName('interests');
	var interests = null;
	var useNameOptions = document.getElementsByName('useName');
	var useName = null;
	if (loveSexOptions[0].checked) loveSex = loveSexOptions[0].value;
	else loveSex = loveSexOptions[1].value;
	if (useNameOptions[0].checked) useName = useNameOptions[0].value;
	else useName = useNameOptions[1].value;
	for(var i = 0; i < interestOptions.length; i++){
		if(interestOptions[i].checked) interests += interestOptions[i].value+'-!-';
	}
	interests = interests.substring(4,interests.length-3);
	//console.log(loveSex + ' ' +interests);
	var newUser = {
		"person": person,
		"firstname": firstname,
		"lastname": lastname,
		"useName": useName,
		"loveInterests": data.loveInterests.value,
		"loveSex": loveSex,
		"interests": interests,
		"lang": lang
	};
	var params = {
		"newAccount": "true",
		"newUser" : JSON.stringify(newUser)
	};
	$.get("town.php",params,function(response){
		user = person;
		updateScreen(response);
		$('#background').animate({
			opacity: 1.0
		});
		directionNull();
		$('#inventory').show();
		$('#steuerfeld').show();
		$('#formular').animate({
			opacity: 0.0
		}).html("");
	});
}

function manipulateCurrentMoney(amount,add){
	var params = {
		manipulateCurrentMoney: "true",
		amount: amount,
		add: add,
		user: user
	};
	$.get("town.php",params,function(response){
		alert(response);
	});
}

//Inventarverwaltung
function addItem(itemData){
	var params = {
		newItem: "true",
		user: user,
		itemData: JSON.stringify(itemData)
	};
	$.get("town.php",params,function(response){
		alert(response);
	});
}

function removeItem(itemId){
	var params = {
		remove: "true",
		person: user,
		IDItemAffected: itemId
	}
	$.get("town.php",params,function(response){
		alert(response);
	});
}

function showInventory(){
	var params = {
		showInventory:"true",
		lang: lang,
		user:user
	};
	$.get("town.php",params,function(response){
		var inventory = JSON.parse(response);
		//console.log(inventory);
		$('#steuerfeld').hide();
		$('#fliesstext').hide();
		$('#richtungsanzeige').html(' ');
		$.each(inventory,function(itemKey, item){
			$('#richtungsanzeige').append("Element # "+itemKey+": "+item.name+" - "+item.description);
			if(item.valid !== "none")
				$('#richtungsanzeige').append(" "+ticketValidityText+item.valid);
			$('#richtungsanzeige').append("<br>");
		});
		$('#invShow').hide();
		$('#invHide').show();
	});
}

function hideInventory(){
	$('#steuerfeld').show();
	$('#fliesstext').show();
	directionNull();
	$('#invHide').hide();
	$('#invShow').show();	
}
function happening(city,line,entry,forward){
	nextTrainSet = false;
	this.city = city;
	this.line = line;
	this.forward = forward;
	var params = {
		onLine: "true",
		happening_db: city,
		line: line,
		entry: entry,
		lang: lang
	};
	$("#buttons").hide();
	$("#richtungsanzeige").hide();
	$.get("town.php",params,function(response){
		displayHappening(response);
	});
}

function displayHappening(response){
	var object = JSON.parse(response);
	if(typeof(object.otherHappenings) !== "undefined") {
		$.each(object.otherHappenings,function(key,happeningVal){
			switch(happeningVal.command){
				case "addItem":
				var itemData = {
					"id": happeningVal.triggeredItem,
					"valid": happeningVal.valid
				};
				addItem(itemData);
				break;
				case "removeItem":
				removeItem(happeningVal.itemId);
				break;
				case "addMoney":
				case "deductMoney":
				manipulateCurrentMoney(happeningVal.amount,happeningVal.add);
				break;
			}
		});
	}
	$("#steuerfeld").empty();
	$("#stationname").text(object.name);
	$("#fliesstext").html(object.text.replace(/!NL/g,"<br> <br>"));
	$("#background").attr("src",object.image);
	$("#steuerfeld").on("click",function(){
		if(typeof(object.exitStream) !== "undefined"){
			if((typeof(object.previousEvent) !== "undefined") && (typeof(object.nextEvent) !== "undefined")) {
				if(confirm(unescape(exitHere))){
					writeStation(object.exitStream.nextStation,object.exitStream.nextCity,object.exitStream.nextPlace);
					return;
				}
			}
			else writeStation(object.exitStream.nextStation,object.exitStream.nextCity,object.exitStream.nextPlace);
			$("#buttons").show();
			$("#richtungsanzeige").show();
		}
		if((typeof(object.previousEvent) !== "undefined") && !forward)
			happening(city,line,object.previousEvent,forward);
		else if((typeof(object.nextEvent) !== "undefined") && forward)
			happening(city,line,object.nextEvent,forward);
	});
}
$(document).ready(function() {
	const towns = ["zeidel","kvirasim","karlstadt"];
	let actionName = "";
	let currTown = "";
	let currPlace = "";
	let listHeader = "Alle Aktionen ohne Koordinatenzuweisungen, bitte Element aus der Liste wählen:";
	
	$.each(towns,function(key,value){
		getUnassignedActions(value);
	});
	
	$("#clearImage").on("click",function(){
		$("#unassignedActions").empty()
		$("#unassignedActionsWrapper").show();
		$.each(towns,function(key,value){
			getUnassignedActions(value);
		});
		$("#coordsField").val("");
		$(".initialHidden").hide();
	});
	
	$("#clearField").on("click",function(){
		$("#coordsField").val("");
	});
	
	$("#enter").on("click",function(){
		const currVal = $("#coordsField").val();
		if(currVal.length === 0 || currVal === "0.0,0.0 0.0,0.0 0.0,0.0")
			alert("Keine Koordinaten eingegeben!");
		else if(currVal.match(/(\d{1,3}[.]\d{1,}[,]\d{1,3}[.]\d{1,} *){3,}$/) === null)
			alert("Koordinaten nicht valide!");
		else {
			$.ajax({
				url: "/PowerOfData/helper.php/enterCoordinates",
				type: "POST",
				data: {"town": currTown,
					   "place": currPlace,
					   "coordinates": currVal,
					   "actionName": actionName}
			}).done(function(response){
				if(response !== "false")
					$("#clearImage").trigger("click");
			}).fail(function(xhr,textStatus,error){
				alert("An error occurred, please consult script:\n"+textStatus+": "+error);
			});
		}
	});
	
	$("#unassignedActionsWrapper").on("click",".action",function(){
		$("#scene").attr("src",$(this).attr("data-link"));
		actionName = $(this).text();
		currTown = $(this).attr("data-town");
		currPlace = $(this).attr("data-place");
		$("h1").text(actionName);
		$(".initialHidden").show();
		$("#coordsField").val("");
		$("#unassignedActionsWrapper").hide();
	});
	
	$("#field").on("click","#scene",function(e){
		console.log(e.clientY+" "+$(this).height());
		let x = (e.clientX/$(this).width())*100;
		let y = (e.clientY/$(this).height())*100;
		if(x % 1 === 0) x += ".0";
		if(y % 1 === 0) y += ".0";
		if(x <= 0) x = "0.0";
		if(y <= 0) y = "0.0";
		if(x >= 100) x = "100.0";
		if(y >= 100) y = "100.0";
		const currVal = $("#coordsField").val();
		$("#coordsField").val(currVal+x+","+y+" ");
	});
	
	function getUnassignedActions(town) {
		$.ajax({
			url: "/PowerOfData/helper.php/getUnassignedActions/"+town
		}).done(function(response){
			//console.log(response.length);
			$("h1").text(listHeader);
			$("#unassignedActions").append('<h2>'+town+'</h2>');
			$.each(response,function(key,value){
				var place = key;
				$("#unassignedActions").append('<h3>'+place+'</h3>');
				$.each(value,function(name,link){
					$("#unassignedActions").append('<li class="action" data-place="'+place+'" data-town="'+town+'" data-link="/PowerOfData/analysyscities/'+link+'">'+name+'</li>');
				});
			});
		}).fail(function(xhr,textStatus,error){
			alert("An error occurred, please consult script:\n"+textStatus+": "+error);
		});
	}
	
});
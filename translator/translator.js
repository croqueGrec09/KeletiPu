$(document).ready(function() {
	const langs = ["fr","en"];
	let ret = {};
	let listHeader = "";
	let total = {
		"fr": 0,
		"en": 0
	};
	
	$.ajax({
		url: "/PowerOfData/helper.php/getUndoneTranslations"
	}).done(function(response){
		$.each(response.towns,function(town,places){
			$.each(places,function(placeId,place){
				var input = {
					"original": place.content.de,
					"field": "content",
					"town": town,
					"placeId": placeId
				};
				var container = "";
				$.each(langs,function(l,lang){
					if(typeof(place.content[lang]) === 'undefined') {
						input.trans = "";
						input.lang = lang;
						container = "#"+lang;
						total[lang]++;
					}
					else if(typeof(place.content[lang]) !== 'undefined') {
						input.trans = place.content[lang];
						input.lang = lang;
						container = "#"+lang+"Done";
					}
					if(total[lang] <= 51)
						createRow(container,input);
				});
				$.each(place.actions,function(key,value){
					var input = {
						"original": value.de,
						"field": "action",
						"town": town,
						"placeId": placeId,
						"action": key,
					};
					var container = "";
					$.each(langs,function(l,lang){
						if(typeof(value[lang]) === 'undefined') {
							input.trans = "";
							input.lang = lang;
							container = "#"+lang;
							total[lang]++;
						}
						else if(typeof(value[lang]) !== 'undefined') {
							input.trans = value[lang];
							input.lang = lang;
							container = "#"+lang+"Done";
						}
						if(total[lang] <= 51)
							createRow(container,input);
					});
				});
			});
		});
		$.each(response.dialogs,function(dialog,points){
			$.each(points,function(pointId,point){
				var input = {
					"field": "dialog",
					"dialog": dialog,
					"point": pointId,
					"original": point.de
				};
				$.each(langs,function(l,lang){
					if(typeof(point[lang]) === 'undefined') {
						input.trans = "";
						input.lang = lang;
						container = "#"+lang;
						total[lang]++;
					}
					else if(typeof(point[lang]) !== 'undefined') {
						input.trans = point[lang];
						input.lang = lang;
						container = "#"+lang+"Done";
					}
					if(total[lang] <= 51)
						createRow(container,input);
				});
			});
		});
		$.each(response.happenings,function(happening,points){
			$.each(points,function(pointId,point){
				var input = {
					"field": "happening",
					"happening": happening,
					"point": pointId,
					"original": point.de
				};
				$.each(langs,function(l,lang){
					if(typeof(point[lang]) === 'undefined') {
						input.trans = "";
						input.lang = lang;
						container = "#"+lang;
						total[lang]++;
					}
					else if(typeof(point[lang]) !== 'undefined') {
						input.trans = point[lang];
						input.lang = lang;
						container = "#"+lang+"Done";
					}
					if(total[lang] <= 51)
						createRow(container,input);
				});
			});
		});
		$("#fr-tab").append(document.createTextNode("("+total.fr+")"));
		$("#en-tab").append(document.createTextNode("("+total.en+")"));
	}).fail(function(xhr,textStatus,error){
		alert("An error occurred, please consult script:\n"+textStatus+": "+error);
	});
	
	$("#undoneTranslationsWrapper").on("focusout","textarea",function(){
		var field = $(this);
		if(field.val().length > 0) {
			field.addClass("alert alert-primary");
			let val = $(this).val().replace("\n","!NL").replace(/《/g,"«").replace(/》/g,"»");
			var selector = "";
			let data = {};
			switch(field.attr("data-field")){
				case "content": data = {
					"lang": $(this).attr("data-lang"),
					"town": $(this).attr("data-town"),
					"place": $(this).attr("data-place"),
					"field": $(this).attr("data-field"),
					"val": val
				};
				selector = "#"+$(this).attr("data-town")+$(this).attr("data-place")+$(this).attr("data-lang");
				break;
				case "action": data = {
					"lang": $(this).attr("data-lang"),
					"town": $(this).attr("data-town"),
					"place": $(this).attr("data-place"),
					"action": $(this).attr("data-action"),
					"field": $(this).attr("data-field"),
					"val": val
				};
				selector = "#"+$(this).attr("data-town")+$(this).attr("data-place")+$(this).attr("data-lang");
				break;
				case "dialog": data = {
					"lang": $(this).attr("data-lang"),
					"dialog": $(this).attr("data-dialog"),
					"point": $(this).attr("data-point"),
					"val": val
				}
				selector = "#"+$(this).attr("data-point")+$(this).attr("data-lang");
				break;
				case "happening": data = {
					"lang": $(this).attr("data-lang"),
					"happening": $(this).attr("data-happening"),
					"point": $(this).attr("data-point"),
					"val": val
				}
				selector = "#"+$(this).attr("data-point")+$(this).attr("data-lang");
				break;
			}
			$(selector).text("verarbeite ...");
			$.ajax({
				url: "/PowerOfData/helper.php/enterTranslation",
				type: "post",
				data: data
			}).done(function(response){
				if(response === "true") {
					field.attr("class","form-control alert alert-success");
					$(selector).text("Erfolgreich verarbeitet!");
				}
				else {
					field.attr("class","form-control alert alert-danger");
					$(selector).html(response.split("false")[1]);
				}
			}).fail(function(xhr,textStatus,error){
				alert("An error occurred, please consult script:\n"+textStatus+": "+error);
			});
		}
	});
	
	$("#undoneTranslationsWrapper").on("click","#reload",function(){
		location.reload();
	});
	
	function createRow(container,input) {
		$(container).append('<div class="row"></div>');
		let leftCol = '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">'+input.original+'</div>';
		let attributes = '';
		let p = '';
		switch(input.field) {
			case "content": attributes = 'data-town="'+input.town+'" data-place="'+input.placeId+'"';
			p = '<p id="'+input.town+input.placeId+input.lang+'"></p>';
			break;
			case "action": attributes = 'data-town="'+input.town+'" data-place="'+input.placeId+'" data-action="'+input.action+'"';
			p = '<p id="'+input.town+input.placeId+input.lang+'"></p>';
			break;
			case "dialog": attributes = 'data-dialog="'+input.dialog+'" data-point="'+input.point+'"';
			p = '<p id="'+input.point+input.lang+'"></p>';
			break;
			case "happening": attributes = 'data-happening="'+input.happening+'" data-point="'+input.point+'"';
			p = '<p id="'+input.point+input.lang+'"></p>';
			break;
		}
		let rightCol = '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-6"><textarea class="form-control" data-lang="'+input.lang+'" '+attributes+' data-field="'+input.field+'">'+input.trans+'</textarea>'+p+'</div>';
		$(container+" .row:last").append(leftCol);
		$(container+" .row:last").append(rightCol);
	}
	
});
//evt.keyCode: returns key pressed
$(document).keydown(function(evt){
	console.log(evt.keyCode);
	$("#controlPanel").text(evt.keyCode);
});
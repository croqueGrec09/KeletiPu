$(document).ready(function(){
	let initMinute = Math.floor(Math.random()*60);
	var nextMinute = initMinute+1;
	var initHour = Math.floor(Math.random()*360);
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
	$("#hour").css({'transform':'rotate('+((initHour-initHour%24)+initMinute*(24/60))+'deg)'});//
	$("body").html($("body").html());
	
	$("body").on("click",function(){
		$("#minute").css({'transform':'rotate('+(nextMinute*6)+'deg)'});
		$("#hour").css({'transform':'rotate('+((initHour-initHour%24)+nextMinute*(24/60))+'deg)'});
		nextMinute++;
	});
});
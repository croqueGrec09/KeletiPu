var sender = null;
var mousePos = null;
var actionTestArray = new Array();
var items = new Array();

function prepareQuery(){
	queryParam = document.suche.param.value;
	pageInit("xpath_experiments.php?city=zeidel&"+queryParam, writeResponse);
}

function pageInit(query, nextFunction){
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
			nextFunction(sender.responseText);
		}
	}
	sender.open("GET", query, true);
	sender.send();
}

function writeResponse(string){
	document.getElementById("fliesstext").innerHTML = string;
}

function testActions() {
	steuerfeld = document.getElementById('steuerfeld');
	ctx = steuerfeld.getContext('2d');	
	drawBackground('../analysyscities/zeidel/stadtbahn/gibniemalsauf_u13.JPG',0,0);
	steuerfeld.addEventListener('mousemove', function(evt) {
		mousePos = getMousePos(steuerfeld,evt);
	},false)
}

function drawBackground(src,x,y){	
	var tb = new Image();
	tb.onload = function(){
		console.log('Hintergrund geladen: ' + tb.complete);
		ctx.drawImage(tb,0,0);
		if (!withItem) {
			var gloves = new Item('../analysyscities/zeidel/stadtbahn/gibniemalsauf_gloves.JPG',579,472,29,25);
			items[0] = gloves;
			drawItem(items);
		}
	};
	tb.src = src;
}

var Item = function(src,x,y,sx,sy) {
	this.src = src;
	this.x = x;
	this.y = y;
	this.sx = sx;
	this.sy = sy;
	console.log('Gegenstand mit folgenden Eigenschaften erzeugt: ' + this.x + ',' + this.y + ',' + this.sx + ',' + this.sy);
};

function drawItem(items){
	for (var i = 0; i < items.length; i++){
		var x = items[i].x;
		var y = items[i].y;
		var sx = items[i].sx;
		var sy = items[i].sy
		var tb2 = new Image();		
		tb2.onload = function() {
			console.log('Gegenstand geladen.');
			ctx.drawImage(tb2,x,y,sx,sy);
			ctx.strokeRect(x,y,sx,sy);
		}
		tb2.src = items[i].src;
		console.log('Quelle des nächsten Gegenstandes = ' + tb2.src);
	}
}

function getMousePos(canvas, evt){
	var feld = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - feld.left,
		y: evt.clientY - feld.top
	}
}

function doAction(nextAction) {
	actionTestArray[0] = 579;
	actionTestArray[1] = 472;
	actionTestArray[2] = 579+29;
	actionTestArray[3] = 472+25;
	if (mousePos.x > actionTestArray[0] && mousePos.x < actionTestArray[2] && mousePos.y > actionTestArray[1] && mousePos.y < actionTestArray[3]){
		//console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
		nextAction('gloves');
	}
}

function actionTest2(id){
	console.log(id);
	pageInit("xpath_experiments.php?city=zeidel&query=itemTest2&user=Victoria Bartetzko&id=gloves&name=Lederhandschuhe&description=Butterweiche schwarze Lederhandschuhe, unbedingt nötig für warme Hände!", writeResponse);
	drawBackground('../analysyscities/zeidel/stadtbahn/gibniemalsauf_u13.JPG',0,0);
}	
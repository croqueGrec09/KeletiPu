var mousePos = null;

function testActions() {
	console.log("Methode 1 aufgerufen!");
	steuerfeld = document.getElementById('steuerfeld');
	coords = [15,15,35,130,95,75,130,90,290,10];
	ctx = steuerfeld.getContext('2d');
	drawPoly(coords);
	steuerfeld.addEventListener('mousemove', function(evt) {
		mousePos = getMousePos(steuerfeld,evt);
		loadMousePos();
	},false);
	/*steuerfeld.addEventListener('click', function(evt) {
		loadMousePos();
	}, false);*/
}

function drawPoly(coords){
	ctx.beginPath();
	ctx.lineWidth = "5";
	ctx.fillStyle = "red";
	ctx.moveTo(coords[0],coords[1]);
	for(var i = 2;i < coords.length;i+=2){
		ctx.lineTo(coords[i],coords[i+1]);
	}
	ctx.fill();
}

function getMousePos(canvas, evt){
	var feld = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - feld.left,
		y: evt.clientY - feld.top
	}
}

function loadMousePos() {
	if(ctx.isPointInPath(mousePos.x,mousePos.y))
		console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
}
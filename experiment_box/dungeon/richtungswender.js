function handOnReverser(evt) {
		mousePos = getMousePos(steuerfeld,evt);
		console.log(mousePos.x + "," + mousePos.y);
		pullReverser();
}

function setupListener(){	
	steuerfeld.addEventListener('mousemove', handOnReverser, false);
}

function handFromReverser() {
	steuerfeld.removeEventListener('mousemove', handOnReverser);
	document.getElementById("ohr").innerHTML = '<audio controls autoplay="true"><source src="../../analysyscities/dungeons/stellfeste/bws1.wav" type="audio/wav"><\/audio>';
}
	
function drawBackground(src,x,y){
	steuerfeld = document.getElementById('steuerfeld');
	ctx = steuerfeld.getContext('2d');
	var tb = new Image();
	tb.onload = function(){
		console.log('Hintergrund geladen: ' + tb.complete);
		ctx.drawImage(tb,0,0);
		ctx.beginPath();
		ctx.moveTo(364,290);
		ctx.lineTo(x,y);
		ctx.lineWidth=15;
		ctx.stroke();		
		ctx.beginPath();
		ctx.arc(x,y,20,0,2*Math.PI);
		ctx.lineWidth=15;
		ctx.stroke();
	};
	tb.src = src;
}

function pullReverser(){
	if(typeof x1 !== 'undefined' && typeof y1 !== 'undefined') {
		x2 = x1;
		y2 = y1;
	}
	x1 = mousePos.x;
	y1 = mousePos.y;
	if (x2 < x1) right = true;
	else right = false;
	if (y2 < y1) down =true;
	else down = false;
	if((x1 == 420 && y1 == 160) && (!right && !down)){
		document.getElementById("anzeige").innerHTML = "Richtungswender steht zur Zeit auf Stern";
		drawBackground('betriebsartenwahlschalter_b_wagen.jpg',366,117);
		}
	/*else if ((mousePos.x > 310 && mousePos.y > 100) && !right ) {
		
	}*/
	else if(mousePos.x < 310 && mousePos.x > 200 && mousePos.y < 200 && mousePos.y > 110){
		document.getElementById("anzeige").innerHTML = "Richtungswender steht zur Zeit auf Vorw&auml;rtsfahrt (VH)";
		drawBackground('betriebsartenwahlschalter_b_wagen.jpg',257,159);
		}
	else if(mousePos.x < 240 && mousePos.x > 160 && mousePos.y < 300 && mousePos.y > 240){
		document.getElementById("anzeige").innerHTML = "Richtungswender steht zur Zeit auf Automatikfahrt.<br> Da hier aber keine Lineare Zugbeeinflussung (LZB) vorhanden ist, bringt diese Stellung nichts.";
		drawBackground('betriebsartenwahlschalter_b_wagen.jpg',197,267);
		}
	else if(mousePos.x < 210 && mousePos.x > 150 && mousePos.y < 410 && mousePos.y > 320){
		document.getElementById("anzeige").innerHTML = "Richtungswender steht zur Zeit auf Notfahrt";
		drawBackground('betriebsartenwahlschalter_b_wagen.jpg',180,380);
		}
	else if(mousePos.x < 590 && mousePos.x > 520 && mousePos.y < 310 && mousePos.y > 220){
		document.getElementById("anzeige").innerHTML = "Richtungswender steht zur Zeit auf R&uuml;ckw&auml;rtsfahrt (RH)";
		drawBackground('betriebsartenwahlschalter_b_wagen.jpg',553,272);
		}
	else if(mousePos.x < 520 && mousePos.x > 420 && mousePos.y < 220 && mousePos.y > 160){
		document.getElementById("anzeige").innerHTML = "Richtungswender steht zur Zeit auf 0";
		drawBackground('betriebsartenwahlschalter_b_wagen.jpg',480,165);
		}
}

function getMousePos(canvas, evt){
	var feld = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - feld.left,
		y: evt.clientY - feld.top
	}
}
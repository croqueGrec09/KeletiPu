function draw(){
	steuerfeld = document.getElementById("steuerfeld");
	ctx = steuerfeld.getContext("2d");
	var bg = new Image();
	bg.src = "../analysyscities/karlstadt/aushangkasten_ohne_umstieg.JPG";
	var fak = new Array();
	fak[0] = new Image();
	fak[0].src = "../analysyscities/karlstadt/faksimiles/00000019.jpg";
	fak[1] = new Image();
	fak[1].src = "../analysyscities/karlstadt/faksimiles/00000020.jpg";
	var x = [110,332];
	var y = [278,279];
	bg.onload = function(){
		ctx.drawImage(bg,0,0);
		fak[0].onload = function(){
			ctx.drawImage(fak[0],x[0],y[0],197,210);
			ctx.drawImage(fak[1],x[1],y[1],210,214);
		};
	};
}

function enlarge(source){
	var faksimile = new Image();
	faksimile.src = source;
	steuerfeld.width = 1024;
	steuerfeld.height = 1431;
	faksimile.onload = function(){
		ctx.drawImage(faksimile,0,0,1024,1431);
		steuerfeld.addEventListener("mousedown",function(evt){
			y = evt.clientY;
		});
		steuerfeld.addEventListener("mouseup",function(entry) {
			var increment = new Array();
			var y2 = entry.clientY;
			if(y < y2)
				increment = [50,70];
			else if (y > y2)
				increment = [-50,-70];
			else document.getElementsByTagName("h1")[0].innerHTML = "Fehler";
			zoom(source,increment[0],increment[1]);
		});
	};
}

function zoom(source,x,y){
	var faksimile = new Image();
	faksimile.src = source;
	steuerfeld.width += x;
	steuerfeld.height += y;
	faksimile.onload = function(){
		ctx.drawImage(faksimile,0,0,steuerfeld.width,steuerfeld.height);
	};
}
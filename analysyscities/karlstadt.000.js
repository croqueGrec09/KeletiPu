//Karlstadt - Stadt des Gentz - Funktionen (Detailkarte X.2)
//Fahrkartenautomaten zur Ausgabe von Briefinformationen
function activateMachine(machine){
	steuerfeld = document.getElementById('steuerfeld');
	var ctx = steuerfeld.getContext('2d');
	ctx.font = '11px Courier';
	ctx.fillText('Willkommen!',90,180,360);
	ctx.fillText('Bitte bestimmen Sie einen Parameter!',90,195,360);
	databaseFetcher("town.php?part=start&machine="+machine,function(response){
		printOutput(response.split('!NQ')[0],0,210);
		var form = document.getElementById("formular");
		form.innerHTML = response.split('!NQ')[1];
		//var h1 = '<h4>Briefe nach Jahren<\/h4>';
		//var btn1800 = '<input type="button" value="1800" onclick="useMachine(\''+machine+'\',\'part=chronicle&year=1800\')">';
	});
}

function useMachine(machine,queryParam){
	databaseFetcher("town.php?machine="+machine+"&"+queryParam,function(response){
		var tb = new Image();
		tb.src = 'karlstadt/kvag_automat.JPG';
		tb.onload = function(){
			ctx.drawImage(tb,0,0);
			printOutput(response,0,180);
		};
	});
}

function printOutput(output,i,row){	
	var line = output.split('!N');
	for(i; i < line.length;i++){
		if(row >= 180 && row < 600){
			ctx.fillText(line[i].trim(),90,row,500);
			row += 15;
		}
		else if (row >= 600) {
			printOutput(output,i);
			var tb = new Image();
			tb.src = 'karlstadt/kvag_automat.JPG';
			tb.onload = function(){
				ctx.drawImage(tb,0,0);
				printOutput(response,i,180);
			}
		}
	}
}

function clear(nextFunction){
	document.getElementById("formular").innerHTML = '';
	nextEvent = new Function(nextFunction);
	nextEvent();
}

//Aushangkasten: Anzeigen und Verwalten von Faksimiles
function enlarge(source){
	steuerfeld.hidden = true;
	bildschirm = document.getElementById('zusatzfeld');
	bildschirm.width = 1024;
	bildschirm.height = 1431;
	var ctx = bildschirm.getContext('2d');
	bildschirm.hidden = false;
	var faksimile = new Image();
	faksimile.src = source;
	faksimile.onload = function(){
		ctx.drawImage(faksimile,0,0,1024,1431);
		bildschirm.addEventListener("mousedown",function(evt){
			y = evt.clientY;
		});
		bildschirm.addEventListener("mouseup",function(entry) {
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
	bildschirm.width += x;
	bildschirm.height += y;
	faksimile.onload = function(){
		ctx.drawImage(faksimile,0,0,bildschirm.width,bildschirm.height);
	};
}

function leave(){
	zusatzfeld.hidden = true;
	steuerfeld.hidden = false;
}
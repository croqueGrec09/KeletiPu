$(document).ready(function(){
	const dotWidth = 112;
	const dotHeight = 19;
	let l = 10;
	for(let y = 0;y < dotHeight;y++) {
		let k = 10;
		for(let x = 0;x < dotWidth;x++) {
			$("#matrix").append('<circle data-x="'+x+'" data-y="'+y+'" cx="'+k+'" cy="'+l+'" r="6" fill="#000000"/>');
			k+=15;
		}
		l+=15;
	}
	$("body").html($("body").html());
	/*
	var anzeige = testanzeige.split('n');
	var l = 10;
	for(var i = 0; i < anzeige.length; i++){
		var k = 10;
		for(var j = 0; j < anzeige[i].length; j++){
			ctx.beginPath();
			console.log(anzeige[i].charAt(j));
			if(anzeige[i].charAt(j) === 'O'){
				ctx.arc(k,l,6,0,2*Math.PI);
				ctx.fillStyle = "#000000";
				ctx.closePath();
				ctx.fill();
			}
			else if(anzeige[i].charAt(j) === 'X'){
				ctx.arc(k,l,6,0,2*Math.PI);
				ctx.fillStyle = "#E5FF95";
				ctx.closePath();
				ctx.fill();	
			}
			k+=15;
		}
		l+=15;
	}
	*/
	$("#matrix").on("click","circle",function(){
		if($(this).attr("fill") === "#E5FF95") {
			$(this).attr("fill","#000000");
		}
		else if($(this).attr("fill") === "#000000") {
			$(this).attr("fill","#E5FF95");
		}
	});
	$("#outputTrigger").on("click",function(){
		let output = {};
		$("circle").each(function(){
			let y = $(this).attr("data-y");
			let x = $(this).attr("data-x");
			if($(this).attr("fill") === "#E5FF95") {
				if(typeof(output[y]) === "undefined") {
					output[y] = [x];
				}
				else output[y].push(x);
			}
		});
		$("#output").val(JSON.stringify(output));
	});
	$("#inputTrigger").on("click",function(){
		//const input = $("#input").val();
		$.getJSON("BROSE2.json",function(charset){
			var input = "141 Pettenkof/Mitte";
			var tabulatorZero = 1, rowZero = 0;
			for(let i = 0;i < input.length;i++){
				let nextChar = null, charMaxWidth = 0;
				nextChar = getNextChar(input.charAt(i));
				if(nextChar === "/") {
					let newRow = getNextRow(input,charset);
					tabulatorZero = newRow.x;
					rowZero = newRow.y;
					console.log("next row at "+rowZero);
				}
				else if(nextChar === " ") {
					
				}
				else {
					$.each(charset[nextChar],function(y,dots){
						let tempMax = Math.max(...dots);
						if(tempMax > charMaxWidth)
							charMaxWidth = tempMax;
						for(let d = 0;d < dots.length;d++) {
							let x = parseInt(dots[d]);
							y = parseInt(y);
							console.log("next dot: "+(x+tabulatorZero)+","+(y+rowZero));
							$('circle[data-x="'+(x+tabulatorZero)+'"][data-y="'+(y+rowZero)+'"]').attr("fill","#E5FF95");
						}
					});
				}
				tabulatorZero += (charMaxWidth + 2);
			}
		});
		/*
		$("circle").each(function(){
			let y = $(this).attr("data-y");
			let x = $(this).attr("data-x");
			if($(this).attr("fill") === "#E5FF95") {
				if(typeof(output[y]) === "undefined") {
					output[y] = [x];
				}
				else output[y].push(x);
			}
		});
		*/
	});
	
	function getNextChar(c) {
		let nextChar = null;
		switch(c) {
			case "0": nextChar = "n0";
			break;
			case "1": nextChar = "n1";
			break;
			case "2": nextChar = "n2";
			break;
			case "3": nextChar = "n3";
			break;
			case "4": nextChar = "n4";
			break;
			case "5": nextChar = "n5";
			break;
			case "6": nextChar = "n6";
			break;
			case "7": nextChar = "n7";
			break;
			case "8": nextChar = "n8";
			break;
			case "9": nextChar = "n9";
			break;
			case "P": nextChar = "P_klein_fett";
			break;
			case "M": nextChar = "M_klein_fett";
			break;
			case "a": nextChar = "a_klein_fett";
			break;
			case "b": nextChar = "b_klein_fett";
			break;
			case "e": nextChar = "e_klein_fett";
			break;
			case "f": nextChar = "f_klein_fett";
			break;
			case "h": nextChar = "h_klein_fett";
			break;
			case "i": nextChar = "i_klein_fett";
			break;
			case "k": nextChar = "k_klein_fett";
			break;
			case "l": nextChar = "l_klein_fett";
			break;
			case "n": nextChar = "n_klein_fett";
			break;
			case "o": nextChar = "o_klein_fett";
			break;
			case "p": nextChar = "p_klein_fett";
			break;
			case "t": nextChar = "t_klein_fett";
			break;
			case "u": nextChar = "u_klein_fett";
			break;
			case "z": nextChar = "z_klein_fett";
			break;
			default: nextChar = c;
			console.log("Char "+c+" not casted yet or special!");
			break;
		}
		return nextChar;
	}
	
	function getNextRow(input,charset) {
		var tabulatorZero = 0;
		let i = 0;
		while($.isNumeric(input.charAt(i))) {
			let number = charset[getNextChar(input.charAt(i))];
			$.each(number,function(k,v){
				let tempMax = parseInt(Math.max(...v));
				if(tempMax > tabulatorZero)
					tabulatorZero += tempMax+1;
			});
			i++;
		}
		console.log(getNextChar(input.charAt(i+1)));
		let firstLetter = charset[getNextChar(input.charAt(i+1))];
		let rowZero = Math.max(...Object.keys(firstLetter));
		return {"x":tabulatorZero+3,"y":rowZero+2};
	}
});
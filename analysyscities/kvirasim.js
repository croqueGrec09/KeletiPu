//Karlstadt - analysis city VII - function area
//this will be left in the thesis submissal as a code preview for section 4.
/*
	this is a code part for the station #1 Erzeugung von Sprache. A minigame, in which the player presses a button and the 
	appropriate IPA symbol is displayed. As this code has not been included in the game yet, it won't show anything.
*/
//get keyboard press event
$(document).keypress(function(e){
	displayIPA(e);
});

//get from switch list the appropriate symbol
function displayIPA(e){
	var symbol;
	//in the order of a qwertz-keyboard
	switch(String.fromCharCode(e.which)){
		case 'q': symbol = "q";
		break;
		case 'w': symbol = "w";
		break;
		case 'e': symbol = "e "+"&#603;";
		break;
		case 'r': symbol = "r "+"&#640;";
		break;
		case 't': symbol = "t "+"&#952;";
		break;
		case 'z': symbol = "z "+"&#658;";
		break;
		case 'u': symbol = "u "+"&#650;";
		break;
		case 'i': symbol = "i "+"&#618;";
		break;
		case 'o': symbol = "o "+"&#596;";
		break;
		case 'p': symbol = "p "+"&#248;";
		break;
		case 'ü': symbol = "&#619; "+"&#641;";
		break;
		case 'a': symbol = "a "+"&#593;";
		break;
		case 's': symbol = "s "+"&#643;";
		break;
		case 'd': symbol = "d "+"&#240;";
		break;
		case 'f': symbol = "f "+"&#632;";
		break;
		case 'g': symbol = "g "+"&#610;";
		break;
		case 'h': symbol = "h "+"&#614;";
		break;
		case 'j': symbol = "j "+"&#669;";
		break;
		case 'k': symbol = "k";
		break;
		case 'l': symbol = "l "+"&#622; "+"&#671;";
		break;
		case 'ö': symbol = "&#660; "+"&#673;";
		break;
		case 'ä': symbol = "&#604;";
		break;
		case 'y': symbol = "y "+"&#655;";
		break;
		case 'x': symbol = "x "+"&#967;";
		break;
		case 'c': symbol = "c "+"&#231;";
		break;
		case 'v': symbol = "v "+"&#611;";
		break;
		case 'b': symbol = "b "+"&#946;";
		break;
		case 'n': symbol = "n "+"&#331;";
		break;
		case 'm': symbol = "m "+"&#625;";
		break;
		default: symbol = " ";
		break;
	}
	$("#symbol").html(symbol);
}
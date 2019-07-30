function farbwahl() {
var storedColor = prompt("Waehlen Sie zwischen drei Alternativen alt0, alt1 und alt2:");
	switch (storedColor) {
		case "alt1":
			alert("Sie koennen die Farbe jederzeit ueber die Farbtabelle oben aendern.");
			document.body.style.backgroundColor="#224422";
			break;
		case "alt2":
			alert("Sie koennen die Farbe jederzeit ueber die Farbtabelle oben aendern.");
			document.body.style.backgroundColor="#DDCC00";
			break;
		case "alt0":
			alert("Sie koennen die Farbe jederzeit ueber die Farbtabelle oben aendern.");
			document.body.style.backgroundColor="#222200";
			break;
			}
	}
	
function nameneingabe() {
		var enteredName = prompt("Geben Sie Ihren Namen ein!");
		var salut = "Willkommen zurueck in Aegypten, " + enteredName + "!";
		alert(salut);
}

function bild1detail() {
	if (confirm('Abu Simbel, Groesse: 152x203 px - Moechten Sie das Bild anzeigen?')){
		window.open('http://www.hki.uni-koeln.de/sites/all/files/courses/3339/HKI_abu.jpg');
	}
}

function bild2detail() {
	if (confirm('Abu Simbel-Panorama, Groesse: 297x344 px - Moechten Sie das Bild anzeigen?')){
		window.open('http://www.hki.uni-koeln.de/sites/all/files/courses/3339/HKI_abu_panorama.jpg');
	}
}

var preDefinedPassword = "Eintritt";


function requestb(){
	var enteredPassword = prompt("Bitte Passwort eingeben:");
		if (enteredPassword == preDefinedPassword) {
		nameneingabe();
		}
		else alert("Falsches Passwort. Vorgabebildschirm wird geladen.");
	}	

function requestc(){
	var enteredPassword = prompt("Zur Sicherheit: Durchlaucht! Wie lautet das Kotwort?");
		if (enteredPassword == preDefinedPassword) {
		}
		else alert("Falsches Passwort. Vorgabebildschirm wird geladen.");
		home();
	}

var img = new Array;
img[0] = new Image(), img[0].src = "passwortnormal.jpg";
img[1] = new Image(), img[1].src = "passworthighlighted.jpg";

function imagehighlight(){
	document.images[2].src = img[1].src;
}

function imagerelease(){
	document.images[2].src = img[0].src;
}
function imageChoice(){
var img2 = new Array(
	"dontkiss", "ecocar", "littlebiglebowski", "schuhe", "waschstrasse"
	);
document.images[1].src="http://lehre.hki.uni-koeln.de/hki_ps_bilder/" + img2[document.choice.Bild.selectedIndex] + ".jpg"; 
}

function changeAEOEUE(){
	var text = document.umlauttext.input.value;	
	text = text.replace(/\u00E4/g,"ae");	
	text = text.replace(/\u00C4/g,"Ae");
	text = text.replace(/\u00FC/g,"ue");
	text = text.replace(/\u00DC/g,"Ue");	
	text = text.replace(/\u00D6/g,"Oe");
	text = text.replace(/\u00F6/g,"oe");
	text = text.replace(/\u00df/g,"ss");	
	document.umlauttext.input.value = text;
}


var text1Init = "<p id='fliesstext' class='class3'> Hier muss ja irgendetwas streng Vertrauliches folgen, also schreibe ich ver&ouml;ffentlichbare Details zu Zeidel ein. <a href='javascript:showText1()'>Mehr anzeigen<\/a> <\/p>";
var text1Entire = "Irgendwann kommen die eh heraus, weil ich sie ver&ouml;ffentlichen werde. Also: Zeidel hat einen Durchmesser von ca 69 000 km, hat somiteine f&uuml;nffache Fl&auml;che, als die Erde. Dies hat zur Folge, dass St&auml;dte weit voneinander weg sind, d.h. die Entfernungen dementsprechend gr&ouml;&szlig;er sind. Da Zeidel als ein Spiegel zur Welt (zumindest f&uuml;r den Zuschauer) dienen soll, m&ouml;chte ich hier auch zeigen, dass etwas neu sein kann, obwohl es alt aussieht, Neues in altem Gewand sozusagen. Somit sehen Lokomotiven (schon E-Loks, wie die deutsche E110<\/p> <p class='class1'> <img src='http://upload.wikimedia.org/wikipedia/commons/d/d0/Locomotive_DB%2C_s%C3%A9rie_110_%28451-2%29.jpg' width='600px' alt='E 110' \/> oder die ungarische V43) <img src='http://www.trainz.hu/document/v43/kepek/v43-1143.jpg' width='600px' alt='V 43'\/> mit 20-30 Jahre alten Reisezugwagen <img src='http://rfe.railclub.ru/pix/de/car/IC%2BIR/Bm-Bomz-Bvmz/Bm235_Kbh95_M.jpg' width='600px' alt='IC-Reisezuwagen' \/> <\/p> <p class='class3'> alt aus, schaffen aber Spitzengeschwindigkeiten von 450-600 km/h. Das ist irreal, muss aber an die Entfernungen angepasst werden, damit der Fernzug als Mittelstreckenreisemittel benutzt werden kann. Auf Zeidel gibt es noch D-Z&uuml;ge, sowie die &ETH;-Z&uuml;ge. Beides sind Fernschnellz&uuml;ge; der eigentliche D-Zug ist der sog. Transkontinentalzug, der schafft Strecken von bis zu 58 000 km (der D8 f&auml;hrt den ganzen Planeten durch). <a href='javascript:hideText1()'>Weniger anzeigen<\/a> <\/p>";
var text2Init = "<p id='erlaeuterung' class='class4'> Pseudo-wissenschaftliche Abhandlung &uuml;ber den Effekt von Reizw&auml;sche am Beispiel Leder <a href='javascript:showText2()'>Lesen<\/a> <\/p>";
var text2Entire = "Naja, hier oute ich mich mal. Muss man ja! Also: Leder faszinierte mich mein ganzes Leben lang und in letzter Zeit hat es mein bewusstes Interesse geweckt: warum sind Menschen angeregt bzw. in Extase, wenn gegengeschlechtliche Partner Reizw&auml;sche anlegen und warum hat Leder eine so bet&ouml;rende Wirkung auf Menschen und warum z&auml;hlt die Lederhose teilweise als sexistisch? <p>Das Thema wird deshalb pseudowissenschaftlich abgehandelt, weil keine Literatur vorliegt, bzw. noch keine verwendet wurde, um das Thema literarisch zu unterlegen. Alles, was jetzt folgt, sind Beobachtungen und Schl&uuml;sse, die sich aus diesen Beobachtungen ergeben haben und somit NICHT wissenschaftlich belegt sind. <img src='http://src.discounto.de/pics/Angebote/2010-11/94433/118084_Lederhandschuhe_xxl.jpg' width='600px' alt='Lederhandschuhe 1' \/><\/p> <p>Eine erste Hypothese ist, dass es zum Stimulus des Menschen dazugeh&ouml;rt. Damit meine ich, dass sie bei der Auslebung ihres Liebeslebens bestimmte Hilfsmittel bed&uuml;rfen, um den Reiz zu empfinden bzw. sich voll in die Praktik hineinzuleben. Interessant w&auml;re dabei der Aspekt, ob dieses Spiel auch wechselseitig betrieben werden kann. Meistens findet man solche nennen wir sie Spielereien in der homosexuellen Szene, aber in der Werbung wird teilweise auch angedeutet, dass Leder als Bindeglied auch unter heterosexuellen Paaren zu finden ist. Da Fetisch oder die Veranlagung dazu als krankhaft bezeichnet wird, haben es Menschen schwer, sich dazu zu bekennen, zumal da heterosexuelle Paare oft in den Homosexuellen gleichgesetzt werden, was ihren eigenen Ansichten teilwese heftig widerspricht. Wenn es um den Fortpfalnzungstrieb geht, so ist festzuhalten, dass dies eines der unabschaltbaren Naturtriebe des Menschen ist, somit unternimmt der Mensch nat&uuml;rlich auch Einiges, um diesen Trieb ausleben zu k&ouml;nnen. Der K&ouml;rper hat sich darauf auch eingerichtet: durch Hormonaussch&uuml;ttungen wird dem K&ouml;rper ein Gl&uuml;cksgef&uuml;hl &uuml;bermittelt, welches er regelm&auml;&szlig;ig wie eine Droge bedarf.<\/p> <img src='http://ecx.images-amazon.com/images/I/41XPWg0TJBL._SY445_.jpg' width='600px' alt='Lederhose' \/> <p>Womit man auch beim n&auml;chsten Punkt w&auml;ren: warum K&uuml;nstler ihre Kunst deshalb tun, um gegengeschlechtliche Personen (die wie in diesem Beispiel einen Kleidergeschmack haben, der den K&uuml;nstler beeindruckt) anzuziehen und f&uuml;r sich zu gewinnen. Der Grund liegt auch hier bei den Hormonen: bekommt der K&uuml;nstler Anerkennung von einer Person, die er hinrei&szlig;end findet, also von der ein Liebreiz ausgeht, dann bekommt der einen Schub an Lust- und Gl&uuml;cksgef&uuml;hlen, die ihn zu seiner Arbeit anregen und ihn veranlassen, weit &uuml;ber seine Grenzen hinaus Experimente durchzuf&uuml;hren. Die Erkl&auml;rung ist einleuchtend: geht es um das eigene &Uuml;berleben, ist der Mensch veranlasst, alles daf&uuml;r zu tun, um sein &Uuml;berleben zu sichern.<\/p> <img src='http://www.ledermode.tv/bilder/0450W.jpg' width='600px' alt='Lederhose' \/> <img src='http://ecx.images-amazon.com/images/I/4188yCcH0YL.jpg' width='600px' alt='Lederjacke' \/> <a href='javascript:hideText2()'>Schlie&szlig;en<\/a>";

function showText1(){
	document.getElementById("fliesstext").innerHTML = text1Entire;
}

function hideText1(){
	document.getElementById("fliesstext").innerHTML = text1Init;
}

function showText2(){
	document.getElementById("erlaeuterung").innerHTML = text2Entire;
}

function hideText2(){
	document.getElementById("erlaeuterung").innerHTML = text2Init;
}
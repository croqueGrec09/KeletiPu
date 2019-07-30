// Ninaciudad
// Bewegungen

var currentMoney = 0;
var enteredStrings;
var Testtext = "Your first cup of Java: Hello World!!";
var Fehler = "Fehler unterlaufen. Bitte Skript konsultieren.";
var Baustelle = "Zum Leidwesen von Frau Dr. Compes ist der Pruefungsmodus fuer diese Strecke noch nicht fertig.";
var head = '<link rel="stylesheet" type="text/css" href="town.css" \/> <script type="text/javascript" src="town.js"> </script>';
var examPassed = false;
var stationNumberGrowing = true;
var additionalMoneyS1 = new Array(16);
var additionalMoneyS2 = new Array(14);
var additionalMoneyS3 = new Array(17);
var additionalMoneyS4 = new Array(18);
var additionalMoneyS5 = new Array(19);
var additionalMoneyS6 = new Array(7);
var additionalMoneyS7 = new Array(10);
var additionalMoneyS8 = new Array(12);
var additionalMoneyS9 = new Array(9);
var additionalMoneyS10 = new Array(9);
var additionalMoneyS11 = new Array(18);
var additionalMoneyS12 = new Array(15);
var additionalMoneyS13 = new Array(15);
var motDePasse = "GHA-L-536";
var entireHaul = 0;
var currentStation = 0;

function s601() {
	additionalMoney = 20;
	entireHaul = 140;
	if (examPassed == false
			&& confirm("Hallo, Wanderer! Du besteigst den Zug Richtung Modellierung-Strasse! Moechtest Du diese Strecke befahren? Sie bringt dir "
					+ entireHaul + " Z!")) {
		alert("Super! Das ist eine gute Entscheidung! Du krigest testweise "
				+ additionalMoney + " Z ueberwiesen.");
		currentMoney = (currentMoney + additionalMoney);
		quizOrDiscover601();
	} else if (examPassed == true
			&& confirm("Hallo, Wanderer! Du besteigst den Zug Richtung Modellierung-Strasse! Moechtest Du diese Strecke erneut befahren und dein Wissen"
					+ "nochmal auffrischen?")) {
		alert("In Ordnung, die S6 faehrt sofort ab.");
		nextStation(60);
	} else
		alert("Schade. Du nimmst einen anderen Zug ...");
}

function s602() {
	additionalMoney = 20;
	entireHaul = 140;
	if (examPassed == false
			&& confirm("Hallo, Wanderer! Du besteigst den Zug Richtung Hauptbahnhof! Moechtest Du diese Strecke befahren? Sie bringt dir "
					+ entireHaul + " Z!")) {
		alert("Super! Das ist eine gute Entscheidung! Du krigest testweise "
				+ additionalMoney + " Z ueberwiesen.");
		currentMoney = (currentMoney + additionalMoney);
		quizOrDiscover602();
	} else if (examPassed == true
			&& confirm("Hallo, Wanderer! Du besteigst den Zug Richtung Modellierung-Strasse! Moechtest Du diese Strecke erneut befahren und dein Wissen"
					+ "nochmal auffrischen?")) {
		alert("In Ordnung, die S6 faehrt sofort ab.");
		nextStation(66);
	} else
		alert("Schade. Du nimmst einen anderen Zug ...");
}

function quizOrDiscover601() {
	if (confirm("Moechtest du die Strecke im Quizmodus (OK) oder im Entdeckungsmodus (Abbrechen) befahren? (im Entdeckungsmodus kannst du umsteigen, im Quizmodus nicht!)")) {
		nextStationExamine(060);
	} else
		nextStation(60);
}

function quizOrDiscover602() {
	if (confirm("Moechtest du die Strecke im Quizmodus (OK) oder im Entdeckungsmodus (Abbrechen) befahren? (im Entdeckungsmodus kannst du umsteigen, im Quizmodus nicht!)")) {
		nextStationExamine(166);
	} else
		previousStation(66);
}

// Entdeckungsmodus

function centralStationQuestionInformation() {
	alert("Nachster Halt: Ninaciudad Hauptbahnhof - Endstation");
	document.close();
	document.open();
	document.location="Ninaciudad.html";
}

function s6Station1QuestionInformation(stationNumberGrowing) {
	alert("Naechster Halt: Kommunikation");
	if (stationNumberGrowing == true){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station1();
		} else
			s6Station2QuestionInformation(true);
	}
	else if (stationNumberGrowing == false){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station1();
		} else
			centralStationQuestionInformation();
	}
	else alert(Fehler + "Variablenstatus: " + stationNumberGrowing);
}

function s6Station2QuestionInformation(stationNumberGrowing) {
	alert("Naechster Halt: Kommunikationsmodelle");
	if (stationNumberGrowing == true){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station2();
		} else
			s6Station3QuestionInformation(true);
	}
	else if (stationNumberGrowing == false){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station2();
		} else
			s6Station1QuestionInformation(false);
	}
	else alert(Fehler + "Variablenstatus: " + stationNumberGrowing);
}

function s6Station3QuestionInformation(stationNumberGrowing) {
	alert("Naechster Halt: Schulz von Thun");
	if (stationNumberGrowing == true){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station3();
		} else
			s6Station4QuestionInformation(true);
	}
	else if (stationNumberGrowing == false){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station3();
		} else
			s6Station2QuestionInformation(false);
	}
	else alert(Fehler + "Variablenstatus: " + stationNumberGrowing);
}

function s6Station4QuestionInformation(stationNumberGrowing) {
	alert("Naechster Halt: Jakobson");
	if (stationNumberGrowing == true){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station4();
		} else
			s6Station5QuestionInformation(true);
	}
	else if (stationNumberGrowing == false){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station4();
		} else
			s6Station3QuestionInformation(false);
	}
	else alert(Fehler + "Variablenstatus: " + stationNumberGrowing);
}

function s6Station5QuestionInformation(stationNumberGrowing) {
	alert("Naechster Halt: Buehler-Strasse.");
	if (stationNumberGrowing == true){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station5();
		} else
			s6Station6QuestionInformation(true);
	}
	else if (stationNumberGrowing == false){
		if (confirm("Moechtest Du dich hier umsehen?")) {
			s6Station5();
		} else
			s6Station4QuestionInformation(false);
	}
	else alert(Fehler + "Variablenstatus: " + stationNumberGrowing);
}

function s6Station6QuestionInformation() {
	alert("Naechster Halt: Modellierung-Strasse. Endstation.");
	s6Station6();
}

// Stationennummern: ohne '0': Erkundung, mit '0': Prüfung!

function s6Station1() {
	var bodyH1 = '<h1>Bahnhof Kommunikation<\/h1>';
	var bodyImages = '<img src="http://imageshack.us/a/img547/2676/kommunikation.jpg" alt="Bahnhof Kommunikation"\/>';
	var bodyTextP1 = '<p>Kommunikation findet auf vielen Ebenen statt: zwischenmenschlich, zwischen Tieren - stets gibt es ein Medium zur Kommunikation. Es gibt Mittel zur Kommunikation, dies kann &uuml;ber die Augen, die Nase oder den Mund erfolgen, oder auch k&ouml;rperlich. Die Art und die Eigenschaften dieser Mittel wird durch die Design Features beschrieben, du findest sie, wenn du ab dem Bahnhof Design Features (zu erreichen mit der S4) die RB 12 Richtung Grammatikalisierung nimmst. <\/p>';
	var bodyTextP2 = '<p>Dabei werden auch verschiedene Regeln beachtet (oder auch mi&szlig;achtet); diese hat Grice 1975 erstmals beschrieben. Dazu verwendete er das Wort "Maxime".<\/p>'; 
	var	bodyTextP3 = '<p>Genauer erl&auml;utert wird das gesamte Thema in der Stadt Pragmatik, dort erf&auml;hrst du alles, was du &uuml;ber Pragmatik, die Lehre des Sprechens als Handlung, wissen m&ouml;chtest. Nimm dazu die RE 3, die hier h&auml;lt, sie bringt dich direkt dorthin.<\/p>';
	var bodyH2 = '<h2>Hier haltende Z&uuml;ge:<\/h2>';
	var bodyInterchangeA = '<input type="button" value="Weiter Richtung Modellierung" onclick="nextStation(61)"\/>';
	var bodyInterchangeB = '<input type="button" value="Weiter Richtung Hauptbahnhof" onclick="previousStation(61)"\/>';
	var bodyInterchangeC = '<input type="button" value="Andere Linien" onclick="interchangeKommunikation"\/>';
	var dienstfahrt = '<input type="button" value="Teleport" onclick="passwordcheck()"\/>';
	document.close();
	document.open();
	document.write(head + bodyH1 + bodyImages + bodyTextP1 + bodyTextP2 + bodyTextP3 + bodyH2
			+ bodyInterchangeA + bodyInterchangeB + bodyInterchangeC + dienstfahrt);
}

function s6Station2() {
	var bodyH1 = '<h1>Bahnhof Kommunikationsmodelle<\/h1>';
	var bodyImages = '<img src="http://imageshack.us/a/img824/1848/kommunikationsmodellebh.jpg" alt="Bahnhof Kommunikationsmodelle"\/> <p><img src="http://imageshack.us/a/img32/7708/organon.jpg" width="720px" alt="Das Organon-Modell von Bühler" \/> <img src="http://imageshack.us/a/img39/6623/kommunikationsmodelle.jpg" width="720px" alt="Jakobson-Modell" \/><\/p>';
	var bodyH2 = '<h2>Hier haltende Z&uuml;ge:<\/h2>';
	var bodyInterchangeA = '<input type="button" value="Weiter Richtung Modellierung" onclick="nextStation(62)"\/>';
	var bodyInterchangeB = '<input type="button" value="Weiter Richtung Hauptbahnhof" onclick="previousStation(62)"\/>';
	var dienstfahrt = '<input type="button" value="Teleport" onclick="passwordcheck()"\/>';
	document.close();
	document.open();
	document.write(head + bodyH1 + bodyImages + bodyH2 + bodyInterchangeA + bodyInterchangeB + dienstfahrt);
}

function s6Station3() {
	var bodyH1 = '<h1>Bahnhof Schulz von Thun<\/h1>';
	var bodyImages = '<img src="http://imageshack.us/a/img22/7653/schulzvonthun.jpg" alt="Schulz von Thun"\/>';
	var bodyTextP1 = '<p>Das Kommunikationsmodell von Schulz von Thun wurde im Proseminar nicht behandelt. Es ist dennoch ein interessantes Modell, denn es setzt die auch im Jakobson- bzw. Organon-Modell genannten Positionen Sender, Empf&auml;nger und Appell gegen&uuml;ber.<\/p>';
	var bodyTextUL1 = '<p>Es stellt vier Punkte dar: <ul><li>den Sachbezug<\/li><li>die Selbstoffenbarung<\/li><li>die Beziehung (zwischen Sender und Empf&auml;nger) und <\/li> <li>den Appell.<\/li><\/ul> Hier wird erstmals deutlich, dass die einzelnen Modelle untereinander austauschbar sind; ihr werder sp&auml;ter feststellen, dass die Sachebene &uuml;berall anzutreffen ist, ebenso Sender und Empf&auml;nger und der Appell.<\/p>';
	var bodyTextUL2 = '<p>Was aber bedeuten diese Punkte? <ul><li>Der Sachbezug steht f&uuml;r den Gespr&auml;chsinhalt; darum geht es im Gespr&auml;ch.<\/li><li>Die Selbstoffenbarung bezeichnet das Auftreten des Senders; das hat der Sender im Gedanken.<\/li> <li>Die Beziehung ist das Verh&auml;ltnis, in dem sich Sender und Empf&auml;nger befinden.<\/li> <li>der Appell ist das, was der Sender den Empf&auml;nger mitteilen (oder auffordern) will.<\/li> <\/ul> <\/p>';
	var bodyTextUL3 = "<p>Ein Beispiel: Mach' mal das Fenster zu. <ul><li>Sachbezug: das offene Fenster<\/li> <li>Selbstoffenbarung: dem Sender (mir) ist kalt.<\/li> <li>Beziehung: am Ton kann man sagen, wir kennen uns.<\/li> <li>Appell: der Empf&auml;nger (du) soll das Fenster schlie&szlig;en. <\/li> <\/ul> <\/p>";
	var bodyH2 = '<h2>Hier haltende Z&uuml;ge:<\/h2>';
	var bodyInterchangeA = '<input type="button" value="Weiter Richtung Modellierung" onclick="nextStation(63)"\/>';
	var bodyInterchangeB = '<input type="button" value="Weiter Richtung Hauptbahnhof" onclick="previousStation(63)"\/>';
	var dienstfahrt = '<input type="button" value="Teleport" onclick="passwordcheck()"\/>';
	document.close();
	document.open();
	document.write(head + bodyH1 + bodyImages + bodyTextP1 + bodyTextUL1
			+ bodyTextUL2 + bodyTextUL3 + bodyH2 + bodyInterchangeA + bodyInterchangeB + dienstfahrt);
}

function s6Station4() {
	var bodyH1 = '<h1>Bahnhof Jakobson<\/h1>';
	var bodyImages = '<img src="http://imageshack.us/a/img40/2723/jakobson.jpg" alt="Jakobson"\/> <p> <img src="http://imageshack.us/a/img39/6623/kommunikationsmodelle.jpg" width="720px" alt="Jakobson-Modell" \/><\/p>';
	var bodyH2 = '<h2>Hier haltende Z&uuml;ge:<\/h2>';
	var bodyInterchangeA = '<input type="button" value="Weiter Richtung Modellierung" onclick="nextStation(64)"\/>';
	var bodyInterchangeB = '<input type="button" value="Weiter Richtung Hauptbahnhof" onclick="previousStation(64)"\/>';
	var dienstfahrt = '<input type="button" value="Teleport" onclick="passwordcheck()"\/>';
	document.close();
	document.open();
	document.write(head + bodyH1 + bodyImages + bodyH2 + bodyInterchangeA + bodyInterchangeB + dienstfahrt);
}

function s6Station5() {
	var bodyH1 = '<h1>Bahnhof B&uuml;hler<\/h1>';
	var bodyImages = '<img src="http://imageshack.us/a/img594/8135/buehler.jpg" alt="B&uuml;hler"\/> <p><img src="http://imageshack.us/a/img32/7708/organon.jpg" width="720px" alt="Das Organon-Modell von Bühler" \/> <\/p>';
	var bodyH2 = '<h2>Hier haltende Z&uuml;ge:<\/h2>';
	var bodyInterchangeA = '<input type="button" value="Weiter Richtung Modellierung" onclick="nextStation(65)"\/>';
	var bodyInterchangeB = '<input type="button" value="Weiter Richtung Hauptbahnhof" onclick="previousStation(65)"\/>';
	var dienstfahrt = '<input type="button" value="Teleport" onclick="passwordcheck()"\/>';
	document.close();
	document.open();
	document.write(head + bodyH1 + bodyImages + bodyH2 + bodyInterchangeA + bodyInterchangeB + dienstfahrt);
}

function s6Station6() {
	var bodyH1 = '<h1>Endstation Modellierung<\/h1>';
	var bodyImages = '<img src="http://imageshack.us/a/img689/9502/modellierung.jpg" alt="Modellierung"\/>';
	var bodyH2 = '<h2>Hier haltende Z&uuml;ge:<\/h2>';
	var bodyInterchange = '<button name="Modellierung" type="button" value="S6" onclick="s602();"> <p> <img src="http://imageshack.us/a/img811/2622/s6hauptbf.jpg" alt="S6 Richtung Hauptbahnhof"\/> <\/p> <\/button>';
	var dienstfahrt = '<input type="button" value="Teleport" onclick="passwordcheck()"\/>';
	document.close();
	document.open();
	document.write(head + bodyH1 + bodyImages + bodyH2 + bodyInterchange + dienstfahrt);
}

function nextStation(getCurrentStation) {
	if (getCurrentStation == 60) 
		s6Station1QuestionInformation(true);
	if (getCurrentStation == 61) {
		if (confirm("Moechtest Du weiterfahren?")) {
			s6Station2QuestionInformation(true);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station1();
		}
	}
	if (getCurrentStation == 62) {
		if (confirm("Moechtest Du weiterfahren?")) {
			s6Station3QuestionInformation(true);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station2();
		}
	}
	if (getCurrentStation == 63) {
		if (confirm("Moechtest Du weiterfahren?")) {
			s6Station4QuestionInformation(true);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station3();
		}
	}
	if (getCurrentStation == 64) {
		if (confirm("Moechtest Du weiterfahren?")) {
			s6Station5QuestionInformation(true);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station4();
		}
	}
	if (getCurrentStation == 65) {
		if (confirm("Moechtest Du weiterfahren?")) {
			s6Station6QuestionInformation(true);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station5();
		}
	}	
}

function previousStation(getCurrentStation) {
	if (getCurrentStation == 61) {
		if (confirm("Moechtest Du weiterfahren?")) {
			centralStationQuestionInformation(false);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station1();
		}
	}
	if (getCurrentStation == 62) {
		if (confirm("Moechtest Du weiterfahren?")) {
			s6Station1QuestionInformation(false);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station2();
		}
	}
	if (getCurrentStation == 63) {
		if (confirm("Moechtest Du weiterfahren?")) {
			s6Station2QuestionInformation(false);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station3();
		}
	}
	if (getCurrentStation == 64) {
		if (confirm("Moechtest Du weiterfahren?")) {
			s6Station3QuestionInformation(false);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station4();
		}
	}
	if (getCurrentStation == 65) {
		if (confirm("Moechtest Du weiterfahren?")) {
			s6Station4QuestionInformation(false);
		} else {
			alert("Vielleicht eine andere Linie?");
			s6Station5();
		}
	}
	if (getCurrentStation == 66)
		s6Station5QuestionInformation(false);
}

// Prüfungsmodus-Bewegung

function nextStationExamine(getCurrentStation) {
	switch (getCurrentStation){
	case 161: s6centralStationWrite(false);
	break;
	case 060: s6Station1Write(true);
	break;
	case 162: s6Station1Write(false);
	break;
	case 061: s6Station2Write(true);
	break;
	case 163: s6Station2Write(false);
	break;
	case 062: s6Station3Write(true);
	break;
	case 164: s6Station3Write(false);
	break;
	case 063: s6Station4Write(true);
	break;
	case 165: s6Station4Write(false);
	break;
	case 064: s6Station5Write(true);
	break;
	case 166: s6Station5Write(false);
	break;
	case 065: s6Station6Write(true);
	break;
	}
}


// Examinator

/*
 * persönliche Widmung an Fr. Dr. Compes :-) Hier werden alle Fachtermini
 * zugewiesen. Das ist die Wissensbasis meiner KI, schöne Grüße an Herr
 * Neuefeind!!
 */

var Kommunikation = new Array("Austausch", "austauschen", "Inhaltsaustausch", "Austauschen von Inhalten", "Kooperation", 
							"Kooperationsprinzip", "Gegenseitigkeit", "es wird implikatiert", "Implikatur", "Relation", 
							"Qualität", "Quantität", "Modalität");
 
var Jakobson = new Array("referentiell", "referentielle Funktion", "kognitiv",
		"kognitive Funktion", "denotativ", "denotative Funtion", "emotiv",
		"emotive Funktion", "expressiv", "expressive Funktion", "konativ",
		"konative Funktion", "appelativ", "appelative Funtion", "appellativ",
		"appellative Funktion", "phatisch", "phatische Funktion", "metasprachlich", 
		"metasprachliche Funktion", "erl&auml;uternde Funktion", "erlaeuternd", 
		"poetisch", "poetische Funktion");

// Abfragen

function s6Station1Write(stationNumberGrowing) {
	alert("Naechster Halt: Kommunikation");
	var bodyH1 = '<h1>Bahnhof Kommunikation<\/h1>';
	var bodyH2no1 = '<h2>1: Wozu dient Kommunikation?<\/h2>';
	var formNo1 = '<form name="kommunikation" action=""> <input name="question1" type="text" size="20" maxlength="20" \/>';
	var bodyH2no2 = '<h2>2: Welches Prinzip wird bei der Kommunikation befolgt?<\/h2>';
	var formNo2 = '<form name="kommunikation" action=""> <input name="question2" type="text" size="20" maxlength="20" \/>';
	var bodyH2no3 = '<h2>3: Was geschieht, wenn einige von den Kommunikationsmaximen nicht befolgt werden?<\/h2>';
	var formNo3 = '<form name="kommunikation" action=""> <input name="question3" type="text" size="20" maxlength="20" \/>';
	var bodyH2no4 = '<h2>4: Welche Maximen gibt es?<\/h2>';
	var formNo4 = '<form name="kommunikation" action=""> <input name="question4a" type="text" size="20" maxlength="20" \/> <input name="question4b" type="text" size="20" maxlength="20" \/> <input name="question4c" type="text" size="20" maxlength="20" \/> <input name="question4d" type="text" size="20" maxlength="20" \/>';
	var bodyH2no5 = '<h2>5: Welche der Maximen werden hier klar mi&szlig;achtet?<\/h2>';
	var ul1 = '<ul class="question"><li>Beispiel 1 <i>"Wei&szlig;t du noch, wo Anja wohnt?" "Erm ... irgendwo in der N&auml;he von Poll, aber wo GENAU ...?"<\/i><\/li><li>Beispiel 2<i>"Kommunikation ist, wenn mich nicht alles tr&uuml;gt, das, wie sich Menschen verstehen, um sich auszutauschen, das machen sie, um ..." (und so geht es einige Minuten weiter)<\/i><\/li><li>Beispiel 3<i>"Ich habe den Zug verpasst!" "Tja, du MUSSTEST aber auch unbedingt in die Stadt ..."<\/i><\/li><li>Beispiel 4<i> Vor einer Klausur: "Das werde ich nicht mehr &uuml;berleben! Aus diesem Raum komme ich nicht mehr lebend raus!"<\/i><\/li><\/ul>';
	var formNo5 = '<form name="kommunikation" action=""> <input name="question5a" type="text" size="20" maxlength="20" \/> <input name="question5b" type="text" size="20" maxlength="20" \/> <input name="question5c" type="text" size="20" maxlength="20" \/> <input name="question5d" type="text" size="20" maxlength="20" \/> <\/form>';
	if (stationNumberGrowing == true)
		var button = '<input type="button" value="Best&auml;tigen" onclick="questions1(stationNumberGrowing)" \/>';
	if (stationNumberGrowing == false)
		var button = '<input type="button" value="Best&auml;tigen" onclick="questions1(stationNumberGrowing)" \/>';
	var dienstfahrt = '<input type="button" value="Teleport" onclick="passwordcheck()"\/>';
	document.close();
	document.open();
	document.write(head + bodyH1 + bodyH2no1 + formNo1 + bodyH2no2 + formNo2 + bodyH2no3 + formNo3 + bodyH2no4 + formNo4 + bodyH2no5 + ul1 + formNo5 + button + dienstfahrt);	
}

function questions1(stationNumberGrowing){
	var enteredStrings1 = document.kommunikation.question1.value;
	var enteredStrings2 = document.kommunikation.question2.value;
	var enteredStrings3 = document.kommunikation.question3.value;
	var enteredStrings4a = document.kommunikation.question4a.value;
	var enteredStrings4b = document.kommunikation.question4b.value;
	var enteredStrings4c = document.kommunikation.question4c.value;
	var enteredStrings4d = document.kommunikation.question4d.value;	
	var enteredStrings5a = document.kommunikation.question5a.value;
	var enteredStrings5b = document.kommunikation.question5b.value;
	var enteredStrings5c = document.kommunikation.question5c.value;
	var enteredStrings5d = document.kommunikation.question5d.value;
	var answersCorrect = new Array(5);
	for (var i=0;i>5;i++){
		answersCorrect[i] = false;
	}
	if (enteredStrings1 == Kommunikation[0] ||
		enteredStrings1 == Kommunikation[1] ||
		enteredStrings1 == Kommunikation[2] ||
		enteredStrings1 == Kommunikation[3]){
		answersCorrect[0] = true;
		alert("Methode 1 aufgerufen:" + answersCorrect[0]);
	}
	else
		if (answersCorrect[0] == false){
		alert("Methode 1 aufgerufen:" + answersCorrect[0]);
		document.kommunikation.question1.value = null;		
	}
	if (enteredStrings2 == Kommunikation[4] ||
		enteredStrings2 == Kommunikation[5] ||
		enteredStrings2 == Kommunikation[6]){
		answersCorrect[1] = true;
		alert("Methode 2 aufgerufen:" + answersCorrect[1]);
	}
	else
		if (answersCorrect[1] == false){
		alert("Methode 2 aufgerufen:" + answersCorrect[1]);	
		document.kommunikation.question2.value = null;
	}	
	if (enteredStrings3 == Kommunikation[7] ||
		enteredStrings3 == Kommunikation[8]){
		answersCorrect[2] = true;
		alert("Methode 3 aufgerufen:" + answersCorrect[2]);
	}
	else 
		if (answersCorrect[2] == false){
		alert("Methode 3 aufgerufen:" + answersCorrect[2]);	
		document.kommunikation.question3.value = null;
	}	
	if (
		(enteredStrings4a == Kommunikation[9] ||
		enteredStrings4b == Kommunikation[10] ||
		enteredStrings4c == Kommunikation[11] ||
		enteredStrings4d == Kommunikation[12]) ||
		(enteredStrings4a == Kommunikation[9] ||
		enteredStrings4b == Kommunikation[10] ||
		enteredStrings4d == Kommunikation[11] ||
		enteredStrings4c == Kommunikation[12]) ||
		(enteredStrings4a == Kommunikation[9] ||
		enteredStrings4d == Kommunikation[10] ||
		enteredStrings4b == Kommunikation[11] ||
		enteredStrings4c == Kommunikation[12]) ||
		(enteredStrings4a == Kommunikation[9] ||
		enteredStrings4d == Kommunikation[10] ||
		enteredStrings4c == Kommunikation[11] ||
		enteredStrings4b == Kommunikation[12]) ||
		(enteredStrings4b == Kommunikation[9] ||
		enteredStrings4a == Kommunikation[10] ||
		enteredStrings4c == Kommunikation[11] ||
		enteredStrings4d == Kommunikation[12]) ||
		(enteredStrings4b == Kommunikation[9] ||
		enteredStrings4a == Kommunikation[10] ||
		enteredStrings4d == Kommunikation[11] ||
		enteredStrings4c == Kommunikation[12]) ||
		(enteredStrings4b == Kommunikation[9] ||
		enteredStrings4d == Kommunikation[10] ||
		enteredStrings4a == Kommunikation[11] ||
		enteredStrings4c == Kommunikation[12]) ||
		(enteredStrings4b == Kommunikation[9] ||
		enteredStrings4d == Kommunikation[10] ||
		enteredStrings4c == Kommunikation[11] ||
		enteredStrings4a == Kommunikation[12]) ||
		(enteredStrings4c == Kommunikation[9] ||
		enteredStrings4b == Kommunikation[10] ||
		enteredStrings4a == Kommunikation[11] ||
		enteredStrings4d == Kommunikation[12]) ||
		(enteredStrings4c == Kommunikation[9] ||
		enteredStrings4b == Kommunikation[10] ||
		enteredStrings4d == Kommunikation[11] ||
		enteredStrings4a == Kommunikation[12]) ||
		(enteredStrings4c == Kommunikation[9] ||
		enteredStrings4d == Kommunikation[10] ||
		enteredStrings4b == Kommunikation[11] ||
		enteredStrings4a == Kommunikation[12]) ||
		(enteredStrings4c == Kommunikation[9] ||
		enteredStrings4d == Kommunikation[10] ||
		enteredStrings4a == Kommunikation[11] ||
		enteredStrings4b == Kommunikation[12]) ||
		(enteredStrings4d == Kommunikation[9] ||
		enteredStrings4b == Kommunikation[10] ||
		enteredStrings4c == Kommunikation[11] ||
		enteredStrings4a == Kommunikation[12]) ||
		(enteredStrings4d == Kommunikation[9] ||
		enteredStrings4b == Kommunikation[10] ||
		enteredStrings4a == Kommunikation[11] ||
		enteredStrings4c == Kommunikation[12]) ||
		(enteredStrings4d == Kommunikation[9] ||
		enteredStrings4a == Kommunikation[10] ||
		enteredStrings4b == Kommunikation[11] ||
		enteredStrings4c == Kommunikation[12]) ||
		(enteredStrings4d == Kommunikation[9] ||
		enteredStrings4a == Kommunikation[10] ||
		enteredStrings4c == Kommunikation[11] ||
		enteredStrings4b == Kommunikation[12])		
		){
		answersCorrect[3] = true;
		alert("Methode 4 aufgerufen:" + answersCorrect[3]);
	}	
	else 
		if (answersCorrect[3] = false){
		alert("Methode 4 aufgerufen:" + answersCorrect[3]);
		document.kommunikation.question4a.value = null;
		document.kommunikation.question4b.value = null;
		document.kommunikation.question4c.value = null;
		document.kommunikation.question4d.value = null;
	}
	if (enteredStrings5a == Kommunikation[10] ||
		enteredStrings5a == Kommunikation[11] &&
		enteredStrings5b == Kommunikation[9] ||
		enteredStrings5b == Kommunikation[11] &&
		enteredStrings5c == Kommunikation[10] &&
		enteredStrings5d == Kommunikation[12]){
		answersCorrect[4] = true;
		alert("Methode 5 aufgerufen:" + answersCorrect[4]);
	}
	else
		if (answersCorrect[4] = false){
		alert("Methode 5 aufgerufen:" + answersCorrect[4]);
		document.kommunikation.question5a.value = null;
		document.kommunikation.question5b.value = null;
		document.kommunikation.question5c.value = null;
		document.kommunikation.question5d.value = null;
	}
	if (answersCorrect[0] == true && answersCorrect[1] == true &&
		answersCorrect[2] == true && answersCorrect[3] == true &&
		answersCorrect[4] == true){
		additionalMoneyS6[1] = 20;
		alert("Sehr gut! Dafuer bekommst du " + additionalMoneyS6[1] + " Z gutgeschrieben!");
		currentMoney = currentMoney + additionalMoneyS6[1];
		if (stationNumberGrowing == true) nextStationExamine(061);
		else nextStationExamine(161);
	}
}

function s6Station2Write(stationNumberGrowing) {
	alert("Naechster Halt: Kommunikationsmodelle");
	alert(Baustelle);
	additionalMoneyS6[2] = 20;
	currentMoney = currentMoney + additionalMoneyS6[2];
	alert("Kontoauszug Test: " + currentMoney);
	if (stationNumberGrowing == true) nextStationExamine(062);
	else nextStationExamine(162);
}

function s6Station3Write(stationNumberGrowing) {
	alert("Naechster Halt: Schulz von Thun");
	alert(Baustelle);
	additionalMoneyS6[3] = 20;
	currentMoney = currentMoney + additionalMoneyS6[3];
	alert("Kontoauszug Test: " + currentMoney);
	if (stationNumberGrowing == true) nextStationExamine(063);
	else nextStationExamine(163);
}

function s6Station4Write(stationNumberGrowing) {
	alert("Naechster Halt: Jakobson");
	var bodyH1 = '<h1>Bahnhof Jakobson<\/h1>';
	var bodyH2no1 = '<h2>1: Welche Funktion beschreibt den Empf&auml;nger?<\/h2>';
	var formNo1 = '<form name="jakobson" action=""> <input name="question1" type="text" size="20" maxlength="20" \/>';
	var bodyH2no2 = '<h2>2: Welche Funktion sticht in diese S&auml;tzen jeweils besonders hervor?<\/h2>';
	var ul1 = '<ul class="question"><li>Junge zu einem M&auml;dchen, das ihm gef&auml;llt: <i>Du bist aber sehr sch&ouml;n heute!<\/i><\/li><li>Im Gespr&auml;ch: <i>Worum ging es bitte?<\/i><\/li><li>Akkumulation: <i>Nennt es Liebe! Amour! Szerelem!<\/i><\/li><li>Mitten im Gespr&auml;ch: <i>Warte mal einen Moment!<\/i><\/li><\/ul>';
	var formNo2 = '<form name="jakobson" action=""> <input name="question2a" type="text" size="20" maxlength="20" \/> <input name="question2b" type="text" size="20" maxlength="20" \/> <input name="question2c" type="text" size="20" maxlength="20" \/> <input name="question2d" type="text" size="20" maxlength="20" \/>';
	var bodyH2no3 = '<h2>3: Aus der Folie: Welche der Funktionen, die im Modell beschrieben werden, hebt die Sprache von anderen Zeichensystemen ab?<\/h2>';
	var formNo3 = '<form name="jakobson" action=""> <input name="question3" type="text" size="20" maxlength="20" \/>';
	var bodyH2no4 = '<h2>4: Welche Funktion erm&ouml;glicht uns, &uuml;ber den Code selbst zu sprechen?<\/h2>';
	var formNo4 = '<form name="jakobson" action=""> <input name="question4" type="text" size="20" maxlength="20" \/>';
	var bodyH2no5 = '<h2>5: Gibt es eine Funktion, die auch in nicht-sprachlichen Zeichensystemen anzutreffen ist?<\/h2>';
	var formNo5 = '<form name="jakobson" action=""> <input name="question5" type="text" size="20" maxlength="20" \/> <\/form>';
	if (stationNumberGrowing == true) 
		var button = '<input type="button" value="Best&auml;tigen" onclick="questions4(stationNumberGrowing)" \/>';
	if (stationNumberGrowing == false)
		var button = '<input type="button" value="Best&auml;tigen" onclick="questions4(stationNumberGrowing)" \/>';
	var dienstfahrt = '<input type="button" value="Teleport" onclick="passwordcheck()"\/>';
	document.close();
	document.open();
	document.write(head + bodyH1 + bodyH2no1 + formNo1 + bodyH2no2 + ul1 + formNo2 + bodyH2no3 + formNo3 + bodyH2no4 + formNo4 + bodyH2no5 + formNo5 + button + dienstfahrt);
}

function questions4(stationNumberGrowing) {
	var enteredStrings1 = document.jakobson.question1.value;
	var enteredStrings2a = document.jakobson.question2a.value;
	var enteredStrings2b = document.jakobson.question2b.value;
	var enteredStrings2c = document.jakobson.question2c.value;
	var enteredStrings2d = document.jakobson.question2d.value;	
	var enteredStrings3 = document.jakobson.question3.value;
	var enteredStrings4 = document.jakobson.question4.value;
	var enteredStrings5 = document.jakobson.question5.value;
	var answersCorrect = new Array(5);
	for (var i=0;i>5;i++){
		answersCorrect[i] = false;
	}
	if (enteredStrings1 == Jakobson[10] 
			|| enteredStrings1 == Jakobson[11]
			|| enteredStrings1 == Jakobson[12]
			|| enteredStrings1 == Jakobson[13]
			|| enteredStrings1 == Jakobson[14]
			|| enteredStrings1 == Jakobson[15]){
		answersCorrect[0] = true;
		alert("Methode 1 aufgerufen:" + answersCorrect[0]);
	}
	else
		if (answersCorrect[0] == false){
		alert("Methode 1 aufgerufen:" + answersCorrect[0]);
		document.jakobson.question1.value = null;		
	}	
	if ((enteredStrings2a == Jakobson[10] 
			|| enteredStrings2a == Jakobson[11]
			|| enteredStrings2a == Jakobson[12]
			|| enteredStrings2a == Jakobson[13]
			|| enteredStrings2a == Jakobson[14] 
			|| enteredStrings2a == Jakobson[15])
			&& (enteredStrings2b == Jakobson[0]
			|| enteredStrings2b == Jakobson[1]
			|| enteredStrings2b == Jakobson[2]
			|| enteredStrings2b == Jakobson[3] 
			|| enteredStrings2b == Jakobson[4])
			&& (enteredStrings2c == Jakobson[22] 
			|| enteredStrings2c == Jakobson[23])
			&& (enteredStrings2d == Jakobson[16] 
			|| enteredStrings2d == Jakobson[17])){
		answersCorrect[1] = true;
		alert("Methode 2 aufgerufen:" + answersCorrect[1]);
	}
	else
		if (answersCorrect[1] == false){
		alert("Methode 2 aufgerufen:" + answersCorrect[1]);
		document.jakobson2.question2a.value = null;
		document.jakobson2.question2b.value = null;
		document.jakobson2.question2c.value = null;
		document.jakobson2.question2d.value = null;
	}	
	if (((enteredStrings3 == Jakobson[16])
			|| (enteredStrings3 == Jakobson[17]))
			|| ((enteredStrings3 == Jakobson[22]) 
			|| (enteredStrings3 == Jakobson[23]))
			|| ((enteredStrings3 == Jakobson[18]) 
			|| (enteredStrings3 == Jakobson[19])
			|| (enteredStrings3 == Jakobson[20])
			|| (enteredStrings3 == Jakobson[21]))){
		answersCorrect[2] = true;
		alert("Methode 3 aufgerufen:" + answersCorrect[2]);
	}
	else
		if (answersCorrect[2] == false){
		alert("Methode 3 aufgerufen:" + answersCorrect[2]);
		document.jakobson.question3.value = null;		
	}	
	if ((enteredStrings4 == Jakobson[18]) 
			|| (enteredStrings4 == Jakobson[19])
			|| (enteredStrings4 == Jakobson[20])
			|| (enteredStrings4 == Jakobson[21])){
		answersCorrect[3] = true;
		alert("Methode 4 aufgerufen:" + answersCorrect[3]);
	}
	else
		if (answersCorrect[3] == false){
		alert("Methode 4 aufgerufen:" + answersCorrect[3]);
		document.jakobson4.question4.value = null;	
	}	
	if ((enteredStrings5 == Jakobson[0]) 
			|| (enteredStrings5 == Jakobson[1])
			|| (enteredStrings5 == Jakobson[2])
			|| (enteredStrings5 == Jakobson[3])
			|| (enteredStrings5 == Jakobson[4])
			|| (enteredStrings5 == Jakobson[5])){
		answersCorrect[4] = true;
		alert("Methode 5 aufgerufen:" + answersCorrect[4]);
	}
	else
		if (answersCorrect[4] == false){
		alert("Methode 5 aufgerufen:" + answersCorrect[4]);
		document.jakobson5.question5.vale = null;	
	}	
	if (answersCorrect[0] == true && answersCorrect[1] == true &&
		answersCorrect[2] == true && answersCorrect[3] == true &&
		answersCorrect[4] == true){	
		additionalMoneyS6[4] = 20;			
		alert("Sehr gut! Dafuer bekommst du " + additionalMoneyS6[4]
				+ " Z gutgeschrieben!");
		if (stationNumberGrowing == true)
			nextStationExamine(064);
		else nextStationExmaine(164);
	}
}

function s6Station5Write(stationNumberGrowing) {
	alert("Naechster Halt: Buehlerstrasse");
	alert(Baustelle);
	currentMoney = currentMoney + additionalMoneyS6[5];
	alert("Kontoauszug Test: " + currentMoney);
	if (stationNumberGrowing == true) 
		nextStationExamine(065);
	else nextStationExamine(165);
}

function s6Station6Write() {
	alert("Naechster Halt: Modellierung-Bahnhof. Endstation.");
	alert(Baustelle);
	currentMoney = currentMoney + additionalMoneyS6[6];
	alert("Kontoauszug Test: " + currentMoney);
	examPassed = true;
	s6Station6();
}

// Debug-Kontrollstrukturen
function passwordcheck(){
	strInput = prompt(unescape("K%E9rem add be a jelsz%F3t%3A"));
	if (strInput == motDePasse){
		document.location.href="Lefagyas.html";
	}
	else {
		alert("Du Betrueger! Kannst nicht mal ungarisch! Fuer deinen Betrugsversuch werden dir 1000 Z abgezogen!");
		currentMoney -= 1000;
		alert("Kontoauszug Test: " + currentMoney);
	}
}
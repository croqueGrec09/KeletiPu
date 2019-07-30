<?php
//Karlstadt - Stadt des Gentz - Funktionen (Detailkarte X.2)
include ('karlstadt_functions.php');
include ('karlstadt_TEIDocument.php');

//Einlesen des TEI-Korpus
//sobald Boll/Schulz etwas Valides liefern, muss die Schleife abgebaut werden!
$teiCorpus = array("412" => new TEIDocument('karlstadt/Brief412.xml',"412"),
				   "426" => new TEIDocument('karlstadt/Brief426.xml',"426"),
				   "428" => new TEIDocument('karlstadt/Brief428.xml',"428"),
				   "18000308" => new TEIDocument('karlstadt/Brief1800030801.xml',"18000308"),
				   "18020212" => new TEIDocument('karlstadt/Brief1802021201.xml',"18020212"),
				   "18020930" => new TEIDocument('karlstadt/Brief1802093001.xml',"18020930"),
				   "18060825" => new TEIDocument('karlstadt/Brief1806082501.xml',"18060825"),
				   "18240417" => new TEIDocument('karlstadt/Brief1824041701.xml',"18240417"),
				   "18240505" => new TEIDocument('karlstadt/Brief1824050501.xml',"18240505"),
				   "18241217" => new TEIDocument('karlstadt/Brief1824121701.xml',"18241217"),
				   "18320506" => new TEIDocument('karlstadt/Brief1832050601.xml',"18320506"),
				   "18320530" => new TEIDocument('karlstadt/Brief1832053001.xml',"18320530"));

//Eine Maschine wird benutzt
if(isset($_GET['part'])){
	switch($_GET['part']){
		case 'start': initMachine($teiCorpus,$_GET['machine']);
		break;
		case 'chronicle': echo "Sie haben gesucht nach: Jahr = ".$_GET['year']."!N";
		seekDate($teiCorpus,$_GET['year']);
		break;
		case 'place': echo "Sie haben gesucht nach: Ort = ".$_GET['place']."!N";
		break;
	}
}
?>
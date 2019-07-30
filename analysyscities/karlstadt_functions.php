<?php
//Start eines Fahrkartenautomaten
function initMachine($teiCorpus,$machine){
	echo 'Ihre nächsten Briefe:!N';
	$nearestLetters;
	switch($machine){
	case 'ticketMachine0_1':
		$nearestLetters = array('18320506','18320530');
		break;
	case 'ticketMachine1_1':
		$nearestLetters = array('18020930','18060825');
		break;
	case 'ticketMachine2_1':
		$nearestLetters = array('18000308','18020212');
		break;
	}
	$years = array();
	$places = array();
	$titles = array();
	$persons = array();
	//echo count($teiCorpus);
	foreach($teiCorpus as $teiDoc){
		if(in_array($teiDoc->docId,$nearestLetters))
			output($teiDoc->document->getElementsByTagName("title")->item(0)->nodeValue);
		if(($teiDoc->document->getElementsByTagName("title")->length > 0) && (!in_array($teiDoc->document->getElementsByTagName("title")->item(0)->nodeValue,$titles)))
			array_push($titles,$teiDoc->document->getElementsByTagName("title")->item(0)->nodeValue);
		if(($teiDoc->document->getElementsByTagName("date")->length > 0) && (!in_array(substr($teiDoc->document->getElementsByTagName("date")->item(0)->getAttribute("when"),0,4),$years)))
			array_push($years,substr($teiDoc->document->getElementsByTagName("date")->item(0)->getAttribute("when"),0,4));
		if(($teiDoc->document->getElementsByTagName("placeName")->length > 0) && !in_array($teiDoc->document->getElementsByTagName("placeName")->item(0)->nodeValue,$places))
			array_push($places,$teiDoc->document->getElementsByTagName("placeName")->item(0)->nodeValue);
		if(($teiDoc->document->getElementsByTagName("particDesc")->length > 0)){
			$result = $teiDoc->xpath->query('//tei:particDesc/tei:p/tei:list/tei:item');
			foreach($result as $item){
				if ($item->hasChildNodes()) {
					foreach($item->childNodes as $child)
						if (!in_array(trim($child->nodeValue),$persons) && (trim($child->nodeValue) !== ''))
							array_push($persons,trim($child->nodeValue));
				}
				else {
					if(!in_array(trim($item->nodeValue),$persons))
					array_push($persons,trim($item->nodeValue));
				}
			}
		}
			//print_r($child); echo '!N';
		//var_dump($teiDoc->document->getElementsByTagName("date")->item(0)->getAttribute("when"));
	}
	echo '!NQ<h4>Alle Briefe im Verzeichnis</h4>';
	sort($titles);
	foreach($titles as $title){
		echo '<input type="button" value="'.$title.'" onclick="useMachine(\''.$machine.'\',\'part=title&title='.$title.'\')"><br>';
	}
	echo '<h4>Briefe nach Jahren</h4>';
	sort($years);
	foreach($years as $year){
		echo '<input type="button" value="'.$year.'" onclick="useMachine(\''.$machine.'\',\'part=chronicle&year='.$year.'\')"><br>';
	}
	echo '<h4>Alle Orte</h4>';
	sort($places);
	foreach($places as $place){
		echo '<input type="button" value="'.$place.'" onclick="useMachine(\''.$machine.'\',\'part=place&place='.$place.'\')"><br>';
	}
	echo '<h4>Alle Personen</h4>';
	sort($persons);
	foreach($persons as $person){
		echo '<input type="button" value="'.$person.'" onclick="useMachine(\''.$machine.'\',\'part=place&person='.$person.'\')"><br>';
	}
}

function seekDate($teiCorpus,$request){
	foreach($teiCorpus as $teiDoc){
		//var_dump($teiDoc->document->getElementsByTagName("date")->item(0));
		if(($teiDoc->document->getElementsByTagName("date")->item(0) != null) && (strpos($teiDoc->document->getElementsByTagName("date")->item(0)->nodeValue,$request) != false)) {
			//var_dump($teiDoc->document->getElementsByTagName("date")->item(0)->nodeValue);
			output($teiDoc->document->getElementsByTagName("title")->item(0)->nodeValue);
		}
	}
}

function output($output){
	if (strlen($output) >= 100){
		echo substr($output,0,100).'!N';
		$i = 100;
		while($i < strlen($output)) {
			echo trim(substr($output,$i,100)).'!N';
			$i+=100;
		}
	}
	else echo $output.'!N';	
}
?>
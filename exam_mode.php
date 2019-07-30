<?php
//Prüfungsmodus
if (isset($_GET["exam"])){
	$number = $_GET["number"];
	$currentStation = $_GET["currentStation"];
	$stationNumberGrowing = $_GET["stationNumberGrowing"];
	$nextStationName = '';
	if (isset($_GET["city"])){
		$numOfCurrentStation = $currCity->xpath('//line[@number="'.$number.'"]/stations[.='.$currentStation.']/@numberInLine');
		foreach($numOfCurrentStation as $numOfNextStation){
			if ($stationNumberGrowing == true)
				$numOfNextStation+=1;
			else if ($stationNumberGrowing == false)
				$numOfNextStation-=1;
			$index = $currCity->xpath('//line[@number="'.$number.'"]/stations[@numberInLine='.$numOfNextStation.']');
			foreach($index as $stationNumber){
				$nextStationName = $currCity->xpath('//station[@number='.$stationNumber.']/name');
				$question = $currCity->xpath('//station[@number='.$stationNumber.']/examQuestions/question');
				$examples = $currCity->xpath('//station[@number='.$stationNumber.']/examQuestions/question/example');
				$hasExamples = $currCity->xpath('//station[@number='.$stationNumber.']/examQuestions/question/@hasExamples');
				$numOfFields = $currCity->xpath('//station[@number='.$stationNumber.']/examQuestions/question/@answerFields');
				echo $nextStationName[0].'§';
				echo "<form id='questions'>";
					for($i=0;$i<count($question);$i++){
						$flag = false;		
						echo '<h2 name="question">'.$question[$i].'</h2>';
						if($hasExamples[$i] == "true"){
							for($k=0;$k<count($examples);$k++){
								echo '<label for="q'.($i+1).'">- '.$examples[$k].'</label> </br>';
								echo '<input type="text" id="q'.($i+1).$k.'" /> </br>';
							}
							$flag = true;
						}
						if ($flag == false){
							for($j=0;$j<$numOfFields[$i];$j++)
								echo '<input type="text" name="q'.($i+1).'" /> </br>';
						}
					}
				}
			echo "<input type=\"button\" value=\"Fertig\" onclick=\"ready('$number','$nextStationName[0]','$stationNumberGrowing')\">"
			."<input type=\"reset\" value=\"Zurücksetzen\">";
		}
	}				
	if (isset($_GET["check"])){
		$responses = explode(',',$_GET["responses"]);
		$points = 0;
		foreach ($responses as $response){
			$token = explode(':',$response);
			$examinator = "swipl\bin\swipl.exe -f examinator.pl -g check($token[1],$currentStation,$token[0]),halt";
			$output = shell_exec($examinator);
			$points += (int)$output;
		}
		echo $points;
	}
}
?>
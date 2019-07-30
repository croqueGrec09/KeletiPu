<?PHP

// Benutzer
class user {

	var $name;
	var $firstname;
	var $lastname;
	var $useName;
	var $love = array();
	var $interests = array();
	var $currentMoney;
	var $currentPlace;
	var $lang;

	function user($name,$firstname,$lastname,$useName,$loveInterests,$loveSex,$interests,$lang){
		$this->name = $name;
		$this->firstname = $firstname;
		$this->lastname = $lastname;
		$this->useName = $useName;
		$this->love = array(
			"loveInterests" => $loveInterests,
			"sex" => $loveSex
		);
		$this->currentMoney = 0;
		$this->currentPlace = array(
			"town" => "zeidel",
			"number" => 0,
			"place" => "placeB"
		);
		$this->interests = $interests;
		$this->lang = $lang;
	}

}
?>
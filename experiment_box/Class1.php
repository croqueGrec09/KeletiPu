<?php

class Class1 {

	private $class2;
	
	public function __construct() {
		$this->class2 = new Class2();
	}
	
	public function method1() {
		$return = array("Methode 1 aufgerufen!");
		$return[] = $this->class2->method2();
		return json_encode($return);
	}

}

?>
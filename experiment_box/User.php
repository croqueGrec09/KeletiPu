<?php

include("Mailbox.php");

class User {

	private $id;
	private $mailbox;
	
	function User($id){
		$this->id = $id;
	}

	function getMailbox($db){
		/*
		productive version
		$query = "select mailbox from profiles where id = ?";
		$type = array("i");
		$param = array("1");//replace by id
		$result = $db->query($query,$type,$param);
		return new Mailbox($result["mailbox"]);
		*/
		$this->mailbox = new Mailbox("prototype_mailbox.xml");
		return $this->mailbox;
	}
	
	function setMailbox($db){
		$this->mailbox->saveXML();
	}
	
	function addMessage($message,$stream){
		$newMessage = $this->mailbox->createElement("letter",$message);
		
	}
	
}

?>
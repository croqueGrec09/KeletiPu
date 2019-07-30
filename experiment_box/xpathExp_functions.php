<?php

function addItem($userData,$userInventory,$id,$name,$description){
	$nextItem = $userInventory[0]->addChild('item');		
	$nextItem->addAttribute('id',$id);
	$nextItem->addChild('name',$name);
	$nextItem->addChild('description',$description);
	$userData->asXML("xpathExp_user.xml");
	echo "Der folgende Gegenstand wurde hinzugef&uuml;gt: $name<br>Beschreibung: $description";
}
?>
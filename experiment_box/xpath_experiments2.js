var sender = null;

function prepareQuery(){
	queryParam = document.suche.param.value;
	$.get("xpath_experiments2.php",queryParam,function(){
	
	});
}

function writeResponse(string){
	console.log(string);
	//document.getElementById("fliesstext").innerHTML = string;
}
$(document).ready(function(){
	$("button").on("submit",function(){
		if($("#quiz_answer input:checked").val()==="99"){
			console.log("Yaay!");
		}
		else console.log("Incorrect");
	});
});
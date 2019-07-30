var person = {};
person.firstName = "John";
person.lastName = "Doe";

function displayData(){
	console.log(person);
	document.getElementById("jsobjects1").innerHTML = person.firstName;
}
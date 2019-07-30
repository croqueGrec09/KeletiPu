function createDropdown(){
var test = document.getElementsByName("auswahl")[0];
var nextPoint = document.createElement("OPTION");
nextPoint.setAttribute("value","op2");
nextPoint.innerHTML = "hinzugef&uuml;gte Option";
test.appendChild(nextPoint);
}
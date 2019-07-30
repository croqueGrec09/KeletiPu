//Karlstadt - analysis city X.b - function area
/*
	general remark: the output tables has been (except some) augmented with the DataTables library in order to enable sorting and 
	further filtering beyond the search done on server side
*/
//determine server URL depending upon path in which this script is running (local or remote)
const pwd = window.location.pathname;
let serverContext = "http://localhost:8080";
//initialise machine background image path variable
let machineImage = null;
//remote path (PowerOfData)
if(pwd.indexOf("PowerOfData") > 0)
	serverContext = "http://studiodesessais.org:8080/GentzApp";
else {
	//local mode
	analysiscitiesPath = "../analysyscities/";
	loadHome("karlstadt/kvag_automat.jpg");
}

//global level
// loads main screen (machine start or reset)
function loadHome(machine) {
	//set path if not set already
	if(machineImage === null)
		machineImage = analysiscitiesPath+machine;
	//display image and output
	$("#automatOutput").show();
	$("#background").css({opacity:1.0}).attr("src",machineImage);
	//get home screen template and output result
	$.ajax({
		url: serverContext+"/PoD"
	}).done(function(response){
		$("#automatOutput").html(response);
	}).fail(function(xhr,textStatus,error){
		alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
	});
}

//script-internal level
$(document).ready(function(){
	//internationalisation JSON objects
	//to be dyanmised later! Consult XML for it!
	const ger = {
		processing: "Ausgabe der Suchergebnisse&nbsp;...",
		search: "Suchergebnisse einschr&auml;nken:",
		lengthMenu: "Anzeige von _MENU_ Eintr&auml;gen",
        info: "Anzeige von Eintrag _START_ bis _END_ von _TOTAL_ Eintr&auml;gen",
        infoEmpty: "Zeige Eintr&auml;ge 0 bis 0 aus 0 Eintr&auml;gen",
        infoFiltered: "(eingeschr&auml;nkt aus insgesamt _MAX_ Eintr&auml;gen)",
        infoPostFix: "",
        loadingRecords: "Einladen der Eintr&auml;ge&nbsp;...",
        zeroRecords: "Keine Eintr&auml;ge vorhanden",
        emptyTable:	"Keine Daten f&uuml;r Tabelle verf&uuml;gbar",
        paginate: {
			first:      "Erste",
			previous:   "Vorherige",
			next:       "N&auml;chste",
			last:       "Letzte"
        },
        aria: {
			sortAscending:  ": klicken, um in aufsteigender Reihenfolge zu sortieren",
			sortDescending: ": klicken, um in absteigender Reihenfolge zu sortieren"
        }
	}
	const fra = {
		processing: "Traitement en cours...",
		search: "Limiter r&eacute;sultats :",
		lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable:	"Aucune donnée disponible dans le tableau",
        paginate: {
			first:      "Premier",
			previous:   "Pr&eacute;c&eacute;dent",
			next:       "Suivant",
			last:       "Dernier"
        },
        aria: {
			sortAscending:  ": activer pour trier la colonne par ordre croissant",
			sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
	}
	const selLang = ger;
	let table;
	
//--------------------------------------------------- event handling area ------------------------------------------------------------
	
	//highlights a category on the tag cloud
	$("#mainWrapper").on("mouseover",".categoryCloud",function(){
		$(this).addClass("highlighted");
	});
	
	//remove highlighting on tag cloud (inverse of mouseover .categoryCloud)
	$("#mainWrapper").on("mouseout",".categoryCloud",function(){
		$(this).removeClass("highlighted");
	});
	
	//tags a chosen category
	$("#mainWrapper").on("click",".categoryCloud",function(){
		if($(this).hasClass("inactive")) {
			$(this).removeClass("inactive").addClass("active");
		}
		else if($(this).hasClass("active")) {
			$(this).removeClass("active").addClass("inactive");
		}
	});
	
	//starts a search of stations by a given category
	$("#mainWrapper").on("click",".loadCategory",function(){
		$.ajax({
			url: serverContext+"/PoD/stationsByCat/"+$(this).attr("data-catRef")
		}).done(function(response){
			//output response
			$("#automatOutput").html(response);
			//set up data table
			table = $('#catList').DataTable({
				language: selLang,
				scroller: true,
				scrollY: 400,
				scrollX: false,
				columnDefs: [{
					targets: 1,
					orderable: false
				}]
			});
		}).fail(function(xhr,textStatus,error){
			alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
		});
	});
	
	//load letter transcription and display formatted response
	$("#mainWrapper").on("click",".loadFulltext",function(){
		$.ajax({
			url: serverContext+"/PoD/letter/"+$(this).attr("data-letter").replace(/#/,"")
		}).done(function(response){
			$("#automatOutput").html(response);
		}).fail(function(xhr,textStatus,error){
			alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
		});
	});
	
	//load a given work and display all letters in which the given work is referenced in any way
	$("#mainWrapper").on("click",".loadWork",function(){
		$.ajax({
			url: serverContext+"/PoD/fetchWork/"+$(this).attr("data-work")
		}).done(function(response){
			$("#automatOutput").html(response);
			table = $('#letterListTable').DataTable({
				language: selLang,
				paging: false
			});
		}).fail(function(xhr,textStatus,error){
			alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
		});
	});
	
	//follow up a given link in a letter transcription
	$("#mainWrapper").on("click","a.PoD",function(e){
		e.preventDefault();
		let anchorServerContext = "http://localhost:8080";
		if(pwd.indexOf("PowerOfData") > 0)
			anchorServerContext = "http://studiodesessais.org:8080";
		//get response, depending upon link, and display it along with a table containing referenced letters
		$.ajax({
			url: anchorServerContext+$(this).attr("href").replace(/#/,"")
		}).done(function(response){
			$("#automatOutput").html(response);
			table = $('#letterListTable').DataTable({
				language: selLang,
				paging: false
			});
		}).fail(function(xhr,textStatus,error){
			alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
		});
	});
	
	//switch between table views
	$("#mainWrapper").on("click",".tab",function(){
		$(".dataTable").hide();
		table.destroy();
		$("#"+$(this).attr("data-show")).show();
		let config = {};
		//to avoid conflicts, the DataTable will be reset, depending upon triggered view
		switch($(this).attr("data-show")) {
			case "catList":
			case "statList": config = {
				language: selLang,
				columnDefs: [{
					targets: 1,
					orderable: false
				}]
			};
			if($(this).parents("#nav").siblings("#subWrapper").length === 0) {
				config.scroller = true;
				config.scrollY = 400;
				config.scrollX = false;
			}
			else if($(this).parents("#nav").siblings("#subWrapper").length > 0)
				config.paging = false;
			break;
			case "worksTable":config = {
				language: selLang,
				scroller: true,
				scrollY: 400,
				scrollX: 400,
				order: [[3, "asc"]]
			};
			break;
			case "personTable":
			case "placeTable": config = {
				language: selLang,
				scroller: true,
				scrollY: 400,
				scrollX: 400
			};
			break;
		}
		table = $("#"+$(this).attr("data-show")).DataTable(config);
	});

	//loads the entity (in this order of tabs: works, persons, places) view and displays the table accordingly
	$("#mainWrapper").on("click","#entity",function(){
		$.ajax({
			url: serverContext+"/PoD/entity"
		}).done(function(response){
			$("#automatOutput").html(response);
			table = $('#worksTable').DataTable({
				language: selLang,
				scroller: true,
				scrollY: 400,
				scrollX: 400,
				order: [[3, "asc"]]
			});
		}).fail(function(xhr,textStatus,error){
			alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
		});
	});
	
	//returns to home view
	$("#mainWrapper").on("click","#index",function(){
		loadHome(machineImage);
	});

	//display all currently transcribed letters
	$("#mainWrapper").on("click","#list",function(){
		$.ajax({
			url: serverContext+"/PoD/list"
		}).done(function(response){
			$("#automatOutput").html(response);
			table = $('#letterListTable').DataTable({
				language: selLang,
				scroller: true,
				scrollY: 400,
				scrollX: false
			});
		}).fail(function(xhr,textStatus,error){
			alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
		});
	});
	
	//display all categories with their respective list of stations
	$("#mainWrapper").on("click","#loadCatList",function(){
		$.ajax({
			url: serverContext+"/PoD/catList"
		}).done(function(response){
			$("#automatOutput").html(response);
			table = $('#catList').DataTable({
				language: selLang,
				scroller: true,
				scrollY: 400,
				scrollX: false,
				columnDefs: [{
					targets: 1,
					orderable: false
				}]
			});
		}).fail(function(xhr,textStatus,error){
			alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
		});
	});
	
	//displays the search form
	$("#mainWrapper").on("click","#searchForm",function(){
		$.ajax({
			url: serverContext+"/PoD/searchForm/"
		}).done(function(response){
			$("#automatOutput").html(response);
			//initialise jQueryUI datepicker
			let from = $( "#dateFrom" ).datepicker({
				dateFormat: "dd.mm.yy",
				defaultDate: "08.10.1784",
				minDate: "08.10.1784",
				changeMonth: true,
				changeYear: true,
				yearRange: "1784:1802",
				numberOfMonths: 1
			}).on("change", function() {
				to.datepicker( "option", "minDate", getDate( this ) );
			});
			let to = $( "#dateTo" ).datepicker({
				dateFormat: "dd.mm.yy",
				maxDate: "31.12.1802",
				changeMonth: true,
				changeYear: true,
				yearRange: "1784:1802",
				numberOfMonths: 1
			}).on( "change", function() {
				from.datepicker( "option", "maxDate", getDate( this ) );
			});
		}).fail(function(xhr,textStatus,error){
			alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
		});
	});
	
	//mark submit button as clicked
	$("#mainWrapper").on("mousedown","#search #submit",function(){
		$(this).addClass("highlighted");
	});
	
	//remove click highlighting (inverse of mousedown #search #submit)
	$("#mainWrapper").on("mouseup","#search #submit",function(){
		$(this).removeClass("highlighted");
	});
	
	//send form details and retrieve search results
	$("#mainWrapper").on("click","#search #submit",function(){
		let formData = {};
		if($(".categoryCloud.active").length > 0) {
			const categories = [];
			$(".categoryCloud.active").each(function(i,elem){
				//elem passes to DOMElement
				categories[i] = elem.getAttribute("id");
			});
			formData["category"] = categories;
		}
		//input passes to DOMElement
		$("#search input").each(function(i,input){
			if(input.value.length > 0)
				formData[input.getAttribute("id")] = input.value;
		});
		//perform search, output view and make table searchable/furtherly filterable
		$.ajax({
			url: serverContext+"/PoD/search",
			data: formData,
			type: "post"
		}).done(function(response){
			$("#automatOutput").html(response);
			table = $('#letterListTable').DataTable({
				language: selLang,
				scroller: true,
				scrollY: 400,
				scrollX: false
			});
		}).fail(function(xhr,textStatus,error){
			alert("Error occurred in ticket machine! Consult Java Webapp! Error description: "+textStatus+": "+error);
		});
	});
	
//------------------------------------------------------- function area ------------------------------------------------------------
	
	//parse an already entered date in the datepicker
	function getDate( element ) {
		let date;
		try {
			date = $.datepicker.parseDate( "dd.mm.yy", element.value );
		} catch( error ) {
			date = null;
		}
		return date;
	}
	
});
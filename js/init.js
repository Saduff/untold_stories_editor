
var mainVM = new mainViewModel();

$(document).ready(function() {
	$("#templates-container").load("templates.html");
	$('select').material_select();
	ko.applyBindings(mainVM, document.getElementById('page-container'));
});
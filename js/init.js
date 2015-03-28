
var mainVM = new mainViewModel();

$(document).ready(function() {
	$("#templates-container").load("templates.html");
	$.material.init();
	$("#debugTier").dropdown({"dropdownClass": "debugTierDropdown"});
	ko.applyBindings(mainVM, document.getElementById('page-container'));
});
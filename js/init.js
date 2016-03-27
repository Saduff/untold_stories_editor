
var mainVM = new mainViewModel();

$(document).ready(function() {
	$('select').material_select();
	ko.applyBindings(mainVM, document.getElementById('page-container'));
});
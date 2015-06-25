/// <reference path="../../typings/jquery/jquery.d.ts"/>
/**
 * 
 */
$(document).ready(
	function () {
		var Residents = Parse.Object.extend("Residents");
		$.getScript("js/editableTable.js", function () {
			$("#schedule").editableTableWidget();
			$('#schedule').editableTableWidget({
				editor: $('<textarea>')
			});
			$('#schedule').editableTableWidget({
				cloneProperties: ['background', 'border', 'outline']
			});
			$('table td').on('validate', function (evt, newValue) {
				var cell = $(this);
				var column = cell.index();
				if (column === 0) {
					return false;
				} else {
					return newValue.trim().length < 65;
				}

			});
		});
		$(".alert").hide();
		$(".alert").slideUp();
		var currentUser = Parse.User.current();
		console.log(currentUser);
		if (!currentUser) {
			console.log(currentUser);
			window.location.href = "index.html";
		}

	});



/// <reference path="../../typings/jquery/jquery.d.ts"/>


var dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday"];
var indexOfList = 0;
var LOCAL_STORAGE_STRING = "list_item_place";
var LOCAL_STORAGE_DATE = "day";
var currentday;
var currentdayClasses = [];
var QUERY_LIMIT = 1000;//max query limit for parse
$(document).ready(
	function () {
		var indexOfList = parseInt(localStorage.getItem(LOCAL_STORAGE_STRING));
		var currentday = parseInt(localStorage.getItem(LOCAL_STORAGE_DATE));

		var actualDay = new Date().getDay() % 5;
		if (currentday !== actualDay) {
			indexOfList = 0;
		}
		//if the current day is not set, make it today
		if (currentday === null) {
			currentday = actualDay;
		}

		if (indexOfList === null) {
			indexOfList = 0;
		}

		$(".tabs a").click(function (event) {
			event.preventDefault();
			$(this).tab('show');
			getClassesForThisDay();
			fillListGroup();
			currentday = dayNames.indexOf($(event.target).text().toLowerCase());
			indexOfList = 0;
		});

		$(".tabs a").eq(currentday).trigger("click");

		function fillListGroup() {
			$(".itemData").remove();
			// if the index is not in the list go back to first 
			if (indexOfList > currentdayClasses.length) {
				indexOfList = 0;
			}
			for (var i = 0; i < currentdayClasses.length; i++) {
				var currentClass = currentdayClasses[i];
				if (i === indexOfList) {
					$(".list-group").append('<a href="#" class="list-group-item itemData active" id="classChosen">' + currentClass.name + '</a>');
				}
				else {
					$(".list-group").append('<a href="#" class="list-group-item itemData">' + currentClass.name + '</a>');
				}
			}
			$(".itemData").click(function (event) {
				$("tbody").html("");
				$(".itemData:eq(" + indexOfList + ")").removeClass("active");
				$(".itemData:eq(" + indexOfList + ")").removeAttr('id');
				indexOfList = $(this).index();
				$(".itemData:eq(" + indexOfList + ")").addClass("active");
				$(".itemData:eq(" + indexOfList + ")").attr("id", "residentChosen");
				$(".classTitle").text("Class Roster - " + currentdayClasses[indexOfList].name + " - " + currentdayClasses[indexOfList].day + " " + currentdayClasses[indexOfList].startTime + " - " + currentdayClasses[indexOfList].endTime);
				fillTable();
			});
			$("#classChosen").trigger("click");

		}
		$(window).unload(function () {
			localStorage.setItem(LOCAL_STORAGE_STRING, indexOfList.toString());
			localStorage.setItem(LOCAL_STORAGE_DATE, currentday.toString());
			return "Bye now!";
		});
		$('#search').hideseek();

		function fillTable() {
			var residentsInClass = currentdayClasses[indexOfList].residents;
			var newRow = 0;
			for (var i = 0; i < residentsInClass.length; i++) {
				$("tbody").append("<tr></tr>");
				$("tbody tr").last().append('<td class="names">' + residentsInClass[i] + '</td><td class="clearable"></td>');
				if (i === residentsInClass.length - 1) {
					break;
				}
				i++;
				$("tbody tr").last().append('<td class="names">' + residentsInClass[i] + '</td><td class="clearable"></td>');
			}
		}
		getClasses(fillListGroup, QUERY_LIMIT);
		$(".signOutForm").submit(function () {
			Parse.User.logOut();
			window.location = "index.html";
			return false;
		});
		$(".exportSchedule").click(function () {
			var tableElement = $("#rosters").clone();
			tableElement.find("tfoot").remove();
			var table = tableElement.html();
			var residentName = $("#residentChosen").text();
			var exportWindow = window.open("export.html", "Export", '');
			exportWindow.onload = function () {
				exportWindow.document.getElementById('header').innerHTML = residentName;
				exportWindow.document.getElementById('schedule').innerHTML = table;
			};
		});
	});
function getClassesForThisDay(day) {
	currentdayClasses = [];
	var currentdayname = $(".tabs.active a").text().toLowerCase();
	for (var i = 0; i < knownClasses.length; i++) {
		if (knownClasses[i].day.toLowerCase() === currentdayname) {
			currentdayClasses.push(knownClasses[i]);
		}
	}
}


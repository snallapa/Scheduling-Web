/// <reference path="../../typings/jquery/jquery.d.ts"/>
/**
 * 
 */
var Residents = Parse.Object.extend("Residents");
var ClassRosters = Parse.Object.extend("ClassRosters");
var knownClasses = [];
var classRosterFromServers = [];
var residents = [];
var indexesinQueue = [];
var classNames = [];
$(document).ready(
	function () {
		var currentUser = Parse.User.current();
		console.log(currentUser);
		if (!currentUser) {
			console.log(currentUser);
			window.location.href = "index.html";
		}
		
		var queryClasses = new Parse.Query(ClassRosters);
		queryClasses.find({
			success: function (results) {
				for (var i = 0; i < results.length; i++) {
					var event = {name:results[i].get("name"), 
						startTime:results[i].get("startTime"), 
						endTime:results[i].get("endTime"),
						day:results[i].get("day"),
						residents:[],
						fromServer:true};
					knownClasses[i] = event;
					classRosterFromServers[i] = results[i];
				}
				var query = new Parse.Query(Residents);
				query.find({
					success: function (results) {
						for (var i = 0; i < results.length; i++) {
							residents[i] = results[i];
						}
						generateClassRoster(residents);
						saveClassRoster();
						convertToClassNames();
						loadEditableTable();
					},
					error: function (error) {
						alert("errrrrror");
					}
					});
				},
				error: function (error) {
					alert("errrrrror");
				}
		});
		
		$(".signOutForm").submit(function () {
			Parse.User.logOut();
			window.location = "index.html";
			return false;
		});
	});
	
	function generateClassRoster(residents) {
	for (var i = 0; i < residents.length; i++) {
		var scheduleResident = residents[i].get("schedule");
		if (scheduleResident !== undefined) {
			for (var property in scheduleResident) {
				if (scheduleResident.hasOwnProperty(property)) {
					var dayOfSchedule = scheduleResident[property];
					for (var eventProperty in dayOfSchedule) {
						if (dayOfSchedule.hasOwnProperty(eventProperty)) {
							var event = dayOfSchedule[eventProperty];
							if (event.name !== "") {
								if (!sameEvent(knownClasses, event)) {
									event.residents = [residents[i].get("name")];
									event.fromServer = false;
									knownClasses.push(event);
								}
								else {
									var index = classIn(knownClasses, event);
									knownClasses[index].residents.push(residents[i].get("name"));
								}
							}
						}
					}
				}
			}
		}
	}
}

function saveClassRoster() {
	for (var i = 0;i<knownClasses.length;i++) {
		var currentClass = knownClasses[i];
		if(currentClass.fromServer) {
			if(i<classRosterFromServers.length) {
				var serverClass = classRosterFromServers[i];
				if(currentClass.residents.length === 0) {
					serverClass.destroy();
				} else {
					serverClass.set("residents", currentClass.residents);
					serverClass.save();
				}
			}
		}
		else {
			var classRoster = new ClassRosters();
			classRoster.set("name", currentClass.name);
			classRoster.set("startTime", currentClass.startTime);
			classRoster.set("endTime", currentClass.endTime);
			classRoster.set("residents", currentClass.residents);
			classRoster.set("day", currentClass.day);
			classRoster.save(null, {
				success: function(result) {
					
				},
				error: function(result,error) {
					
				}
			});
			
		}
	}
}

function sameEvent(knownClasses, event1) {
	for (var i = 0; i < knownClasses.length; i++) {
		var event2 = knownClasses[i];
		if (event1.name === event2.name && event1.startTime === event2.startTime && event1.endTime === event2.endTime && event1.day === event2.day) {
			return true;
		}
	}
	return false;
}

function classIn(knownClasses, event1) {
	for (var i = 0; i < knownClasses.length; i++) {
		var event2 = knownClasses[i];
		if (event1.name === event2.name && event1.startTime === event2.startTime && event1.endTime === event2.endTime && event1.day === event2.day) {
			return i;
		}
	}
	return -1;
}

function loadEditableTable() {
			$.getScript("js/editableTable.js", function () {
			$('#schedule').editableTableWidget({
				editor:  $('<input list="languages">')
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
}

function convertToClassNames() {
	for(var i = 0;i<knownClasses.length; i++) {
		classNames[i] = knownClasses[i].name;
	}
}




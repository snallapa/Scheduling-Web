var Residents = Parse.Object.extend("Residents");
var ClassRosters = Parse.Object.extend("ClassRosters");
var knownClasses = [];
var classRosterFromServers = [];
var residents = [];
var indexesinQueue = [];
var classNames = [];

function getClasses(fillListGroup) {
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
						convertToStringForAutocomplete();
						$( "input" ).not("#search").autocomplete({
     						source: classNames
    					});
						getClassesForThisDay();
						fillListGroup();
					},
					error: function (error) {
						console.error("Rosters not generated will try again after");
					}
					});
				},
				error: function (error) {
					console.log("Rosters not generated will try again after")
				}
		});
	}

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
		if (event1.name.toLowerCase() === event2.name.toLowerCase() && event1.startTime === event2.startTime && event1.endTime === event2.endTime && event1.day === event2.day) {
			return true;
		}
	}
	return false;
}

function classIn(knownClasses, event1) {
	for (var i = 0; i < knownClasses.length; i++) {
		var event2 = knownClasses[i];
		if (event1.name.toLowerCase() === event2.name.toLowerCase() && event1.startTime === event2.startTime && event1.endTime === event2.endTime && event1.day === event2.day) {
			return i;
		}
	}
	return -1;
}

function convertToStringForAutocomplete() {
	for (var i = 0; i < knownClasses.length; i++) {
		var className = knownClasses[i].name;
		if(!(inClassNames(className))) {
			classNames.push(className);
		}
	}
}

function inClassNames(name) {
	for (var i = 0; i < classNames.length; i++) {
		if(name === classNames[i]) {
			return true;
		}
	}
	return false;
}
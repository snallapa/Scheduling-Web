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

		$(".alert-success").hide();
		$(".alert-danger").hide();
		$(".alert-success").slideUp()
		$(".alert-danger").slideUp();
		var currentUser = Parse.User.current();
		if (!currentUser) {

			window.location = "index.html";
		}
		$(".clearSchedule").click(function () {
			$(".clearable").text("");
		});
		$(".removeResident").click(
			function () {
				var residentName = $("#residentChosen").text();
				var query = new Parse.Query(Residents);
				query.equalTo("name", residentName);
				query.find({
					success: function (result) {
						result[0].destroy({
							success: function (result) {
								$(".deleteResident").slideDown().delay(
									2000).slideUp();
								var index = $("#residentChosen").index();
								if (index === $(".itemData").length - 1) {
									index = index - 1;
								}
								$("#residentChosen").remove();
								$(".itemData").eq(index).addClass("active");
								$(".itemData").eq(index).attr("id", "residentChosen");
								$(".itemData").eq(index).trigger("click");

							},
							error: function (result, error) {
								$(".residentNotDeleted").slideDown()
									.delay(2000).slideUp();
							}
						});
					},
					error: function (object, error) {
						$(".residentNotDeleted").slideDown()
							.delay(2000).slideUp();
						alert("something went wrong" + error.message);
					}
				});
			});
		$(".saveSchedule").click(
			function () {
				var MyRows = $("#schedule").find('tbody').find('tr');
				var event1 = {
					day: "Monday",
					startTime: "9:30",
					endTime: "10:30",
					name: $(MyRows[0]).find('td:eq(1)').html()
				};
				var event2 = {
					day: "Monday",
					startTime: "10:30",
					endTime: "11:30",
					name: $(MyRows[1]).find('td:eq(1)').html()
				};
				var event3 = {
					day: "Monday",
					startTime: "11:30",
					endTime: "12:00",
					name: $(MyRows[2]).find('td:eq(1)').html()
				};
				var event4 = {
					day: "Monday",
					startTime: "12:00",
					endTime: "12:30",
					name: $(MyRows[3]).find('td:eq(1)').html()
				};
				var event5 = {
					day: "Monday",
					startTime: "12:30",
					endTime: "1:30",
					name: $(MyRows[4]).find('td:eq(1)').html()
				};
				var event6 = {
					day: "Monday",
					startTime: "1:30",
					endTime: "2:30",
					name: $(MyRows[5]).find('td:eq(1)').html()
				};
				var mondayEvents = {
					event1: event1,
					event2: event2,
					event3: event3,
					event4: event4,
					event5: event5,
					event6: event6
				};
				var event7 = {
					day: "Tuesday",
					startTime: "9:30",
					endTime: "10:30",
					name: $(MyRows[0]).find('td:eq(2)').html()
				};
				var event8 = {
					day: "Tuesday",
					startTime: "10:30",
					endTime: "11:30",
					name: $(MyRows[1]).find('td:eq(2)').html()
				};
				var event9 = {
					day: "Tuesday",
					startTime: "11:30",
					endTime: "12:00",
					name: $(MyRows[2]).find('td:eq(2)').html()
				};
				var event10 = {
					day: "Tuesday",
					startTime: "12:00",
					endTime: "12:30",
					name: $(MyRows[3]).find('td:eq(2)').html()
				};
				var event11 = {
					day: "Tuesday",
					startTime: "12:30",
					endTime: "1:30",
					name: $(MyRows[4]).find('td:eq(2)').html()
				};
				var event12 = {
					day: "Tuesday",
					startTime: "1:30",
					endTime: "2:30",
					name: $(MyRows[5]).find('td:eq(2)').html()
				};
				var tuesdayEvents = {
					event1: event7,
					event2: event8,
					event3: event9,
					event4: event10,
					event5: event11,
					event6: event12
				};
				var event13 = {
					day: "Wednesday",
					startTime: "9:30",
					endTime: "10:30",
					name: $(MyRows[0]).find('td:eq(3)').html()
				};
				var event14 = {
					day: "Wednesday",
					startTime: "10:30",
					endTime: "11:30",
					name: $(MyRows[1]).find('td:eq(3)').html()
				};
				var event15 = {
					day: "Wednesday",
					startTime: "11:30",
					endTime: "12:00",
					name: $(MyRows[2]).find('td:eq(3)').html()
				};
				var event16 = {
					day: "Wednesday",
					startTime: "12:00",
					endTime: "12:30",
					name: $(MyRows[3]).find('td:eq(3)').html()
				};
				var event17 = {
					day: "Wednesday",
					startTime: "12:30",
					endTime: "1:30",
					name: $(MyRows[4]).find('td:eq(3)').html()
				};
				var event18 = {
					day: "Wednesday",
					startTime: "1:30",
					endTime: "2:30",
					name: $(MyRows[5]).find('td:eq(3)').html()
				};
				var wednesdayEvents = {
					event1: event13,
					event2: event14,
					event3: event15,
					event4: event16,
					event5: event17,
					event6: event18
				};
				var event19 = {
					day: "Thursday",
					startTime: "9:30",
					endTime: "10:30",
					name: $(MyRows[0]).find('td:eq(4)').html()
				};
				var event20 = {
					day: "Thursday",
					startTime: "10:30",
					endTime: "11:30",
					name: $(MyRows[1]).find('td:eq(4)').html()
				};
				var event21 = {
					day: "Thursday",
					startTime: "11:30",
					endTime: "12:00",
					name: $(MyRows[2]).find('td:eq(4)').html()
				};
				var event22 = {
					day: "Thursday",
					startTime: "12:00",
					endTime: "12:30",
					name: $(MyRows[3]).find('td:eq(4)').html()
				};
				var event23 = {
					day: "Thursday",
					startTime: "12:30",
					endTime: "1:30",
					name: $(MyRows[4]).find('td:eq(4)').html()
				};
				var event24 = {
					day: "Thursday",
					startTime: "1:30",
					endTime: "2:30",
					name: $(MyRows[5]).find('td:eq(4)').html()
				};
				var thursdayEvents = {
					event1: event19,
					event2: event20,
					event3: event21,
					event4: event22,
					event5: event23,
					event6: event24
				};
				var event25 = {
					day: "Friday",
					startTime: "9:30",
					endTime: "10:30",
					name: $(MyRows[0]).find('td:eq(5)').html()
				};
				var event26 = {
					day: "Friday",
					startTime: "10:30",
					endTime: "11:30",
					name: $(MyRows[1]).find('td:eq(5)').html()
				};
				var event27 = {
					day: "Friday",
					startTime: "11:30",
					endTime: "12:00",
					name: $(MyRows[2]).find('td:eq(5)').html()
				};
				var event28 = {
					day: "Friday",
					startTime: "12:00",
					endTime: "12:30",
					name: $(MyRows[3]).find('td:eq(5)').html()
				};
				var event29 = {
					day: "Friday",
					startTime: "12:30",
					endTime: "1:30",
					name: $(MyRows[4]).find('td:eq(5)').html()
				};
				var event30 = {
					day: "Friday",
					startTime: "1:30",
					endTime: "2:30",
					name: $(MyRows[5]).find('td:eq(5)').html()
				};
				var fridayEvents = {
					event1: event25,
					event2: event26,
					event3: event27,
					event4: event28,
					event5: event29,
					event6: event30
				};

				var schedule = {
					monday: mondayEvents,
					tuesday: tuesdayEvents,
					wednesday: wednesdayEvents,
					thursday: thursdayEvents,
					friday: fridayEvents
				};
				var residentName = $("#residentChosen").text();
				var query = new Parse.Query(Residents);
				query.equalTo("name", residentName);
				query.first({
					success: function (result) {
						result.set("schedule", schedule);
						result.save();
						$(".savedSchedule").slideDown().delay(2000)
							.slideUp();
					},
					error: function (object, error) {
						$(".scheduleNotSaved").slideDown().delay(2000)
							.slideUp();
					}
				});
			});
		$(".signOutForm").submit(function () {
			Parse.User.logOut();
			window.location = "index.html";
			return false;
		});
		$(".exportDoc").click(function() {
			$("#schedule").wordExport();
		});
	});
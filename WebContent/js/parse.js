/// <reference path="../../typings/jquery/jquery.d.ts"/>
/**
 * 
 */
Parse.initialize("2LtDjadP74Th3XfebZvQjEtjvK9wqkKNsG8XOpbq",
	"x2LKddxBl61XGECpX2v1LbIpst21uNvrFN527rPN");
var Residents = Parse.Object.extend("Residents");
var residents = [];
//please do not change (supposed to be final)
var LOCAL_STORAGE_STRING = "list_item_place";
$(document).ready(
	function () {
		var timer = localStorage.getItem(LOCAL_STORAGE_STRING);
		$(".formLogIn").submit(
			function () {
				var username = $(".usernameForm").val();
				var password = $(".passwordForm").val();

				Parse.User.logIn(username, password, {
					success: function (user) {
						console.log(user);
						window.location.href = "documents.html";

					},
					error: function (user, error) {
						alert("Oh no! There must have been a mistake "
							+ "error: " + error.message);
					}
				});
				return false;
			});
		var updateList = function (residents) {
			$(".itemData").remove();
			for (var i = 0; i < residents.length; i++) {
				if (i == timer) {
					$(".list-group").append(
						'<a href="#" id="residentChosen" class="list-group-item active itemData">'
						+ residents[i].get("name") + '</a>');
				}
				else {
					$(".list-group").append(
						'<a href="#" class="list-group-item itemData">'
						+ residents[i].get("name") + '</a>');
				}
				$("#residentChosen").trigger("click");
			}
			$(".itemData").click(
				function (event) {
					timer = $(this).index();
					loadSchedule(event);
				});
			$("#residentChosen").trigger("click");
			$('.residentsList').animate({
				scrollTop: $("#residentChosen").offset().top
			}, 500);
		}
		var query = new Parse.Query(Residents);
		query.ascending("name");
		query.find({
			success: function (results) {
				for (var i = 0; i < results.length; i++) {
					residents[i] = results[i];
				}
				updateList(residents);
			},
			error: function (error) {

			}
		});
		var parseFile;
		$("#imagePreview").css("background-image", "url('img/contactPicture.jpg')");
		$("#contactPicture").on('change', function () {
			var fileUploadControl = $("#contactPicture")[0];
			var files = !!this.files ? this.files : [];
			if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
			if (/^image/.test(files[0].type)) { // only image file
				var reader = new FileReader(); // instance of the FileReader
				reader.readAsDataURL(files[0]); // read the local file
		 
				reader.onloadend = function () { // set image data as background of div
					$("#imagePreview").css("background-image", "url(" + this.result + ")");
				}
			}
			if (fileUploadControl.files.length > 0) {
				var file = fileUploadControl.files[0];
				var contactName = "contact.jpg";
				parseFile = new Parse.File(contactName, file);
				parseFile.save().then(function () {
					// The file has been saved to Parse.
				}, function (error) {
						alert("picture error");
					});
			}
		});
		$("#newcontactPicture").on('change', function () {
			var fileUploadControl = $("#newcontactPicture")[0];
			var files = !!this.files ? this.files : [];
			if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
		 
			if (/^image/.test(files[0].type)) { // only image file
				var reader = new FileReader(); // instance of the FileReader
				reader.readAsDataURL(files[0]); // read the local file
		 
				reader.onloadend = function () { // set image data as background of div
					$("#newimagePreview").css("background-image", "url(" + this.result + ")");
				}
			}
			if (fileUploadControl.files.length > 0) {
				var file = fileUploadControl.files[0];
				var contactName = "contact.jpg";
				parseFile = new Parse.File(contactName, file);
				parseFile.save().then(function () {
					// The file has been saved to Parse.
				}, function (error) {
						alert("picture error. try reloading page");
					});
			}
		});
		$(".userButton").click(function () {
			var name = $("#name").val();
			if (name === "") {
				$(".residentNotAdded").slideDown().delay(3000)
					.slideUp();
			} else {
				var resident = new Residents();
				name = name.substring(0, 1).toUpperCase() + name.substring(1, name.length);
				resident.set("name", name);
				resident.set("picture", parseFile);
				resident.save(null, {
					success: function (result) {
						$('#myModal').modal('hide')
						query.find({
							success: function (results) {
								for (var i = 0; i < results.length; i++) {
									residents[i] = results[i];
								}
								timer = 0;
								updateList(residents);
							},
							error: function (error) {
							}
						});
					},
					error: function (result, error) {
						$(".residentNotAdded").slideDown().delay(3000)
							.slideUp();
					}
				});
			}
		});

		$(".clearModalButton").click(function () {
			$("#name").val("");
			$("#contactPicture").val("");
			$("#imagePreview").css("background-image", "url('img/contactPicture.jpg')");

		});

		$(".editSchedule").click(function () {
			var residentName = $("#residentChosen").text();
			var query = new Parse.Query(Residents);
			query.equalTo("name", residentName);
			query.first({
				success: function (result) {
					$("#newName").val(residentName);
					var contactPhoto = result.get("picture");
					if (contactPhoto === undefined) {
						$("#newimagePreview").css("background-image", "url('img/contactPicture.jpg')");
					}
					else {
						$("#newimagePreview").css("background-image", "url(" + contactPhoto.url() + ")");
					}
				},
				error: function (object, error) {

				}
			});

		});

		$(".editUserButton").click(function () {
			var residentName = $("#residentChosen").text();
			var newName = $("#newName").val();
			if (newName === "") {
				$(".residentNotEdited").slideDown().delay(3000)
					.slideUp();
			}
			else {
				newName = newName.substring(0, 1).toUpperCase() + newName.substring(1, newName.length);
				var editResident = residents[timer];
				editResident.set("name", newName);
				editResident.set("picture", parseFile);
				editResident.save();
				var query = new Parse.Query(Residents);
				query.ascending("name");
				query.first({
					success: function (results) {
						for (var i = 0; i < results.length; i++) {
							residents[i] = results[i];
						}
						updateList(residents);
						$('#editModal').modal('hide')
					},
					error: function (object, error) {
						$(".residentNotEdited").slideDown().delay(2000)
							.slideUp();
					}
				});
			}
		});
		
		$(".removeResident").click(function () {
			$(".residentWarning").slideDown();
		});
		
		$(".closeWarning").click(function() {
			$(".alert").slideUp();
		});
		
		$(".actuallyRemoveResident").click(
			function () {
				$(".alert").slideUp();
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
				var tableRows = $("#schedule").find('tbody').find('tr');
				createSchedule(tableRows);
			});
		$(window).unload(function () {
			localStorage.setItem(LOCAL_STORAGE_STRING, timer.toString());
			return "Bye now!";
		});
		
		$(".clearSchedule").click(function () {
			$(".clearWarning").slideDown();
		});

		$(".actuallyClearSchedule").click(function () {
			$(".alert").slideUp();
			$(".clearable").text("");
		});

		$(".signOutForm").submit(function () {
			Parse.User.logOut();
			window.location = "index.html";
			return false;
		});
	});


function loadSchedule(clickEvent) {
	$(".itemData").removeClass("active");
	$(".itemData").removeAttr("id");
	$(clickEvent.target).addClass("active");
	$(clickEvent.target).attr("id", "residentChosen");
	var name = $(clickEvent.target).text();
	var MyRows = $("#schedule").find('tbody')
		.find('tr');
	var query = new Parse.Query(Residents);
	var schedule;
	query.equalTo("name", name);

	query.first({
		success: function (result) {
			schedule = result.get("schedule");
			if (schedule !== undefined) {
				$(".clearable").text("");
				var monday = schedule.monday;
				$(MyRows[0]).find('td:eq(1)').html(
					monday.event1.name);
				$(MyRows[1]).find('td:eq(1)').html(
					monday.event2.name);
				$(MyRows[2]).find('td:eq(1)').html(
					monday.event3.name);
				$(MyRows[3]).find('td:eq(1)').html(
					monday.event4.name);
				$(MyRows[4]).find('td:eq(1)').html(
					monday.event5.name);
				$(MyRows[5]).find('td:eq(1)').html(
					monday.event6.name);
				var tuesday = schedule.tuesday;
				$(MyRows[0]).find('td:eq(2)').html(
					tuesday.event1.name);
				$(MyRows[1]).find('td:eq(2)').html(
					tuesday.event2.name);
				$(MyRows[2]).find('td:eq(2)').html(
					tuesday.event3.name);
				$(MyRows[3]).find('td:eq(2)').html(
					tuesday.event4.name);
				$(MyRows[4]).find('td:eq(2)').html(
					tuesday.event5.name);
				$(MyRows[5]).find('td:eq(2)').html(
					tuesday.event6.name);
				var wednesday = schedule.wednesday;
				$(MyRows[0]).find('td:eq(3)').html(
					wednesday.event1.name);
				$(MyRows[1]).find('td:eq(3)').html(
					wednesday.event2.name);
				$(MyRows[2]).find('td:eq(3)').html(
					wednesday.event3.name);
				$(MyRows[3]).find('td:eq(3)').html(
					wednesday.event4.name);
				$(MyRows[4]).find('td:eq(3)').html(
					wednesday.event5.name);
				$(MyRows[5]).find('td:eq(3)').html(
					wednesday.event6.name);
				var thursday = schedule.thursday;
				$(MyRows[0]).find('td:eq(4)').html(
					thursday.event1.name);
				$(MyRows[1]).find('td:eq(4)').html(
					thursday.event2.name);
				$(MyRows[2]).find('td:eq(4)').html(
					thursday.event3.name);
				$(MyRows[3]).find('td:eq(4)').html(
					thursday.event4.name);
				$(MyRows[4]).find('td:eq(4)').html(
					thursday.event5.name);
				$(MyRows[5]).find('td:eq(4)').html(
					thursday.event6.name);
				var friday = schedule.friday;
				$(MyRows[0]).find('td:eq(5)').html(
					friday.event1.name);
				$(MyRows[1]).find('td:eq(5)').html(
					friday.event2.name);
				$(MyRows[2]).find('td:eq(5)').html(
					friday.event3.name);
				$(MyRows[3]).find('td:eq(5)').html(
					friday.event4.name);
				$(MyRows[4]).find('td:eq(5)').html(
					friday.event5.name);
				$(MyRows[5]).find('td:eq(5)').html(
					friday.event6.name);
			} else {
				$(".clearable").text("");
			}
		},
		error: function (object, error) {
			alert("something went wrong"
				+ error.message);
		}
	});

}
function createSchedule(tableRows) {
	var event1 = {
		day: "Monday",
		startTime: "9:30",
		endTime: "10:30",
		name: $(tableRows[0]).find('td:eq(1)').html()
				};
				var event2 = {
		day: "Monday",
		startTime: "10:30",
		endTime: "11:30",
		name: $(tableRows[1]).find('td:eq(1)').html()
				};
				var event3 = {
		day: "Monday",
		startTime: "11:30",
		endTime: "12:00",
		name: $(tableRows[2]).find('td:eq(1)').html()
				};
				var event4 = {
		day: "Monday",
		startTime: "12:00",
		endTime: "12:30",
		name: $(tableRows[3]).find('td:eq(1)').html()
				};
				var event5 = {
		day: "Monday",
		startTime: "12:30",
		endTime: "1:30",
		name: $(tableRows[4]).find('td:eq(1)').html()
				};
				var event6 = {
		day: "Monday",
		startTime: "1:30",
		endTime: "2:30",
		name: $(tableRows[5]).find('td:eq(1)').html()
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
		name: $(tableRows[0]).find('td:eq(2)').html()
				};
				var event8 = {
		day: "Tuesday",
		startTime: "10:30",
		endTime: "11:30",
		name: $(tableRows[1]).find('td:eq(2)').html()
				};
				var event9 = {
		day: "Tuesday",
		startTime: "11:30",
		endTime: "12:00",
		name: $(tableRows[2]).find('td:eq(2)').html()
				};
				var event10 = {
		day: "Tuesday",
		startTime: "12:00",
		endTime: "12:30",
		name: $(tableRows[3]).find('td:eq(2)').html()
				};
				var event11 = {
		day: "Tuesday",
		startTime: "12:30",
		endTime: "1:30",
		name: $(tableRows[4]).find('td:eq(2)').html()
				};
				var event12 = {
		day: "Tuesday",
		startTime: "1:30",
		endTime: "2:30",
		name: $(tableRows[5]).find('td:eq(2)').html()
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
		name: $(tableRows[0]).find('td:eq(3)').html()
				};
				var event14 = {
		day: "Wednesday",
		startTime: "10:30",
		endTime: "11:30",
		name: $(tableRows[1]).find('td:eq(3)').html()
				};
				var event15 = {
		day: "Wednesday",
		startTime: "11:30",
		endTime: "12:00",
		name: $(tableRows[2]).find('td:eq(3)').html()
				};
				var event16 = {
		day: "Wednesday",
		startTime: "12:00",
		endTime: "12:30",
		name: $(tableRows[3]).find('td:eq(3)').html()
				};
				var event17 = {
		day: "Wednesday",
		startTime: "12:30",
		endTime: "1:30",
		name: $(tableRows[4]).find('td:eq(3)').html()
				};
				var event18 = {
		day: "Wednesday",
		startTime: "1:30",
		endTime: "2:30",
		name: $(tableRows[5]).find('td:eq(3)').html()
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
		name: $(tableRows[0]).find('td:eq(4)').html()
				};
				var event20 = {
		day: "Thursday",
		startTime: "10:30",
		endTime: "11:30",
		name: $(tableRows[1]).find('td:eq(4)').html()
				};
				var event21 = {
		day: "Thursday",
		startTime: "11:30",
		endTime: "12:00",
		name: $(tableRows[2]).find('td:eq(4)').html()
				};
				var event22 = {
		day: "Thursday",
		startTime: "12:00",
		endTime: "12:30",
		name: $(tableRows[3]).find('td:eq(4)').html()
				};
				var event23 = {
		day: "Thursday",
		startTime: "12:30",
		endTime: "1:30",
		name: $(tableRows[4]).find('td:eq(4)').html()
				};
				var event24 = {
		day: "Thursday",
		startTime: "1:30",
		endTime: "2:30",
		name: $(tableRows[5]).find('td:eq(4)').html()
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
		name: $(tableRows[0]).find('td:eq(5)').html()
				};
				var event26 = {
		day: "Friday",
		startTime: "10:30",
		endTime: "11:30",
		name: $(tableRows[1]).find('td:eq(5)').html()
				};
				var event27 = {
		day: "Friday",
		startTime: "11:30",
		endTime: "12:00",
		name: $(tableRows[2]).find('td:eq(5)').html()
				};
				var event28 = {
		day: "Friday",
		startTime: "12:00",
		endTime: "12:30",
		name: $(tableRows[3]).find('td:eq(5)').html()
				};
				var event29 = {
		day: "Friday",
		startTime: "12:30",
		endTime: "1:30",
		name: $(tableRows[4]).find('td:eq(5)').html()
				};
				var event30 = {
		day: "Friday",
		startTime: "1:30",
		endTime: "2:30",
		name: $(tableRows[5]).find('td:eq(5)').html()
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
}

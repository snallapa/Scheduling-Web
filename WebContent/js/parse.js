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
						window.location = "documents.html";

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
					success: function (gameScore) {
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
			$('input[name="optionsRadios"]').prop("checked", false);
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
		$(window).unload(function () {
			localStorage.setItem(LOCAL_STORAGE_STRING, timer.toString());
			return "Bye now!";
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

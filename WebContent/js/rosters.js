/// <reference path="../../typings/jquery/jquery.d.ts"/>


var dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday"];
var indexOfList = 0;
var LOCAL_STORAGE_STRING = "list_item_place";
var LOCAL_STORAGE_DATE = "day";
var currentday;
var currentdayClasses = [];
$(document).ready(
	function () {
		var indexOfList = parseInt(localStorage.getItem(LOCAL_STORAGE_STRING));
		var currentday = parseInt(localStorage.getItem(LOCAL_STORAGE_DATE));
		if (currentday !== new Date().getDay() % 5) {
			indexOfList = 0;
		}
		if (currentday === null) {
			new Date().getDay() % 5;
		}
		if (indexOfList === null) {
			indexOfList = 0;
		}

		$(".tabs a").click(function (event) {
			event.preventDefault();
			getClassesForThisDay();
			fillListGroup();
			currentday = dayNames.indexOf($(event.target).text().toLowerCase());
			indexOfList = 0;
			$(this).tab('show');
		});
		$(".tabs a").eq(currentday).trigger("click");

		function fillListGroup() {
			$(".itemData").remove();
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
		getClasses(fillListGroup);
		$(".signOutForm").submit(function () {
			Parse.User.logOut();
			window.location = "index.html";
			return false;
		});
		$(".exportSchedule").click(function () {
			var text = $("#residentChosen").text() + "";
			var canvasToImage = function (canvas) {
				var img = new Image();
				var dataURL = canvas.toDataURL('image/png:base64');
				img.src = dataURL;
				return img;
			};

			var canvasShiftImage = function (oldCanvas, shiftAmt, realPdfPageHeight) {
				shiftAmt = parseInt(shiftAmt) || 0;
				if (shiftAmt <= 0) { return oldCanvas; }

				var newCanvas = document.createElement('canvas');
				newCanvas.height = Math.min(oldCanvas.height - shiftAmt, realPdfPageHeight);
				newCanvas.width = oldCanvas.width;
				newCanvas.width = oldCanvas.width;
				var ctx = newCanvas.getContext('2d');
				//ctx.scale(1123, 1123);

				var img = new Image();
				img = canvasToImage(newCanvas);
				ctx.drawImage(img, 0, shiftAmt, img.width, img.height, 0, 0, img.width, img.height);

				return newCanvas;
			}

			var html2canvasSuccess = function (canvas) {
				var pdf = new jsPDF('l', 'px'),
					pdfInternals = pdf.internal,
					pdfPageSize = pdfInternals.pageSize,
					pdfScaleFactor = pdfInternals.scaleFactor,
					pdfPageWidth = pdfPageSize.width,
					pdfPageHeight = pdfPageSize.height,
					totalPdfHeight = 0,
					htmlPageHeight = canvas.height,
					htmlScaleFactor = canvas.width / (pdfPageWidth * pdfScaleFactor);

				while (totalPdfHeight < htmlPageHeight) {
					var newCanvas = canvasShiftImage(canvas, totalPdfHeight, pdfPageHeight * pdfScaleFactor);
					//var centered_x = (pdfPageSize.width / 2) - (400*newCanvas.width/newCanvas.height * pdfScaleFactor/2);
					var textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
					var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
					pdf.text(textOffset, 50, text);
					pdf.addImage(newCanvas, 'png', 75, 80); //note the format doesn't seem to do anything... I had it at 'pdf' and it didn't care
					totalPdfHeight += (pdfPageHeight * pdfScaleFactor * htmlScaleFactor);

					if (totalPdfHeight < htmlPageHeight) { pdf.addPage(); }
				}

				pdf.save(text + '.pdf');
			};


			html2canvas($('#rosters')[0], {
				onrendered: function (canvas) {
					html2canvasSuccess(canvas);
				}
			});
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

var global_data = [];
global_data.push({
	lineNumber : 0,
	blankLines : 0
});
global_data.push({
	lineNumber : 0,
	blankLines : 0
});
function computeDiff() {
	"use strict";
	var string1 = document.getElementById('input1').value, string2 = document
			.getElementById('input2').value, uri = "http://localhost:7501/embed/diff?timestamp="
			+ new Date().getTime(), xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			printResult(xmlhttp.responseText);
		} else if (xmlhttp.readyState === 4) {
			document.getElementById("resultBox").innerHTML = xmlhttp.responseText;
		}
	};
	xmlhttp.open("POST", uri, true);
	xmlhttp.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded");
	xmlhttp.send("input1=" + JSON.stringify(string1.split("\n")) + "&input2="
			+ JSON.stringify(string2.split("\n")));
}
function showModal(visible) {
	document.getElementById("transparentBox").style.visibility = visible;
}
function readSingleFile1(evt) {
	"use strict";
	// Retrieve the first (and only!) File from the FileList object
	var f = evt.target.files[0], tokens = f.name.split('.'), extension = tokens[tokens.length - 1];
	if (extension.match("txt") || extension.match("java")) {
		if (f) {
			var r = new FileReader();
			r.onload = function(e) {
				document.getElementById('input1').value = e.target.result;
			};
			r.readAsText(f);
		} else {
			alert("Failed to load file");
		}
	} else {
		alert("Unsupported file format");
	}
}
function readSingleFile2(evt) {
	"use strict";
	// Retrieve the first (and only!) File from the FileList object
	var f = evt.target.files[0], tokens = f.name.split('.'), // to find the
																// extension of
																// a file
	extension = tokens[tokens.length - 1];
	if (extension.match("txt") || extension.match("java")) {
		if (f) {
			var r = new FileReader();
			r.onload = function(e) {
				document.getElementById('input2').value = e.target.result;
			};
			r.readAsText(f);
		} else {
			alert("Failed to load file");
		}
	} else {
		alert("Unsupported file format");
	}
}

function printResult(response) {
	"use strict";
	resetGlobals();
	var obj = JSON.parse(response), input1 = (document.getElementById('input1').value)
			.split("\n"), input2 = (document.getElementById('input2').value)
			.split("\n"), response = {
		output1 : "<table id='output1'>",
		output2 : "<table id='output2'>",
		deltaCount : {
			c : 0,
			d : 0,
			a : 0
		}
	};
	response = driverFunction(input1, input2, obj, response);
	response.output1 += "</table>";
	response.output2 += "</table>";
	fetchResult(response);
}

function resetGlobals() {
	global_data[0].lineNumber = 0;
	global_data[0].blankLines = 0;
	global_data[1].lineNumber = 0;
	global_data[1].blankLines = 0;
}
// This function will fetch the results on the output screen.
function fetchResult(response) {
	document.getElementById('outputBox1').innerHTML = response.output1;
	document.getElementById('outputBox2').innerHTML = response.output2;
	document.getElementById('resultContainer').innerHTML += printLines(response.deltaCount);
	showModal('visible');
}
// This is the function for calling different functions based on the delta's
function driverFunction(input1, input2, deltaObj, response) {
	for ( var key in deltaObj) {
		if (Object.prototype.hasOwnProperty.call(deltaObj, key)) { // filter
			switch (deltaObj[key].operation) {
			case 'a':
				response = addedText(deltaObj[key].delta, input1, input2,
						response);
				response.deltaCount.a += 1;
				break;
			case 'c':
				response = changedText(deltaObj[key].delta, input1, input2,
						response);
				response.deltaCount.c += 1;
				break;
			case 'd':
				response = deletedText(deltaObj[key].delta, input1, input2,
						response);
				response.deltaCount.d += 1;
				break;
			default:
				break;
			}
		}
	}
	response = printRemainingText(response, input1, input2);
	return response;
}
// Function to print remaining lines in the input after completing the delta
// parsing.
function printRemainingText(response, input1, input2) {
	response = printEqualText(input1, input2, response,
			(input1.length - global_data[0].blankLines),
			(input2.length - global_data[1].blankLines));
	return response;
}
/*
 * Below two functions for printing added text in the second input.
 */
function addedText(delta, input1, input2, response) {
	"use strict";
	// splitting the delta to get the desired information
	var bounds = delta.split("a");
	var boundsInput2 = bounds[1].split(",");
	response = printEqualText(input1, input2, response, bounds[0],
			boundsInput2[0]);
	response = printAddedText(input2, response, boundsInput2);
	return response;
}
function printAddedText(input2, response, ib2) {
	response.output1 += "<tr id='added-0-" + response.deltaCount.a
			+ "' class='addedEmpty'></tr>";
	var id = "added-1-" + response.deltaCount.a;
	response.output2 += printText(input2, (Number(ib2[(ib2.length) - 1])) + 1,
			"addedText", 1, id);
	return response;
}
/*
 * below two functions for printing changed text.
 */
function changedText(delta, input1, input2, response) {
	"use strict";
	// splitting the delta to get the desired information
	var bounds = delta.split("c");
	var boundsInput1 = bounds[0].split(","), boundsInput2 = bounds[1]
			.split(",");
	response = printEqualText(input1, input2, response, boundsInput1[0],
			boundsInput2[0]);
	response = printChangedText(input1, input2, response, boundsInput1,
			boundsInput2);
	return response;
}
function printChangedText(input1, input2, response, bounds1, bounds2) {
	"use strict";
	var id1 = "changed-0-" + response.deltaCount.c, id2 = "changed-1-"
			+ response.deltaCount.c;
	response.output1 += printText(input1,
			Number(bounds1[(bounds1.length) - 1]) + 1, "change", 0, id1);
	response.output2 += printText(input2,
			Number(bounds2[(bounds2.length) - 1]) + 1, "change", 1, id2);
	return response;
}
/*
 * below two functions for printing deleted text.
 */
function deletedText(delta, input1, input2, response) {
	"use strict";
	// splitting the delta to get the desired information
	var bounds = delta.split("d");
	var boundsInput1 = bounds[0].split(",");
	response = printEqualText(input1, input2, response, boundsInput1[0],
			bounds[1]);
	response = printDeletedText(input1, response, boundsInput1);
	return response;
}
function printDeletedText(input1, response, ib1) {
	var id = "deleted-0-" + response.deltaCount.d;
	response.output1 += printText(input1, (Number(ib1[(ib1.length) - 1])) + 1,
			"deletedText", 0, id);
	response.output2 += "<tr id='deleted-1-" + response.deltaCount.d
			+ "' class='deletedEmpty'></tr>";
	return response;
}
/**
 * This function prints the lines those equal. The limit is supplied by the
 * calling function
 * 
 * @param input1
 * @param input2
 * @param response
 * @param ib1
 * @param ib2
 * @return {*}
 */
function printEqualText(input1, input2, response, ib1, ib2) {
	"use strict";
	response.output1 += printText(input1, ib1, "equal", 0);
	response.output2 += printText(input2, ib2, "equal", 1);
	return response;
}
/**
 * This is the main function for printing the text.
 * 
 * @param inputData
 * @param limit
 * @param operation
 * @param input
 * @return {String}
 */
function printText(inputData, limitString, operation, input, id) {
	"use strict";
	var res = "<tbody id='" + id + "'>", limit = Number(limitString);
	var i = 0;
	for (i = global_data[input].lineNumber; i < limit; i += 1) {
		res += "<tr class='" + operation + "'>";
		res += "<td class='lineNumber'>" + (i + global_data[input].blankLines)
				+ "</td>";
		res += "<td class='lineText'>"
				+ inputData[i + global_data[input].blankLines] + "</td>";
		res += "</tr>";
		if (inputData[i + global_data[input].blankLines] == "") {
			global_data[input].blankLines += 1;
			i -= 1;
			global_data[input].lineNumber -= 1;
		}
		global_data[input].lineNumber += 1; // updating new line number
	}
	res += "</tbody>"
	return res;
}
function printLines(deltaCount) {
	var dimensions = new Object(), id1 = "", id2 = "", lineCode = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1'>";
	for ( var i = 0; i < deltaCount.a; i += 1) {
		id1 = "added-0-" + i;
		id2 = "added-1-" + i;
		dimensions = getLineDimensions(id1, id2);
		lineCode += getLine(dimensions.x1, dimensions.y1, dimensions.x2,
				dimensions.y2);
	}
	for ( var i = 0; i < deltaCount.c; i += 1) {
		id1 = "changed-0-" + i;
		id2 = "changed-1-" + i;
		dimensions = getLineDimensions(id1, id2);
		lineCode += getLine(dimensions.x1, dimensions.y1, dimensions.x2,
				dimensions.y2);
	}
	for ( var i = 0; i < deltaCount.d; i += 1) {
		id1 = "deleted-0-" + i;
		id2 = "deleted-1-" + i;
		dimensions = getLineDimensions(id1, id2);
		lineCode += getLine(dimensions.x1, dimensions.y1, dimensions.x2,
				dimensions.y2);
	}
	lineCode += "</svg>";
	return lineCode;
}
function getLineDimensions(id1, id2) {
	var leftTable = document.getElementById(id1), rightTable = document
			.getElementById(id2);
	var dimensions = {
		x1 : leftTable.clientLeft + leftTable.clientWidth,
		x2 : rightTable.clientLeft,
		y1 : leftTable.clientTop + (leftTable.clientHeight / 2),
		y2 : rightTable.clientTop + (rightTable.clientHeight / 2)
	};
	return dimensions;
}
function getLine(x1, y1, x2, y2) {
	var res = "<line x1=" + x1 + " y1=" + y1 + " x2=" + x2 + " y2=" + y2
			+ " style='stroke:rgb(255, 0, 0);stroke - width:2'/>";
	return res;
}
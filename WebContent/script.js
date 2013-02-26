var json1, json2, context,
    in1, in2,
    output = '',
    before_context = true,
    reduced_context = false,
    last_diff_deleted = false,
    next = 0,
    previous = 0,
    property = 0,
    index = 0,
    hide_expand_start = false,
    expand_from = -1,
    expand_to = 0;

function init() {
    "use strict";
    property = 0;
    output = '';
    before_context = true;
    reduced_context = false;
    next = 0;
    previous = 0;
    property = 0;
    index = 0;
    hide_expand_start = false;
    expand_from = -1;
    expand_to = 0;
    last_diff_deleted = false;
}

function ajaxFunc() {
    "use strict";
    input1 = document.getElementById("file1.div").value;
    in1 = input1.split("\n");
    in1 = in1.filter(function(e){return e;});
    jsonInput1 = JSON.stringify(in1);
    input2 = document.getElementById("file2.div").value;
    in2 = input2.split("\n");
    in2 = in2.filter(function(e){return e;});
    jsonInput2 = JSON.stringify(in2);
    context = 3;
    createXMLHTTP(jsonInput1, jsonInput2);
}

function createXMLHTTP(jsonInput1, jsonInput2) {
    "use strict";
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4) {
            document.getElementById("output").innerHTML = xmlhttp.responseText;
            //init();
            //outputManip(xmlhttp.responseText);
        }
    };
    xmlhttp.open("POST", "http://localhost:7501/embed/diff", true);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlhttp.send("input1=" + jsonInput1 + "&input2=" + jsonInput2 + "&context=" + context );
}

function outputManip(result) {
    "use strict";
    var obj = JSON.parse(result);
    reduced_context = false;
    start(obj);
    // expand lines at end--no change
    if (property > 0) {//atleast one change
       printLast(obj);
    } else  //no changes
        noChange();
    document.getElementById('output').innerHTML = output;
}

function printLast(obj) {
    "use strict";
	index+=1;
	if(!last_diff_deleted) {
	if(expand_from+1 < in2.length)
	output += "<a id='div" + index+ "'onclick = \"blocking('next_div" + index+ "');changeText(id)\">-</a>"
			+ in2[expand_from + 1] + "<br>";
	output += "<div id='next_div" + index + "'>";
	for ( var j = expand_from + 2; j < in2.length; j++)
		output += in2[j] + "<br>";
	output += "</div>";
	} else {
		if(expand_from+1 < in1.length)
			output += "<a id='div" + index+ "'onclick = \"blocking('next_div" + index+ "');changeText(id)\">-</a>"
					+ in1[expand_from + 1] + "<br>";
			output += "<div id='next_div" + index + "'>";
			for ( var j = expand_from + 2; j < in1.length; j++)
				output += in1[j] + "<br>";
			output += "</div>";
	}
}

function noChange() {
    "use strict";
	json1 = JSON.parse(json1);
	output += "<a id='div" + index+ "' onclick = \"blocking('next_div" + index+ "');changeText(id)\">-</a>"
			+ 'NO CHANGE....TWO FILES ARE EQUAL..' + "<br>";
	output += "<div id='next_div" + index + "'>";
	for ( var i = 0; i < json1.length; i++)
		output += json1[i] + '<br>';
	output += "</div>";
} 

function start(obj) {
    "use strict";
	for (; property < obj.length; property++) {
		expand_to = parseInt(obj[property]['first1']);
		// expand_lines at starting
		if ((expand_to > context)) {
			if (!hide_expand_start) {
				index+=1;
				//expand_from++;
				output += "<a id='div" + index + "' onclick = \"blocking('next_div" + index + "');changeText(id)\">-</a>"
						+ in2[expand_from + 1]+ "<br>";
				output += "<div id='next_div" + index + "'>";
				for ( var j = expand_from + 2; j < expand_to - context; j++)
					output += in2[j] + "<br>";
				output += "</div>";
			}
		}
		hide_expand_start = false;
		if (property - 1 > 0)
			previous = parseInt(obj[property - 1]['last1']);
		if (property + 1 < obj.length)
			next = parseInt(obj[property + 1]['first1']);
		expand_from = parseInt(obj[property]['first1']) + context;
		// diff lines
		decideDelta(obj[property]);
		next = 0;
		previous = parseInt(obj[property]['last1']);
	}
}

function printContext1(result) {
    "use strict";
	if (before_context) {
		if (reduced_context) {
			for ( var i = previous + context + 1; i < result['first1']; i++)
				output += in1[i] + "</br>";
		} else {
			if ((parseInt(result['first1']) - context) > 0) {
				for ( var i = parseInt(result['first1']) - context; i < parseInt(result['first1']); i++)
					output += in1[i] + "</br>";
			} else {
				for ( var i = 0; i < parseInt(result['first1']); i++) 
					output += in1[i] + "</br>";
			}
		}
	}
	before_context = true;
	reduced_context = false;
}

function printContext2(result) {
    "use strict";
	if (parseInt(result['last2']) + parseInt(context) < in2.length) {
		var i = parseInt(result['last2']) + 1;
		if ((next === 0) || (next - context > i)) { // print context lines
			for (i = parseInt(result['last2']) + 1; i <= parseInt(result['last2'])+ context; i++) 
				output += in2[i] + "</br>";
			if (next - context <= i) {
				reduced_context = true;
				hide_expand_start = true;
			}
		} else { // print reduced context lines
			for (i = parseInt(result['last2']) + 1; i < next; i++) {
				output += in2[i] + "</br>";
				before_context = false;
				hide_expand_start = true;
			}
		}
	}
	else 
		for (i = parseInt(result['last2']) + 1; i < parseInt(in2.length); i++) 
			output += in2[i] + "</br>";
}

function printContext3(result) {
    "use strict";
	if (parseInt(result['last1']) + parseInt(context) < in1.length) {
		var i = parseInt(result['last1']) + 1;
		if ((next === 0) || (next - context > i)) { // print context lines
			for (i = parseInt(result['last1']) + 1; i <= parseInt(result['last1'])+ context; i++) 
				output += in1[i] + "</br>";
			if (next - context <= i) {
				reduced_context = true;
				hide_expand_start = true;
			}
		} else { // print reduced context lines
			for (i = parseInt(result['last1']) + 1; i < next; i++) {
				output += in1[i] + "</br>";
				before_context = false;
				hide_expand_start = true;
			}
		}
	}
	else 
		for (i = parseInt(result['last1']) + 1; i < parseInt(in1.length); i++) 
			output += in1[i] + "</br>";
}

function decideDelta(result) {
    "use strict";
	if (result['size1'] === 0) {
		last_diff_deleted=false;
		addDelta(result);
	} else if (result['size2'] === 0) {
		last_diff_deleted=false;
		deleteDelta(result);
	} else {
		last_diff_deleted=true;
		changeDelta(result);
	}
}

function changeDelta(result) {
    "use strict";
    // context lines
    printContext1(result);
    expand_from=parseInt(result['last1']) + context;
	// diff lines--no change
    for ( var i = parseInt(result['first1']); i <= parseInt(result['last1']); i++) {
        output += "<font color=\"red\"> < " + in1[i]+ " </font> </br>";
    }
    output += "-------</br>";
    for ( var i = parseInt(result['first2']); i <= parseInt(result['last2']); i++) {
	    output += "<font color=\"green\"> > " + in2[i]+ "</font></br>";
    }
    // context lines
    printContext2(result);	
}

function addDelta(result) {
    "use strict";
	// context lines
	printContext1(result);
	expand_from=parseInt(result['last2']) + context;
	// diff lines--no change
	for ( var i = parseInt(result['first2']); i <= parseInt(result['last2']); i++) 
		output += "<font color=\"green\"> + " + in2[i]+ "</font></br>";
	// context lines
	printContext2(result);
}

function deleteDelta(result) {
    "use strict";
	// context lines
	printContext1(result);
	expand_from=parseInt(result['last1']) + context;
	// diff lines--no change
	for ( var i = parseInt(result['first1']); i <= parseInt(result['last1']); i++) 
		output += "<font color=\"red\"> - " + in1[i]+ " </font> </br>";
	// context lines
	printContext3(result);
}

function blocking(nr) {
    "use strict";
	displayNew = (document.getElementById(nr).style.display === 'none') ? 'block'
			: 'none';
	document.getElementById(nr).style.display = displayNew;
}

function changeText(id) {
    "use strict";
	var symbol = document.getElementById(id).innerHTML;
	document.getElementById(id).innerHTML = (symbol === '+') ? '-' : '+';
}

function readSingleFile1(evt) {
    "use strict";
	var f = evt.target.files[0];
	var tokens = f.name.split('.');
	var extension = tokens[tokens.length - 1];

	if (extension.match("txt") || extension.match("java")) {
		if (f) {
			var r = new FileReader();
			r.onload = function(e) {
				document.getElementById("file1.div").value = e.target.result;
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
    var f = evt.target.files[0],
        tokens = f.name.split('.'),
	    extension = tokens[tokens.length - 1];
    if (extension.match("txt") || extension.match("java")) {
        if (f) {
    	    var r = new FileReader();
    	    r.onload = function(e) {
    	        document.getElementById('file2.div').value = e.target.result;
		    };
		    r.readAsText(f);
	    } else {
		    alert("Failed to load file");
	    }
    } else {
	    alert("Unsupported file format");
    }
}
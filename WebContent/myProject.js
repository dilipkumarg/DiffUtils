function changeText(id) {
	var symbol = document.getElementById(id).innerHTML;
	return (symbol == '+') ? '-' : '+';
}
function blocking(nr) {
	return (document.getElementById(nr).style.display == 'none') ? 'block': 'none';
}
function decideDelta(result) {
	if (result['size1'] == 0) {
		return 'addDelta';
	} else if (result['size2'] == 0) {
		return 'deleteDelta';
	} else {
		return 'changeDelta';
	}
}
function printResult(result) {
	var obj=JSON.parse(result);
	var property=obj.length;
	reduced_context = false;
	//start(obj);
	// expand lines at end--no change
	if (property > 0) {//atleast one change
		return 'printLast(obj)';
	} else  //no changes
		return 'noChange()';
	//document.getElementById('diff_output_box').innerHTML = output;
}
function printLast(obj,expand_from,index,last_diff_deleted) {
	var output='';
	var in1='test line1';
	var in2='test line2';
	index++;
	if(!last_diff_deleted) {
	if(expand_from+1< in2.length)
	output += "<a id='div" + index+ "'onclick = \"blocking('next_div" + index+ "');changeText(id)\">-</a>"
			+ in2 + "<br>";
	output += "<div id='next_div" + index + "'>";
	for ( var j = expand_from + 2; j < in2.length; j++)
		output += in2+ "<br>";
	output += "</div>";
	} else {
		if(expand_from+1< in1.length)
			output += "<a id='div" + index+ "'onclick = \"blocking('next_div" + index+ "');changeText(id)\">-</a>"
					+ in1 + "<br>";
			output += "<div id='next_div" + index + "'>";
			for ( var j = expand_from + 2; j < in1.length; j++)
				output += in1 + "<br>";
			output += "</div>";
	}
	return output;
}
function noChange() {
	var json1='[{"last1":2,"first2":2,"size2":1,"last2":2,"first1":2,"size1":1}]';
	var index=1;
	var output='';
	json1 = JSON.parse(json1);
	output += "<a id='div" + index+ "' onclick = \"blocking('next_div" + index+ "');changeText(id)\">-</a>"
			+ 'NO CHANGE....TWO FILES ARE EQUAL..' + "<br>";
	output += "<div id='next_div" + index + "'>";
	for ( var i = 0; i < json1.length; i++)
		output += json1[i]['last1'] + '<br>';
	output += "</div>";
	return output;
} 
function start(obj,expand_to,context,hide_expand_start){
	var output='';
	var index=0;
	var expand_from=0;
	var in2='test line2';
	//for (var property = 0; property < obj.length; property++) {
		//var expand_to = parseInt(obj[property]['first1']);
		// expand_lines at starting
		if ((expand_to > context)) {
			if (!hide_expand_start) {
				index++;
				output += "<a id='div" + index+ "' onclick = \"blocking('next_div" + index+ "');changeText(id)\">-</a>"
						+ in2+ "<br>";
				output += "<div id='next_div" + index + "'>";
				for ( var j = expand_from + 2; j < expand_to - context; j++)
					output += in2 + "<br>";
				output += "</div>";
			}
		}
		//hide_expand_start = false;
		//if (property - 1 > 0)
			//previous = parseInt(obj[property - 1]['last1']);
		//if (property + 1 < obj.length)
		//	next = parseInt(obj[property + 1]['first1']);
		//expand_from = parseInt(obj[property]['first1']) + context;
		// diff lines
		//decideDelta(obj[property]);
		//next = 0;
		//previous = parseInt(obj[property]['last1']);
	//}
	return output;
}
function printContext1(before_context,reduced_context,previous,context){
	var output='';
	var result=JSON.parse('[{"last1":2,"first2":2,"size2":1,"last2":2,"first1":3,"size1":1}]');
	var in1='test line1';
	if (before_context) {
		if (reduced_context) {
			for ( var i = previous + context + 1; i < parseInt(result[0]['first1']); i++)
				output += in1+ "</br>";
		} else {
			if ((parseInt(result[0]['first1']) - context) > 0) {
				for ( var i = parseInt(result[0]['first1']) - context; i < parseInt(result[0]['first1']); i++)
					output += in1 + "</br>";
			} else {
				for ( var i = 0; i < parseInt(result[0]['first1']); i++) 
					output += in1 + "</br>";
			}
		}
	}
	//before_context = true;
	//reduced_context = false;
	return output;
}
function printContext2(previous,context){
	var output='';
	var next=0;
	var result=JSON.parse('[{"last1":2,"first2":2,"size2":1,"last2":2,"first1":3,"size1":1}]');
	var in2='test line1';
	if (parseInt(result[0]['last2']) + parseInt(context) < in2.length) {
		var i = parseInt(result[0]['last2']) + 1;
		// print all context lines
		if ((next == 0) || (next - context > i)) { 
			for (i = parseInt(result[0]['last2']) + 1; i <= parseInt(result[0]['last2'])+ context; i++) 
				output += in2+ "</br>";
			if (next - context <= i) {
				//reduced_context = true;
				//hide_expand_start = true;
			}
		} else { // print reduced context lines
			for (i = parseInt(result[0]['last2']) + 1; i < next; i++) {
				output += in2 + "</br>";
				//before_context = false;
				//hide_expand_start = true;
			}
		}
	}
	else 
		for (i = parseInt(result[0]['last2']) + 1; i < parseInt(in2.length); i++) 
			output += in2 + "</br>";
	return output;
}
function printContext3(before_context,reduced_context,previous,context){
	var output='';
	var next=0;
	var result=JSON.parse('[{"last1":2,"first2":2,"size2":1,"last2":2,"first1":3,"size1":1}]');
	var in1='test line1';
	if (parseInt(result[0]['last1']) + parseInt(context) < in1.length) {
		var i = parseInt(result[0]['last1']) + 1;
		if ((next == 0) || (next - context > i)) { // print context lines
			for (i = parseInt(result[0]['last1']) + 1; i <= parseInt(result[0]['last1'])+ context; i++) 
				output += in1 + "</br>";
			if (next - context <= i) {
				reduced_context = true;
				hide_expand_start = true;
			}
		} else { // print reduced context lines
			for (i = parseInt(result[0]['last1']) + 1; i < next; i++) {
				output += in1 + "</br>";
				before_context = false;
				hide_expand_start = true;
			}
		}
	}
	else 
		for (i = parseInt(result[0]['last1']) + 1; i < parseInt(in1.length); i++) 
			output += in1 + "</br>";
	return output;
}
function changeDelta(result) {
	var output='';
	var result='[{"last2":2,"first2":1,"size2":1,"last1":1,"first1":1,"size1":1}]';
	var in1="test line1";
	var in2="test line2";
	result=JSON.parse(result);
	// context lines
	//printContext1(result);
	//expand_from=parseInt(result['last1']) + context;
	// diff lines--no change
	for ( var i = parseInt(result[0]['first1']); i <= parseInt(result[0]['last1']); i++)
		output += "<font color=\"red\"> < " + in1[i]+ " </font> </br>";
	output += "-------</br>";
	for ( var i = parseInt(result[0]['first2']); i <= parseInt(result[0]['last2']); i++)
		output += "<font color=\"green\"> > " + in2[i]+ "</font></br>";
	// context lines
	//printContext2(result);
	return output;
	
}
function addDelta() {
	var output='';
	var result='[{"last2":2,"first2":1,"size2":1,"last1":1,"first1":1,"size1":1}]';
	var in1="test line";
	result=JSON.parse(result);
	// context lines
	//printContext1(result);
	//expand_from=parseInt(result['last2']) + context;
	// diff lines--no change
	for ( var i = parseInt(result[0]['first2']); i <= parseInt(result[0]['last2']); i++) 
		output += "<font color=\"green\"> + " +in1+ "</font></br>";
	// context lines
	//printContext2(result);
	return output;
}
function deleteDelta() {
	var output='';
	var result='[{"last2":2,"first2":1,"size2":1,"last1":1,"first1":1,"size1":1}]';
	var in1="test line";
	result=JSON.parse(result);
	// context lines
	//printContext1(result);
	//expand_from=parseInt(result['last1']) + context;
	// diff lines--no change
	for ( var i = parseInt(result[0]['first1']); i <= parseInt(result[0]['last1']); i++) 
		output += "<font color=\"red\"> - "+in1+"</font> </br>";
	// context lines
	//printContext3(result);
	return output;
}
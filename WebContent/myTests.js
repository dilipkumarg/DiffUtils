test('changeText()', function() {
	var div1 = document.createElement("div");
	div1.innerHTML = "+";
	div1.id = 'id1';
	document.body.appendChild(div1);
	div1.style.display = 'none';
	var div2 = document.createElement("div");
	div2.innerHTML = "-";
	div2.id = 'id2';
	document.body.appendChild(div2);
	div1.style.display = 'none';
	equal(changeText(div1.id), '-', '+ is changed as -');
	equal(changeText(div2.id), '+', '- is changed as +');
});
test('blocking()', function() {
	var div1 = document.createElement("div");
	div1.innerHTML = "";
	div1.id = 'id3';
	div1.style.display = 'none';
	document.body.appendChild(div1);
	var div2 = document.createElement("div");
	div2.innerHTML = "";
	div2.id = 'id4';
	div2.style.display = 'block';
	document.body.appendChild(div2);
	equal(blocking(div1.id), 'block', 'none is changed as block');
	equal(blocking(div2.id), 'none', 'block is changed as none');
});
test('decideDelta()', function() {
	equal(decideDelta({
		'size1' : 0,
		'size2' : 1
	}), 'addDelta', 'addDelta');
	equal(decideDelta({
		'size1' : 1,
		'size2' : 0
	}), 'deleteDelta', 'deleteDelta');
	equal(decideDelta({
		'size1' : 1,
		'size2' : 1
	}), 'changeDelta', 'changeDelta');
});
test('noChange()',function() {
	equal(noChange(),"<a id='div1' onclick = \"blocking('next_div1');changeText(id)\">-</a>NO CHANGE....TWO FILES ARE EQUAL..<br><div id='next_div1'>2<br></div>",'noChange');
});
test('printResult()', function() {
	var result='[{"last1":2,"first2":2,"size2":1,"last2":2,"first1":3,"size1":1}]';
	equal(printResult(result),'printLast(obj)','printResult');
	var result='[]';
	equal(printResult(result),'noChange()','printResult');
});

test('printContext1()',function(){
	//alert(printContext1(true,true,0,0));
	equal(printContext1(true,true,0,0),'test line1</br>test line1</br>','printContext1');
	equal(printContext1(false,true,0,0),'','printContext1');
	equal(printContext1(true,false,0,1),'test line1</br>','printContext1');
	equal(printContext1(true,false,0,4),'test line1</br>test line1</br>test line1</br>','printContext1');
});
test('printContext2()',function(){
	//alert(printContext2(true,true,0,3));
	equal(printContext2(true,true,0,3),'test line1</br>test line1</br>test line1</br>','printContext2');
	equal(printContext2(false,true,0,0),'','printContext2');
	equal(printContext2(true,false,0,1),'test line1</br>','printContext2');
	equal(printContext2(true,false,0,4),'test line1</br>test line1</br>test line1</br>test line1</br>','printContext2');
});
test('printContext3()',function(){
	//alert(printContext3(true,true,0,3));
	equal(printContext3(true,true,0,3),'test line1</br>test line1</br>test line1</br>','printContext3');
});
test('changeDelta()', function() {
	//alert(changeDelta());
	equal(changeDelta(),'<font color="red"> < e </font> </br>-------</br><font color="green"> > e</font></br><font color="green"> > s</font></br>','changeDelta');
});
test('addDelta()', function() {
	//alert(addDelta());
	equal(addDelta(),'<font color="green"> + test line</font></br><font color="green"> + test line</font></br>','addDelta');
});
test('deleteDelta()', function() {
	//alert(deleteDelta());
	equal(deleteDelta(),'<font color="red"> - test line</font> </br>','deleteDelta');
});

test('printLast()', function() {
	var result='[{"last1":2,"first2":2,"size2":1,"last2":2,"first1":3,"size1":1}]';
	//alert(printLast(result,0,0,true));
	equal(printLast(result,0,0,true),"<a id='div1'onclick = \"blocking('next_div1');changeText(id)\">-</a>test line1<br><div id='next_div1'>test line1<br>test line1<br>test line1<br>test line1<br>test line1<br>test line1<br>test line1<br>test line1<br></div>",'printLast');
	//var result='[]';
	//equal(printResult(result),'noChange()','printLast');
});
test('start()',function() {
	var result='[{"last1":2,"first2":2,"size2":1,"last2":2,"first1":3,"size1":1}]';
	//alert(start(result,2,0,false));
	equal(start(result,2,0,false),"<a id='div1' onclick = \"blocking('next_div1');changeText(id)\">-</a>test line2<br><div id='next_div1'></div>",'start');
});
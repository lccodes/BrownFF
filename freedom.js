//Username var
var us = "";
// converts a string value to its equivlant binary representation.
function stringToBinary(stringValue) {
    return stringValue.replace(/.{1}/g, function (matchedString) {
        var binString = matchedString.charCodeAt(0).toString(2);
        return '00000000'.substring(0, 8 - binString.length) + binString;
    });
}

//Remember young sage, nothing is ever defined until you let it be
function onLoad(){
	//alert("yaya");
	document.getElementById("ss-submit").addEventListener('click', function(event){
		//alert("Success!");
		var all = document.getElementsByTagName("input");
		var allow = true;
			all[0].value = us;
			//alert(obj2['username']);
		
			for(var i = 0; i < all.length; i++){
				if(all[i].value == ""){
					allow = false;
				}
			}
			if(allow){
				//alert("Free!");
				var xmlhttp = new XMLHttpRequest();
				//alert(stringToBinary(obj['username']));
	      			xmlhttp.open("POST","http://jack.cs.brown.edu/data.php",true);
	      			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	      			xmlhttp.send("type=free&username="+stringToBinary(us);
	      			alert(stringToBinary(us));
			}
	});
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get("username", function(obj){
		us = obj['username'];
    });

	//alert("Added");
	window.onload = onLoad;
	//alert("sfsd");	
});

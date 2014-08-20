// converts a string value to its equivlant binary representation.
function stringToBinary(stringValue) {
    return stringValue.replace(/.{1}/g, function (matchedString) {
        var binString = matchedString.charCodeAt(0).toString(2);
        return '00000000'.substring(0, 8 - binString.length) + binString;
    });
}

// converts a binary value to its equivlant string representation.
function binaryToString(binValue) {
    return binValue.replace(/[01]{8}/g, function (matchedString) {
        return String.fromCharCode(parseInt(matchedString, 2));
    });
}

//XOR with secret key
function XOR(binValue){
	var x = "";
	for(i = 0; i < binValue.length; i++){
		if(binValue.charAt(i) == "0"){
			x = x + "1";
		}else{
			x = x + "0";
		}
	}
	return x;
}

//Logs the user into Yahoo.com
document.addEventListener('DOMContentLoaded', function () {
	//You need that encryption file
	var theU = "";
	var theP = "";
	var xmlhttp = new XMLHttpRequest();
		chrome.storage.sync.get("loggedin", function (obj) {
			if(obj['loggedin'] == "true"){
			  xmlhttp.onreadystatechange=function(){
		        if (xmlhttp.readyState==4 && xmlhttp.status==200){
		          chrome.storage.sync.get("username", function (obj2) {
			          var y = obj2['username'];
			          var x = binaryToString(XOR(xmlhttp.responseText));
			          //alert(CryptoJS.AES.encrypt(xmlhttp.responseText, "TheGreatestPasswordEverHidd3n") + "");
			          var theStart= x.substr(x.indexOf(y + ",") + y.length + 1);
					  var user = theStart.split(";");
					  var pass= user[1].split("|")[0];
					  theU = user[0];
					  theP = pass;
					  //Fetch usrname
		    		  document.getElementById("username").value = theU;
		    		  //Fetch pssword
				      document.getElementById("passwd").value = theP;
				      //Forget me
				      document.getElementById("persistent").value = "";
				      //Submit
				      document.getElementById(".save").click();
				  });
		        }
		      }
		      xmlhttp.open("GET","http://jack.cs.brown.edu/matchupTwo.txt?"+ Math.floor((Math.random() * 10000) + 1),false);
		      xmlhttp.send();
		    }
		});
});
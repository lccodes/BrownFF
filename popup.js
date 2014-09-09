alert("jsLoaded");

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

//This function is called when the extension is clicked on (i.e. when the popup page loads)
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("forgot").onclick = forgotP;
	$("#wrong").hide();
	if(localStorage.loggedin == "true"){
    	alreadyIn();
	}else{
		$('#username').watermark('USERNAME');
		$('#password').watermark('PASSWORD');
		$('#login').text("Login");
		document.getElementById("login").onclick = signOn;
	}
});

//Signs the user into our site, so that we can sign them into NFL.com
function signOn(){
	var u = $('#username').val() + ",";
	var p = $('#password').val();

	//Get the login info to see if the u and p are correct
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
  		if (xmlhttp.readyState==4 && xmlhttp.status==200){
  			var theText = binaryToString(XOR(xmlhttp.responseText));
  			var where = theText.indexOf(u);
    		if(where != -1 && (p == theText.substr(where+10, 9))){
    			chrome.storage.sync.set({"username" : $('#username').val()});
    			chrome.storage.sync.set({"loggedin" : "true"});
    			localStorage.username = $('#username').val();
    			chrome.storage.sync.get("new", function (obj) {
				if("new" in obj){
						localStorage.loggedin = "true";
    					localStorage.username = $('#username').val();
    					alreadyIn();
    					$('#forgot').hide();
    					$("#wrong").hide();
		    		}else{
		    			var d = new Date();
		    			localStorage.lastM = ((d.getMonth() - 2) % 12).toString();
		    			localStorage.lastD = 1.toString();
		    			localStorage.survey = "false";
		    			localStorage.complete = "never";
		    			$('#username').val("");
		    			$('#username').watermark('New Password');
		    			$('#password').hide();
		    			$('#login').text("Save Password");
		    			document.getElementById("login").onclick = changeP;
		    			$('#forgot').hide();
		    			$("p").text("Please change your password. Enter the new password below:");
		    			$("#wrong").hide();
		    		}
		    	});	
    		}else if(where != -1){
    			chrome.storage.sync.get("new", function (obj) {
    				chrome.storage.sync.get("username", function (other) {
	    				if("new" in obj 
	    					&& obj["new"] == $('#password').val() 
	    					&& other["username"] == $('#username').val()){
		    					chrome.storage.sync.set({"loggedin" : "true"});
								localStorage.loggedin = "true";
		    					localStorage.username = $('#username').val();
		    					alreadyIn();
		    					$('#forgot').hide();
		    					$("#wrong").hide();
			    		}else if(obj["new"] == $('#password').val() && other["username"] == $('#username').val()){
			    			var d = new Date();
			    			localStorage.lastM = ((d.getMonth() - 2) % 12).toString();
		    				localStorage.lastD = 1.toString();
			    			chrome.storage.sync.set({"loggedin" : "true"});
			    			localStorage.survey = "false";
			    			localStorage.complete = "never";
			    			localStorage.username = $('#username').val();
			    			localStorage.loggedin = "true";
			    			$('#username').val("");
			    			$('#username').watermark('New Password');
			    			$('#password').hide();
			    			$('#login').text("Save Password");
			    			document.getElementById("login").onclick = changeP;
			    			$('#forgot').hide();
			    			$("p").text("Please change your password. Enter the new password below:");
			    			$("#wrong").hide();
			    		}else{
			    			alert("line 111");
			    			$("#wrong").show();
			    		}
		    		});
    			});	
    		}else{
    			alert("line 117");
    			$("#wrong").show();	
    		}
    	}
  	}

  	xmlhttp.open("GET","http://jack.cs.brown.edu/theTrueFile.txt?"+ Math.floor((Math.random() * 10000) + 1),true);
	xmlhttp.send();
}

//What happens to the extension once they are signed on
function alreadyIn(){
	$('#username').hide();
    $('#password').hide();
    $('#login').text("Logout");
    document.getElementById("login").onclick = signOut;
    $("p").text("You are signed in. Feel free to go to")
    $(".link").text("fantasyfootball.yahoo.com");
    $(".link").click(function(){
    	chrome.tabs.create({ url: "https://login.yahoo.com" });
	});
    $('#forgot').hide();
    $("h1").text("Welcome BACK to BrownFF!");
    //Checks if it is survey time
    var d = new Date();
    var m = d.getMonth();
	var date = d.getDate();
	var day = d.getDay();
	var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	var mDif = m - parseInt(localStorage.lastM);
	if((mDif == 1) || (mDif == -1) || (mDif == -11)){
		var dDif = monthDays[parseInt(localStorage.lastM)] - parseInt(localStorage.lastD) + date;
	}
	else if(mDif == 0){
		var dDif = date - parseInt(localStorage.lastD);
	}
	else{
		var dDif = 100;
	}
	if((day >= 2 && day - dDif < 2) || (day < 2 && day - dDif < -5)){
		survey()
	}
}

//Signs them out of the extension
function signOut(){
	localStorage.loggedin="false";
	chrome.storage.sync.set({"loggedin" : "false"});
	$('#forgot').show();
	$('#username').val("");
	$('#password').val("");
	$('#username').watermark('USERNAME');
	$('#password').watermark('PASSWORD');
	$('#username').show();
    $('#password').show();
    $(".link").hide();
    $('#login').text("Login");
    $("p").text("Please login in using your assigned username and password to proceed to your manager portal. \nIf you forgot your password, enter your username and click Forget Password.");
    $("h1").text("Welcome to Brown Fantasy Football!");
	document.getElementById("login").onclick = signOn;
	chrome.tabs.create({ url: "http://login.yahoo.com/?logout=1" });
}

//Forgot password stuff
function forgotP(){
	chrome.storage.sync.get("username", function (obj) {
		if("username" in obj && $('#username').val() == obj["username"]){
			chrome.storage.sync.get("new", function (other) {
				$("p").text("Your password is " + other["new"]);
			});
			$('#username').val("");			
		}
	});
}

//Change password stuff
function changeP(){
	chrome.storage.sync.set({"new" : $('#username').val()});
	chrome.storage.sync.set({"loggedin" : "true"});
	localStorage.loggedin = "true";
    alreadyIn();
}

//Displays the survey if it is time.
function survey(){
	var xmlHttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if(XOR(stringToBinary(localStorage.username)) in eightManUNs){
			chrome.browserAction.setPopup({popup: "survey8.html"});
			window.location.href="survey8.html";
		}
		else{
			chrome.browserAction.setPopup({popup: "survey.html"});
			window.location.href="survey.html";
		}	
	}
	xmlhttp.open("GET","http://jack.cs.brown.edu/eightMan.txt?"+ Math.floor((Math.random() * 10000) + 1),true);
	xmlhttp.send();
}

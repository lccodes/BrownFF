//This function is called when the extension is clicked on (i.e. when the popup page loads)
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("forgot").onclick = forgotP;
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
  			var where = xmlhttp.responseText.indexOf(u);
    		if(where != -1 && (p == xmlhttp.responseText.substr(where+10, 9))){
    			chrome.storage.sync.set({"username" : $('#username').val()});
    			chrome.storage.sync.get("new", function (obj) {
					if("new" in obj){
						localStorage.loggedin = "true";
    					localStorage.username = $('#username').val();
    					alreadyIn();
		    		}else{
		    			$('#username').val("");
		    			$('#username').watermark('New Password');
		    			$('#password').hide();
		    			$('#login').text("Save Password");
		    			document.getElementById("login").onclick = changeP;
		    			$('#forgot').hide();
		    			$("p").text("Please change your password. Enter the new password below:");
		    		}
		    	});	
    		}else if(where != -1){
    			chrome.storage.sync.get("new", function (obj) {
    				if("new" in obj && obj["new"] == $('#password').val()){
    					chrome.storage.sync.set({"username" : $('#username').val()});
						localStorage.loggedin = "true";
    					localStorage.username = $('#username').val();
    					alreadyIn();
		    		}else if(obj["new"] == $('#password').val()){
		    			chrome.storage.sync.set({"username" : $('#username').val()});
		    			localStorage.username = $('#username').val();
		    			$('#username').val("");
		    			$('#username').watermark('New Password');
		    			$('#password').hide();
		    			$('#login').text("Save Password");
		    			document.getElementById("login").onclick = changeP;
		    			$('#forgot').hide();
		    			$("p").text("Please change your password. Enter the new password below:");
		    		}
    			});	
    		}
    	}
  	}

  	xmlhttp.open("GET","http://jack.cs.brown.edu/theFile.txt",true);
	xmlhttp.send();
}

//What happens to the extension once they are signed on
function alreadyIn(){
	$('#username').hide();
    $('#password').hide();
    $('#login').text("Logout");
    document.getElementById("login").onclick = signOut;

    $("p").text("You are signed in. Feel free to go to")
    $("a").text("fantasyfootball.yahoo.com");
    $("h1").text("Welcome BACK to BrownFF!");
}

//Signs them out of the extension
function signOut(){
	localStorage.loggedin="false";
	$('#username').val("");
	$('#password').val("");
	$('#username').watermark('USERNAME');
	$('#password').watermark('PASSWORD');
	$('#username').show();
    $('#password').show();
    $("a").hide();
    $('#login').text("Login");
    $("p").text("Please login in using your assigned username and password to proceed to your manager portal. \nIf you forgot your password, enter your username and click Forget Password.");
    $("h1").text("Welcome to Brown Fantasy Football!");
	document.getElementById("login").onclick = signOn;
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
	localStorage.loggedin = "true";
    alreadyIn();
}
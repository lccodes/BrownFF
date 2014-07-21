//This function is called when the extension is clicked on (i.e. when the popup page loads)
var loggedIn = localStorage.loggedin;
document.addEventListener('DOMContentLoaded', function () {
	if(loggedIn){
    	alreadyIn();
	}else{
		$('#username').watermark('USERNAME');
		$('#password').watermark('PASSWORD');
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
    			//What to do when they log in correctly
    			//we could run intoNFL() right here or we can tell them that they are logged in and go on our merry way
    			//I'm choosing the later for now
    			loggedIn = true;
    			localStorage.loggedin = true;
    			alreadyIn();
    		}else{
    			//What to do when they fail to log in
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

    $("p").text("You are already signed in, feel free to go to NFL.com and play FF whenever you like!!!");
    $("h1").text("Welcome BACK to BrownFF!");
}

//Signs them out of the extension
function signOut(){
	localStorage.loggedin=false;
	$('#username').show();
    $('#password').show();
    $('#login').val("Login");
    $("p").text("Please login in using your assigned username and password to proceed to your manager portal");
    $("h1").text("Welcome to Brown Fantasy Football!");
	document.getElementById("login").onclick = signOn;
}


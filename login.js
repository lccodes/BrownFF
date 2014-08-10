//Logs the user into Yahoo.comm
document.addEventListener('DOMContentLoaded', function () {
	var theU = "";
	var theP = "";
	var xmlhttp = new XMLHttpRequest();
	chrome.storage.sync.get("loggedin", function (obj) {
		if(obj['loggedin'] == "true"){
		  xmlhttp.onreadystatechange=function(){
	        if (xmlhttp.readyState==4 && xmlhttp.status==200){
	          chrome.storage.sync.get("username", function (obj2) {
		          var y = obj2['username'];
		          var x = xmlhttp.responseText;
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
	      xmlhttp.open("GET","http://jack.cs.brown.edu/matchup.txt",false);
          xmlhttp.send();
	    }
	});

});
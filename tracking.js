//Adds the tracking code
//Uncomment alerts to find out some userful info
document.addEventListener('DOMContentLoaded', function () {
  //alert("Pre");
  chrome.runtime.sendMessage({method: "getUsername"}, function(response) {
  	var username = response.status;
	var links = document.querySelectorAll('a');
	for (var i = 0; i < links.length; i++) {
		links[i].addEventListener('click', function(event){
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST","http://jack.cs.brown.edu/data.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("type=clicks&username="+username+"&click="+event.target.innerHTML);
			//Double check on that sweet sweet data
			//alert(username);
		});
	}
  });

  //Happiness dialog box
    if(document.getElementsByName("jsubmit")[0]){
      //See if it's survey time
      chrome.runtime.sendMessage({method: "getDay"}, function(response) {
      	chrome.runtime.sendMessage({method: "getMonth"}, function(responseTwo) {
      	  var lastD = response.status;
      	  var lastM = responseTwo.status;
	      var d = new Date();
	      var m = d.getMonth();
	      var date = d.getDate();
	      var day = d.getDay();
	      var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	      var mDif = m - parseInt(lastM);
	      var dDif = 0;
	      if((mDif == 1) || (mDif == -1) || (mDif == -11)){
	        dDif = monthDays[parseInt(lastM)] - parseInt(lastD) + date;
	      }
	      else if(mDif == 0){
	        dDif = date - parseInt(lastD);
	      }
	      else{
	        dDif = 100;
	      }
	      if((day >= 2 && day - dDif < 2) || (day < 2 && day - dDif < -5)){
	        alert("Please click on the extension window and complete the survey in order to proceed to setting your lineup.");
	        deny = true;
	      }
	     
	      if(deny){
	        chrome.extension.sendRequest({redirect: "http://football.fantasysports.yahoo.com"});
	      }
		});
      });

	    document.getElementsByName("jsubmit")[0].addEventListener('click', function(event){
	  	var done = false;
	  	chrome.runtime.sendMessage({method: "getUsername"}, function(response) {
		  	while(!done){
		  		var num = parseInt(prompt("Hello, \n On a scale of 1 (not at all) to 10 (completely), how much fun are you having playing in the Brown FF league?", ""), 10);
		  		if(0 <= num && 10 >= num){
		  			done = true;
		  			var xmlhttp = new XMLHttpRequest();
					xmlhttp.open("POST","http://jack.cs.brown.edu/data.php",true);
					xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					xmlhttp.send("type=happiness&username="+response.status+"&score="+num);
		  		}
		  	}
		});
	  });
	}
  //alert("Post");
});

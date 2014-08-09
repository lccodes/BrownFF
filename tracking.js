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
	    document.getElementsByName("jsubmit")[0].addEventListener('click', function(event){
	  	var done = false;
	  	chrome.runtime.sendMessage({method: "getUsername"}, function(response) {
		  	while(!done){
		  		var num = parseInt(prompt("Hello, \n On a scale of 1 (not at all) to 5 (completely), how happy are you? \n Thanks and Love, \n BrownFF", ""), 10);
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

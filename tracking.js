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

  document.getElementsByName("jsubmit")[0].addEventListener('click', function(event){
  	var done = false;
  	while(!done){
  		var num = parseInt(prompt("Hello, \n Please enter your current happiness on a scale of 0 (agony) to 10 (ecstasy). \n Thanks and Love, \n BrownFF", "5"), 10);
  		if(0 <= num && 10 >= num){
  			done = true;
  		}
  	}
  });
  //alert("Post");
});

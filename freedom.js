//Remember young sage, nothing is ever defined until you let it be
function onLoad(){
	document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("ss-submit").addEventListener('click', function(event){
		//alert("Success!");
		var all = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("input");
		var allow = true;
		for(var i = 0; i < all.length; i++){
			if(all[i].value == ""){
				allow = false;
			}
		}
		if(allow){
			chrome.storage.sync.get("username", function (obj) {
				var xmlhttp = new XMLHttpRequest();
	      		xmlhttp.open("POST","http://jack.cs.brown.edu/data.php",true);
	      		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	      		xmlhttp.send("type=free&username="+obj['username']);
      		});
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementsByTagName("iframe")[0].onload = onLoad;
});
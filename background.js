//What happens when you visit NFL.com
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    var deny = false;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
        var where = xmlhttp.responseText.indexOf(localStorage.username + ",");
        if(where != -1 && ("f" == xmlhttp.responseText.substr(where+10, 1))){
          //Redirect if they need to fill out the survey
          deny = true;
        }
      }
    }
    xmlhttp.open("GET","http://jack.cs.brown.edu/didYou.txt",false);
    xmlhttp.send();
    if(deny){
      return {redirectUrl: "http://jack.cs.brown.edu/survey"};
    }
  },
  // filters
  {
    urls: [
      "*://*.nfl.com/*",
      "*://www.nfl.com/*",
      "*://nfl.com/*"
    ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  // extraInfoSpec
  ["blocking"]);
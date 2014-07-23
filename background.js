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
      "*://*.yahoo.com/*",
      "*://www.yahoo.com/*",
      "*://yahoo.com/*",
      "https://login.yahoo.com/*"
    ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  // extraInfoSpec
  ["blocking"]);

//Block them from the manager portal in every shape and form
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    alert("I'm sorry but you cannot access this content. Please email football@cs.brown.edu if you believe you arrived here by mistake.");
    return {redirectUrl: "http://football.fantasysports.yahoo.com"};
  },
  // filters
  {
    //All the stuff they can't access on yahoo
    urls: [
      "*://football.fantasysports.yahoo.com/*deleteteams",
      "*://football.fantasysports.yahoo.com/*settings",
      "*://football.fantasysports.yahoo.com/f1/reg/joinleague/*",
      "*://football.fantasysports.yahoo.com/*createleague"
    ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  // extraInfoSpec
  ["blocking"]);
//Lets the content script access info
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getUsername")
      sendResponse({status: localStorage['username']});
    else
      sendResponse({}); // snub them.
});
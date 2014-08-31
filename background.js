// converts a binary value to its equivlant string representation.
function binaryToString(binValue) {
    return binValue.replace(/[01]{8}/g, function (matchedString) {
        return String.fromCharCode(parseInt(matchedString, 2));
    });
}
//What happens when you visit NFL.com
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    if(info.url.indexOf("teamlog") == -1 || localStorage.loggedin != "true"){
      var deny = false;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
          var real = binaryToString(xmlhttp.responseText);
          var where = real.indexOf(localStorage.username + ",");
          //alert(xmlhttp.responseText);
          //alert(xmlhttp.responseText.substr(where+10, 1));
          if(where != -1 && ("f" == real.substr(where+10, 1))){
            //Redirect if they need to fill out the survey
            deny = true;
          }
        }
      }
      xmlhttp.open("GET","http://jack.cs.brown.edu/didYouTwo.txt?" + Math.floor((Math.random() * 10000) + 1),false);
      xmlhttp.send();
      if(deny){
        return {redirectUrl: "http://jack.cs.brown.edu/survey"};
      }
    }
  },
  // filters
  {
    urls: [
      "*://football.fantasysports.yahoo.com/*",
      "*://*.yahoo.com/*"
    ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  // extraInfoSpec
  ["blocking"]);

//Block them from the manager portal in every shape and form
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    if(localStorage.loggedin == "true"){
      alert("I'm sorry but you cannot access this content. Please email football@cs.brown.edu if you believe you arrived here by mistake.");
      return {redirectUrl: "http://football.fantasysports.yahoo.com"};
    }
  },
  // filters
  {
    //All the stuff they can't access on yahoo
    urls: [
      "*://football.fantasysports.yahoo.com/*deleteteams",
      "*://football.fantasysports.yahoo.com/*settings",
      "*://football.fantasysports.yahoo.com/*joinleague/*",
      "*://football.fantasysports.yahoo.com/*createleague*",
      "*://football.fantasysports.yahoo.com/*commishhome*",
      "*://football.fantasysports.yahoo.com/*editleaguename",
      "*://football.fantasysports.yahoo.com/*editstatcategories",
      "*://football.fantasysports.yahoo.com/*editteaminfo",
      "*://football.fantasysports.yahoo.com/*invitecomanager",
      "*://football.fantasysports.yahoo.com/*share_medal/*"
    ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  // extraInfoSpec
  ["blocking"]);

//Lets the content scripts access info
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getUsername")
      sendResponse({status: localStorage['username']});// else if (request.method == "isIn")   sendResponse({status: localStorage['loggedin']});
    else
      sendResponse({});
});

//Collect the pages that they visits
chrome.webRequest.onCompleted.addListener(
  function(info){
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("POST","http://jack.cs.brown.edu/data.php",true);
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xmlhttp.send("type=views&username="+localStorage.username+"&page="+info.url);
  },
  //filters
  {
    urls:["*://football.fantasysports.yahoo.com/*"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  ["responseHeaders"]);

//Stop chrome from saving their password
chrome.webRequest.onCompleted.addListener(
  function(info){
    //alert("Start!");
      var theTime = (new Date()).getTime() - 100000;
      chrome.browsingData.remove({
        "since": theTime
      }, 
      {
        "passwords": true
      },
      function(){
        //alert("Removed!");
      });
  },
  //filters
  {
    urls:["*://football.fantasysports.yahoo.com/*", 
          "*://www.yahoo.com/*"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  ["responseHeaders"]);

//Log them out if they disable the extension
//the goal here is to listen for chrome://extensions
//and then log them out of yahoo when they visit just in case they disable the extension
//it's less intrusive and cautious
chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == "complete" && tab.url == "chrome://extensions/" && localStorage.loggedin == "true") {
    chrome.tabs.create({url : 'http://login.yahoo.com/?logout=1'});
  }
});
chrome.tabs.onActivated.addListener(function(selectInfo){
  chrome.tabs.get(selectInfo.tabId, function(tab){
    if (tab.url == "chrome://extensions/" && localStorage.loggedin == "true") {
    chrome.tabs.create({url : 'http://login.yahoo.com/?logout=1'});
    }
  });
});

//REMEMBER*************
//Plz keep me last
//Log them out of Yahoo if they uninstall
chrome.runtime.setUninstallURL("http://login.yahoo.com/?logout=1");

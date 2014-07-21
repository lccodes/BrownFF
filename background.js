//What happens when you visit NFL.com
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    //console.log('onBeforeRequest', info.url);
    return {redirectUrl: "jack.cs.brown.edu/survey"};
  },
  // filters
  {
    urls: [
      "*://*.nfl.com/*",
      "*://www.nfl.com/*"
    ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  // extraInfoSpec
  ["blocking"]);
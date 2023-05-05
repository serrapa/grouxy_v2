
/*
onBeforeRequest format seems to be like 

chrome.webRequest.onBeforeRequest.addListener( callback, filter, opt_extraInfoSpec);

Each addListener() call takes a mandatory callback function as the first parameter. This callback function is passed a dictionary containing information about the current URL request. The information in this dictionary depends on the specific event type as well as the content of opt_extraInfoSpec.

If the optional opt_extraInfoSpec array contains the string 'blocking' (only allowed for specific events), the callback function is handled synchronously. That means that the request is blocked until the callback function returns. In this case, the callback can return a webRequest.BlockingResponse that determines the further life cycle of the request. Depending on the context, this response allows cancelling or redirecting a request (onBeforeRequest), cancelling a request or modifying headers (onBeforeSendHeaders, onHeadersReceived), and cancelling a request or providing authentication credentials (onAuthRequired).

If the optional opt_ex

*/
var filter = {urls: ["<all_urls>"]};
const webRequestFlags = [
  'blocking',
];

var google_collectors = [
    "https://beacons.gcp.gvt2.com/domainreliability/upload",
    "https://beacons.gvt2.com/domainreliability/upload",
    "https://beacons2.gvt2.com/domainreliability/upload",
    "https://beacons3.gvt2.com/domainreliability/upload",
    "https://beacons4.gvt2.com/domainreliability/upload",
    "https://beacons5.gvt2.com/domainreliability/upload",
    "https://beacons5.gvt3.com/domainreliability/upload",
    "https://clients2.google.com/domainreliability/upload"
];
//pay att to types: ['main_frame', 'sub_frame']

chrome.webRequest.onBeforeRequest.addListener(request_before, filter, webRequestFlags);

function request_before(details){
  //console.log("received request");
  //console.log(details);


  var tabId = details.tabId;



  //now let's check tabId's group
  chrome.tabs.get(tabId, function(tabInfo){

  	if(tabInfo.groupId === undefined){
  		console.log("**ERROR** [tabInfo.groupId not defined]", details, tabInfo);
  		return {cancel: false}
  	}

    var group_id = tabInfo.groupId;

    
    if(group_id == -1){
      //tab non appartiene a group o appartiene al gruppo con il colore no-proxy
      //just bypass. direct proxy  
      console.log(details.url, "tabId", tabId, "NOTINTGROUPS");


      var config_direct = {
        mode: "direct"
      };

      chrome.proxy.settings.set({value: config_direct, scope: 'regular'}, function() {
        chrome.proxy.settings.get({}, function(config) {
          console.log("PROXY.GET", config.value, config.value.host);
        }); 
      });
      return {cancel: false};
    }

    console.log(details.url, "group", group_id, "tab", tabId, "INTHEGROUP");

    //redirect this request to proxy
    var config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: "http",
                host: "127.0.0.1",
                port: 8080
            }
        }
    };


    chrome.proxy.settings.set({value: config, scope: 'regular'}, function() {
      chrome.proxy.settings.get({}, function(config) {
        console.log("PROXY.GET", config.value, config.value.host);
      }); 
    });

    

  
  });

}



chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  //chrome.storage.local.remove(tabId.toString(), function() {});
});


chrome.runtime.onMessage.addListener( function(request, sender, sendResponse)
{
    if( request.message === "giveme4xx" ){

        var current = 0;
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
          current = tabs[0].id;

          chrome.storage.local.get(current.toString(), function(data){
            console.log("returnig", data[current]);
            var data_out = false;
            if(data[current] != undefined){
              data_out = data[current]['contents'];
            }

            sendResponse({result: data_out});
            return true;      
          });

        });
         
    }


    if( request.message === "start_scan"){
      console.log("received start_scan", request);
      var action = request['action'];
      var evidenceId = request.evidenceId;
      var urlTarget = request.urlTarget;
      console.log(evidenceId, action, urlTarget);
      sendResponse({result: "ok bomber"});
    }

    return true;
});
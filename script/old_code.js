/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  if(changeInfo.status === 'loading'){

    chrome.tabs.get(parseInt(tabId), function(data){
      domainTab = (new URL(data.url));
      domainTab = domainTab.hostname;

      chrome.storage.local.get(tabId.toString(), function(data) {
        
        if (typeof data[tabId] === 'undefined') {
          //pass
        } else {
          if(data[tabId]['domain'] != domainTab){
            console.log("mismatch, let's delete shit");
            chrome.storage.local.remove(tabId.toString(), function() {});
          }
        }
      });

    });

    
  }
});
*/

  /*chrome.storage.local.get(null, function(items) {
            var allKeys = Object.keys(items);
            allKeys.forEach(function (item, index) {
              chrome.storage.local.get(item, function(data){
                console.log("current ", current, data[item]['contents'].tabId);
                data[item]['contents'].tabId == current ? result.push(data[item]) : !0
              });
            });
          });*/
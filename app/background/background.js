let overrideRules = [];
let currentUrl = "";
let currentTabId = 1;
let requestHasBeenRedirected = false;

// Fires when the active tab in a window changes. Note that the tab's URL may not be set at the time this event fired,
// but you can listen to onUpdated events to be notified when a URL is set.
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        console.log("tabActivated", tab);
        currentUrl = tab.url;
        currentTabId = tab.id;
    });
});

/**
 * Receive details for every request, check if it corresponds to one of our rule and if so, redirect it.
 * @param {*} details 
 */
function dealWithRequest(details) {
    console.log('details', details);
    /**
     * If request has type "main_frame"
     * It means this is the page request, therefore, we pick up the url of the request
     */
    if (details.type === "main_frame" && details.tabId === currentTabId) {
        currentUrl = details.url;
    }

    let redirect = false;
    let redirectUrl = "";

    console.log('WE ARE HERE');
    console.log(overrideRules);
    for (let rule of overrideRules) {
        const requestRegex = RegExp(rule.requestRegex, 'i');
        const pagesScope = RegExp(`${rule.pagesRegex}$`, 'i');

        if (!rule.actived) {
            continue;
        }

        // If URL doesn't match pagesScope, proceed to next rule
        if (!pagesScope.test(currentUrl)) {
            continue;
        }

        // We tell contentscript.js to add the code in the page
        if (rule.injectionChoice === "injectCode") {
            const message = {
                payload: {
                    injectCode: "true",
                    codeUrl: rule.localhostUrl
                }
            };

            /**
             * Send payload to currend tab to say "Hey, code has been injected there"
             */
            chrome.tabs.sendMessage(currentTabId, message, function (response) {
                // console.log("response");
                // console.log(response);
            });
            continue;
        }

        // Without rule.requestRegex !== "" it will crash the extension sometime
        if (rule.requestRegex !== "" && requestRegex.test(details.url)) {
            // console.log('____________________________________');
            redirect = true;
            redirectUrl = rule.localhostUrl;
        }
    }


    if (redirect) {
        requestHasBeenRedirected = true;
        // chrome.tabs.sendMessage(currentTabId, message);
        // console.log('on passe bien là');
        return { redirectUrl: redirectUrl };
    }
}



const unwatchRequests = () => {
    if (chrome.webRequest.onBeforeRequest.hasListener(dealWithRequest)) {
        chrome.webRequest.onBeforeRequest.removeListener(dealWithRequest);
    }
}

const watchRequest = () => {
    unwatchRequests(); // In case watchRequest is called 2 times in a row...
    chrome.webRequest.onBeforeRequest.addListener(
        dealWithRequest,
        {
            urls: ["<all_urls>"] // La fonction au dessus s'applique a <all_urls>
        },
        ["blocking"]
    );
}



/**
 * Triggered everytime we receive a message from the App or Contentscript.js
 */
chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Background -> Message received', message);

    /**
     * Message sent by contentScript when it is loaded
     */
    if (message.payload.hasOwnProperty("contentscriptReady")) {
        if (requestHasBeenRedirected) {
            const message = {
                payload: {
                    requestHasBeenRedirected: "true"
                }
            };

            /**
             * Send payload to currend tab to say "Hey, code has been injected there"
             */
            chrome.tabs.sendMessage(currentTabId, message, function (response) {
                // console.log("response");
                // console.log(response);
            });
            requestHasBeenRedirected = false;
        }
        return;
    }

    // Check if we have to watch or not
    if (message.payload.hasOwnProperty("requestoverrideWatch") && message.payload.requestoverrideRules !== [] && message.payload.requestoverrideRules !== undefined) {
        if (message.payload.requestoverrideWatch) {
            watchRequest();
        } else {
            unwatchRequests();
        }
    }

    if (message.payload.hasOwnProperty('requestoverrideRules')) {
        overrideRules = message.payload.requestoverrideRules;
    }
});
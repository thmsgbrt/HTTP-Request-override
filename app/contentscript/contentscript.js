/**
 * Let's add an element on the page when the local code has been injected
 */
(function() {
    let requestOverrideCodeInjection = false; // will be set to true if we loop throught a rule that asks to add code after DOM Ready

    function createBadge(text) {
        const badgeEl = document.createElement('div');
        badgeEl.id = "cs_requestOverride_injected";
        badgeEl.innerHTML = `HTTP Request Override : <b style='color:#6cd06c'>${text}</b>`;
        badgeEl.style.position = "fixed";
        badgeEl.style.top = "200px";
        badgeEl.style.left = "-1px";
        badgeEl.style.border = "1px solid #cecece";
        badgeEl.style.padding = "10px 20px";
        badgeEl.style.borderTopRightRadius = "10px";
        badgeEl.style.borderBottomRightRadius = "10px";
        badgeEl.style.backgroundColor = "#f3f3f3";
        badgeEl.style.zIndex = "99999";
        return badgeEl;
    }

    function injectCodeAfterDomRdy(codeUrl) {
        const scriptEl = document.createElement('script');
        scriptEl.id = "requestoverride_codeInjected";
        scriptEl.src = codeUrl;
        const badgeEl = createBadge('Provided request injected');
        
        if (document.readyState === "complete") {
            document.body.insertAdjacentElement('afterbegin', scriptEl);
            document.body.insertAdjacentElement('afterbegin', badgeEl);
        } else {
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                    document.body.insertAdjacentElement('afterbegin', scriptEl);
                    document.body.insertAdjacentElement('afterbegin', badgeEl);
                }
            };
        }
    }

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if(message.payload.hasOwnProperty('injectCode') && requestOverrideCodeInjection === false) {
            requestOverrideCodeInjection = true;
            if(document.querySelector('#cs_requestOverride_injected') === null) {
                injectCodeAfterDomRdy(message.payload.codeUrl);
            }
        }

        if(message.payload.hasOwnProperty('requestHasBeenRedirected')) {
            const badgeEl = createBadge('Request Overrided');
            document.body.insertAdjacentElement('afterbegin', badgeEl);
        }
    });


    /**
     * Tell background that the page is ready
     */
    if (document.readyState === "complete") {
        chrome.extension.sendMessage({payload:{contentscriptReady: "true"}}, function(response) {
        });
    } else {
        chrome.extension.sendMessage({payload:{contentscriptReady: "true"}}, function(response) {
        });
    }

})();
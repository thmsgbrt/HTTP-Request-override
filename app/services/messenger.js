class Messenger {
    constructor() {}

    sendMessage(message) {
        console.log('A');
        chrome.extension.sendMessage(message,function(reponse){  
        console.log('B', message);
            // if(reponse.type == "test"){
            //     console.log('test received');
            // }
        });
    }
}
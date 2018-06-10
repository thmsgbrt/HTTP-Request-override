class Store {
    constructor() {
        this.dataInStorage = {};
    }

    set(payload) {
        chrome.storage.sync.set(payload, function() {});
    }

    // async get(key) {
    //     let data;
    //     await chrome.storage.sync.get([key], function(result) {
    //         console.log(result);
    //         data = result;
    //     });
    //     console.log('trtrt', data);
    //     return data;
    // }

    get(key) {
        return new Promise((resolve) => {
            chrome.storage.sync.get(key, (result) => {
                this.dataInStorage = result;
                // console.log(this.dataInStorage);
                resolve();
            });
        });
    }
}
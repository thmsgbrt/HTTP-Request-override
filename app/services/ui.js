class Ui {
    constructor() {
        this.newElement = new CreateElement();
        this.ruleRowCreator = new RuleRowCreator();
        this.mainEl = document.querySelector('main');
    }

    toggleHeaderActive(status) {
        const headerEl = document.querySelector('header');
        if ( status ) {
            headerEl.classList.add('header--extensionActive');
            chrome.browserAction.setIcon({path: '../assets/img/active.png'});
        } else {
            headerEl.classList.remove('header--extensionActive');
            chrome.browserAction.setIcon({path: '../assets/img/normal.png'});
        }
    }

    insertRuleRow(ruleData) {
        const getRowEl = this.ruleRowCreator.createRow(ruleData); // return [el, id]
        this.mainEl.insertAdjacentElement('afterbegin', getRowEl[0]);
        return getRowEl[1]; // Returning ID of row
    }


}


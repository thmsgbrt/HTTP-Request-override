class App {
    constructor() {
        this.ui = new Ui();
        this.messenger = new Messenger();
        this.store = new Store();
        this.switchActiveExtensionBtnEl = document.querySelector('#switchActiveExtension');
        this.addRulesBtnEl = document.querySelector('#btn__addRules');
        this.init();
    }

    async init () {
        try {
            this.bindSwitchActiveExtension();
            this.bindAddRuleBtn();
            /*
             * Check which data in chrome sync, see if we can display some stuff
             */
            await this.store.get(["requestoverrideWatch", "requestoverrideRules"]);
            this.restoreData();
            // console.log('app -> init -> store.dataInStorage');
            // console.log(this.store.dataInStorage);
        } catch (err) {
            console.warn(`Error: ${err}`);
            console.warn(`Error: Try restarting the app`);
        }
    }

    restoreData() {
        let data = this.store.dataInStorage;

        // Check if property exists and is equal to true
        // If so, we trigger click on checkbox
        if (data.hasOwnProperty("requestoverrideWatch") && data.requestoverrideWatch) {
            // this.switchActiveExtensionBtnEl.click();
            this.ui.toggleHeaderActive(data.requestoverrideWatch);
            this.messenger.sendMessage({payload: this.store.dataInStorage});
            document.querySelector('#switchActiveExtension').checked = true;
        }

        // console.log('tesot', data.hasOwnProperty('requestoverrideRules'), data.requestoverrideRules);
        if (data.hasOwnProperty('requestoverrideRules')) {
            const rulesToRestore = data.requestoverrideRules;
            rulesToRestore.forEach((rule) => {
                const rowID = this.ui.insertRuleRow(rule);  // insert row and get ID in return
                this.bindRowListeners(rowID);
            })
        }

    }

    updateData() {
        const appStatus = this.switchActiveExtensionBtnEl.checked;
        const ruleEls = document.querySelectorAll('.rule');
        let rulesData = [];


        ruleEls.forEach((ruleEl) => {
            let ruleData = {};
            ruleData.id = ruleEl.id;
            ruleData.actived = ruleEl.querySelector('.rule--activate').checked;
            // console.log('LILO');
            // console.log(ruleData.actived);
            ruleData.injectionChoice = ruleEl.querySelector('.rule--injectionChoice').value;
            // console.log('josé :', ruleData.injectionChoice );
            ruleData.pagesRegex = ruleEl.querySelector('.rule--pagesRegex').value;
            ruleData.requestRegex = ruleEl.querySelector('.rule--requestRegex').value;
            ruleData.localhostUrl = ruleEl.querySelector('.rule--localhostUrl').value;

            rulesData.unshift(ruleData);
        });

        this.store.dataInStorage = {requestoverrideRules: rulesData, requestoverrideWatch: appStatus};

        this.store.set(this.store.dataInStorage);
        this.messenger.sendMessage({payload: this.store.dataInStorage});
    }

    toggleSwitchActiveExtension(status) {
        this.ui.toggleHeaderActive(status);
        // this.store.set({requestoverrideWatch: status});
        this.store.dataInStorage.requestoverrideWatch = status;
        this.updateData();
    }

    bindAddRuleBtn () {
        this.addRulesBtnEl.addEventListener('click', () => {
            const rowID = this.ui.insertRuleRow(); // insert row and get ID in return
            this.bindRowListeners(rowID);
        })
    }

    bindSwitchActiveExtension () {
        this.switchActiveExtensionBtnEl.addEventListener('click', (e) => {
            this.toggleSwitchActiveExtension(e.target.checked);
        })
    }

    bindRowListeners(id) {
        // Active
        document.querySelector(`#${id}_rule--activate`).addEventListener('click', () => {
            console.log('Active or not');
            this.updateData();
        });

        // Injection Choice
        document.querySelector(`#${id}_rule--injectionChoice`).addEventListener('change', (e) => {
            const thisLabel = document.querySelector(`label[for="${id}_rule--requestRegex"]`);
            if(e.target.value === "injectCode") {
                thisLabel.style.display = 'none';
            } else {
                thisLabel.style.display = 'flex';                
            }
            this.updateData();
        });

        // Delete
        document.querySelector(`#${id} .rule--delete`).addEventListener('click', (e) => {
            console.log(e.target.dataset.ruleid);
            console.log('Deletion');
            const idToDelete = e.target.dataset.ruleid;
            document.querySelector(`#${idToDelete}`).remove();
            this.updateData();
        });

        // A/B Test Regex
        document.querySelector(`#${id}_rule--pagesRegex`).addEventListener('keyup', () => {
            console.log('ab change');
            this.updateData();
        });
        
        // Request Regex
        document.querySelector(`#${id}_rule--requestRegex`).addEventListener('keyup', () => {
            console.log('request change');
            this.updateData();
        });
        
        // Localhost URL
        document.querySelector(`#${id}_rule--localhostUrl`).addEventListener('keyup', () => {
            console.log('localhost change');
            this.updateData();            
        });
    }
}
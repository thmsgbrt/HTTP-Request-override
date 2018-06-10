class RuleRowCreator {
    constructor() {
        this.newElement = new CreateElement();
    }

    createRow(ruleData) {
        if (ruleData === undefined) {
            ruleData = {};
            ruleData.id = `r${Date.now()}`;
            ruleData.actived = false;
            ruleData.pagesRegex = "";
            ruleData.injectionChoice = "overrideRequest";
            ruleData.requestRegex = "\\/requestRegex\\/*.js";
            ruleData.localhostUrl = "http://localhost:8000/build/output.js";
        }

        console.log(ruleData);

        // Faudra binder les élements aussi

        return [this.newElement.create("div",{"id": ruleData.id, "class": "rule"}, [this.ruleActionsEl(ruleData), this.ruleContentEl(ruleData)]), ruleData.id];
    }

    ruleActionsEl(ruleData) {
        // a
        const imgDeleteEl = this.newElement.create('img',{"data-ruleid": `${ruleData.id}`, "class": "icon-16px", "src": "../assets/img/error.svg", "alt": "Add rule"});
        const aDeleteEl = this.newElement.create('a', {"id": `${ruleData.id}_rule--delete`,"data-ruleid": `${ruleData.id}`, "href": "#", "class": "rule--delete"}, ["Delete ", imgDeleteEl]);

        //Label + input
        let inputRuleActivateEl = this.newElement.create('input', {'id': `${ruleData.id}_rule--activate`, "class": "rule--activate", "type":"checkbox"});
        if (ruleData.actived) {
            inputRuleActivateEl.checked = true;
        }
        const labelRuleActivateEl = this.newElement.create('label', {'for': `${ruleData.id}_rule--activate`}, ["Active :", inputRuleActivateEl]);

        // rule__action
        return this.newElement.create("div", {"class": "rule__actions"}, [aDeleteEl, labelRuleActivateEl]);
    }

    ruleContentEl(ruleData) {
        //Label Injection choice + select + options
        const option1InjectionChoice = this.newElement.create('option', {'value': 'overrideRequest'}, 'Override Request');
        const option2InjectionChoice = this.newElement.create('option', {'value': 'injectCode'}, 'Inject code');
        const selectInjectionChoice = this.newElement.create('select', {'id': `${ruleData.id}_rule--injectionChoice`, "class": "rule--injectionChoice"}, [option1InjectionChoice, option2InjectionChoice]);
        selectInjectionChoice.value = ruleData.injectionChoice;
        const labelInjectionChoice = this.newElement.create('label', {'for': `${ruleData.id}_rule--injectionChoice`}, ["Injection Choice", selectInjectionChoice]);
        
        //Label ab regex + input
        const inputRulePagesRegex = this.newElement.create('input', {'id': `${ruleData.id}_rule--pagesRegex`, "class": "rule--pagesRegex","type":"text", "value": `${ruleData.pagesRegex}`});
        const labelRulePagesRegex = this.newElement.create('label', {'for': `${ruleData.id}_rule--pagesRegex`}, ["A/B Test Regex", inputRulePagesRegex]);
        
        //Label request regex + input
        const inputRuleRequestRegex = this.newElement.create('input', {'id': `${ruleData.id}_rule--requestRegex`, "class": "rule--requestRegex", "type":"text", "value": `${ruleData.requestRegex}`});
        const labelRuleRequestRegex = this.newElement.create('label', {'for': `${ruleData.id}_rule--requestRegex`}, ["Request Regex", inputRuleRequestRegex]);
        if(ruleData.injectionChoice === "injectCode") {
            // Hide regex Input if user selected InjectCode
            labelRuleRequestRegex.style.display = 'none';
        }

        //Label localhost URL + input
        const inputRuleLocalhostUrl = this.newElement.create('input', {'id': `${ruleData.id}_rule--localhostUrl`, "class": "rule--localhostUrl", "type":"text", "value": `${ruleData.localhostUrl}`});
        const labelRuleLocalhostUrl = this.newElement.create('label', {'for': `${ruleData.id}_rule--localhostUrl`}, ["A/B Test Localhost", inputRuleLocalhostUrl]);

        return this.newElement.create("div", {"class": "rule__content"}, [labelInjectionChoice, labelRulePagesRegex, labelRuleRequestRegex, labelRuleLocalhostUrl]);
    }


}
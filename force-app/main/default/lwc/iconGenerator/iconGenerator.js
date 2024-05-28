import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import generateIcon from "@salesforce/apex/iconGenerator.getQueryData";
export default class IconGenerator extends LightningElement {
    photoUrl;
    urlReceived = false;
    showSpinner = false;
    shape = 'round';
    primaryCol;
    secondaryCol;
    iconFor;
    showHideStyle = 'slds-hide';

    get options() {
        return [
            { label: 'Square', value: 'square' },
            { label: 'Round', value: 'round' }
        ];
    }

    async generateIcon(){
        try {
            const iconResult = await generateIcon(
                {icon: this.iconFor,
                primaryColor: this.primaryCol,
                secondaryColor: this.secondaryCol,
                shape:this.shape
                }
            );
            this.showHideStyle = 'imgClass';
            this.photoUrl = iconResult;
            this.urlReceived = true;
            this.showSpinner = false;
        }catch(error){
            console.log('error is '+error);
        } 
    }

    submitIcon(){
        var iconForCmp = this.template.querySelector('[data-id="iconFor"]');
        var iconForVal = iconForCmp.value;
        var primaryColCmp = this.template.querySelector('[data-id="primaryColor"]');
        var primaryColVal = primaryColCmp.value;
        var secondaryColCmp = this.template.querySelector('[data-id="secondaryColor"]');
        var secondaryColVal = secondaryColCmp.value;
        if(this.isEmptyCheck(iconForVal) || this.isEmptyCheck(primaryColVal) || this.isEmptyCheck(secondaryColVal)){
            this.showErrorToast();
        }
        else{
            this.primaryCol = primaryColVal;
            this.secondaryCol = secondaryColVal;
            this.iconFor = iconForVal;
            this.showHideStyle = 'slds-hide';
            this.urlReceived = false;
            this.showSpinner = true;
            this.generateIcon();
        }
    }

    handleChange(event) {
        this.shape = event.detail.value;
    }

    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Insufficient details',
            message: 'Please provide the details',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    isEmptyCheck(val){
        if(val == '' || val == null || val == undefined){
            return true;
        }
        return false;
    }

}
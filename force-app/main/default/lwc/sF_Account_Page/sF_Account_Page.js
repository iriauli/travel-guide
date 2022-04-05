import { LightningElement, wire } from 'lwc';
import getAccountDetails from '@salesforce/apex/SF_AccountController.getAccountDetails';
import updateAccount from '@salesforce/apex/SF_AccountController.updateAccount';

export default class SF_Account_Page extends LightningElement {
    editMode = true;
    changeButton = 'Update';
    wiredAccountData;
    name;
    phone;
    error;

    @wire(getAccountDetails)
    retrieveAccountData(retrieveAccountData) {
        const { data, error } = retrieveAccountData;
        this.wiredAccountData = retrieveAccountData;
        if (data) {
            this.name = data.Name;
            this.phone = data.Phone;
            this.email = data.Owner.Email;
        } else {
            this.error = error;
        }
    }

    // Check if input parameters are undefined
    hasNull(params) {
        return params.includes("");
    }

    // Save updated data to the database
    updateButton() {
        if (this.editMode === true) {
            this.editMode = false;
            this.changeButton = 'Save';
        } else if (this.editMode === false) {
            this.editMode = true;
            this.changeButton = 'Update';
            const inputField = [this.template.querySelector('[data-id=accName]').value,
            this.template.querySelector('[data-id=accPhone]').value];

            if (!this.hasNull(inputField)) {
                const inputParams = {
                    name: inputField[0],
                    phone: inputField[1]
                };
                updateAccount(inputParams).then(() => {
                    this.errorMessage = false;
                })
                    .catch(error => {
                        error.message;
                    });
            } else {
                this.editMode = false;
                this.changeButton = 'Save';
                this.errorMessage = false;
            }
        }
    }
}
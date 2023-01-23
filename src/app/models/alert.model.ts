//alert object class to modularize code and avoid repetition
export default class CustomAlert {
    private alertMsg: string = '';
    private alertColor: 'red' | 'green' | 'blue' = 'blue';
    private showAlert: boolean = false;
    private inSubmission: boolean = false;
    
    //quick function to set the values to what's desired with a normal color and then show it
    public setAlertNormal(
        alertMsg: string,
        needsInSubmission: boolean
        ) {
        this.alertMsg = alertMsg;
        this.alertColor = 'blue';
        this.showAlert = true;
        this.inSubmission = needsInSubmission;
    }

    public setAlertError(
        alertMsg: string,
    ) {
        this.alertMsg = alertMsg;
        this.alertColor = 'red';
        this.showAlert = true;
        this.inSubmission = false;
    }

    public setAlertSuccess(
        alertMsg: string,
        inSubmission?: boolean
    ) {
        this.alertMsg = alertMsg;
        this.alertColor = 'green';
        this.showAlert = true;
        this.inSubmission = inSubmission ?? false;
    }

    //quick method to set the showAlert off manually
    public setShowAlert(showAlert: boolean) {
        this.showAlert = showAlert
    }

    //getters to allow the template to check the different values

    public get gInSubmission() {
        return this.inSubmission;
    }

    public get gAlertMsg() {
        return this.alertMsg;
    }

    public get gAlertColor() {
        return this.alertColor;
    }

    public get gShowAlert() {
        return this.showAlert;
    }
}
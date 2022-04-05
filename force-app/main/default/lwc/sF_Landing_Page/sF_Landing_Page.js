import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import cityController from '@salesforce/apex/SF_PageController.cityController';


export default class SF_Landing_Page extends NavigationMixin(LightningElement) {
    loader;
    error;

    @wire(cityController) cities;

    // Redirect to city details page
    cityDetailsClick(event) {
        const cityId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'city/' + cityId
            }
        },
            true
        );
    }
}
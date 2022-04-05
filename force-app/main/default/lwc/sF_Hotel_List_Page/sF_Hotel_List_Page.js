import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getHotelByCityId from '@salesforce/apex/SF_PageController.getHotelByCityId';

export default class SF_Details_Page extends NavigationMixin(LightningElement) {
    @api recordId;

    @wire(getHotelByCityId, ({ cityId: '$recordId' }))
    hotels;

    // Redirect to hotel details page
    hotelDetailsClick(event) {
        const hotelId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'hotel/' + hotelId
            }
        },
            true
        );
    }
}
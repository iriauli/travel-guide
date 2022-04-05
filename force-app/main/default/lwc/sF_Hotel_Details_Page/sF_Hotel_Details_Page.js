import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getHotelById from '@salesforce/apex/SF_PageController.getHotelById';
import reserveHotel from '@salesforce/apex/SF_HotelController.reserveHotel';

export default class SF_Hotel_Details_Page extends NavigationMixin(LightningElement) {
    @api recordId;
    hotel;
    error;
    person = 1;
    room = 1;
    startdate;
    enddate;
    result;
    total;
    showErrorMessage = false;
    showSuccessMessage = false;

    navigateToBookingsPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/reserved-hotel'
            }
        },
            true
        );
    }

    //Retrieve hotel by id 
    @wire(getHotelById, ({ hotelId: '$recordId' }))
    retrieveHotels({ error, data }) {
        if (data) {
            this.hotel = data[0];
            this.error = undefined;
        } else {
            this.hotel = undefined;
            this.error = error;
        }
    }

    // Count days from calendar
    startDateHandler(event) {
        this.startdate = new Date(event.target.value);
    }

    endDateHandler(event) {
        this.enddate = new Date(event.target.value);
    }

    // Total price counter
    resultHandler() {
        this.result = this.enddate - this.startdate;
        this.result = parseInt(this.result / (1000 * 60 * 60 * 24));
        this.total = this.result * this.room * this.hotel.Price__c;
    }

    //Count persons 
    handleIncrementPerson() {
        this.person = this.person + 1;
    }
    handleDecrementPerson() {
        if (this.person > 1) {
            this.person = this.person - 1;
        }
    }

    //Count rooms
    handleIncrementRoom() {
        this.room = this.room + 1;
    }
    handleDecrementRoom() {
        if (this.room > 1) {
            this.room = this.room - 1;
        }
    }

    // Error & Success Messages
    closeErrorMessage() { this.showErrorMessage = false }
    closeSuccessMessage() { this.showSuccessMessage = false }

    // Reserve hotel
    async reserveHotelClick(event) {
        const hotelId = event.target.dataset.id;
        try {
            await reserveHotel({ hotelId: hotelId, startdate: this.startdate, enddate: this.enddate, person: this.person, room: this.room });
            this.showSuccessMessage = true,
                this.closeErrorMessage();
        }
        catch (error) {
            this.showErrorMessage = true,
                this.closeSuccessMessage();
        }
    }

}
import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import getReservedHotel from '@salesforce/apex/SF_PageController.getReservedHotel';
import cancelHotelReserve from '@salesforce/apex/SF_HotelController.cancelHotelReserve';
import updateReservedHotel from '@salesforce/apex/SF_HotelController.updateReservedHotel';

export default class SF_Reserved_Hotel_Page extends NavigationMixin(LightningElement) {
    editMode = true;
    buttonLabel = 'Edit';
    reshotels;
    startdate;
    enddate;
    showErrorMessage = false;

    @wire(getReservedHotel) reshotels;

    //Counts days from calendar
    startDateHandler(event) {
        this.startdate = new Date(event.target.value);
    }
    endDateHandleDr(event) {
        this.enddate = new Date(event.target.value);
    }

    // Error message
    closeErrorMessage() { this.showErrorMessage = false }

    // Update start & end dates
    async editReserve(event) { 
        try {
            if (this.editMode === true) {
                this.editMode = false;
                this.buttonLabel = 'Save';
            } else if (this.editMode === false) {
                const reshotelId = event.target.dataset.id;
                await updateReservedHotel({ reshotelId: reshotelId, startdate: this.startdate, enddate: this.enddate }).then(() => {
                    refreshApex(this.reshotels);
                })
                this.editMode = true;
                this.buttonLabel = 'Edit';
            }
        }
        catch (error) {
            this.showErrorMessage = true
        }
    }

    // Cancel modal
    cancelModal() {
        this.showModal();
        this.header = 'Attention!';
        this.text = 'Are you sure you want to cancel reservation?';
    }

    cancelReserve(event) {
        this.closeModal();
        const resHotelId = event.target.dataset.id;
        cancelHotelReserve({ resHotelId: resHotelId })
            .then(() => {
                refreshApex(this.reshotels)
            });
    }

    // Modal
    openModal = false;
    showModal() {
        this.openModal = true;
    }
    closeModal() {
        this.openModal = false;
    }
}
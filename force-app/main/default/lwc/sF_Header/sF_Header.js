import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SF_Header extends NavigationMixin(LightningElement) {

    navigateToHomePage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/'
            }
        },
            true
        );
    }

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

    navigateToAccount() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/account'
            }
        },
            true
        );
    }

}
/*
* ============================================
* @apexClassName: SF_PageController.cls
* @description: Class contains the logic of data display
* @author: Irakli Iriauli
* @email: irakliiriauli@makingscience.com
* @testClass: SF_PageControllerTest.cls
* @dateCreated: 24/03/2022
* @lastChange: 30/03/2022 by Irakli Iriauli
* ============================================
*/

public with sharing class SF_PageController {

    // @author: Irakli Iriauli  
    // @description: Get city names and images
    @AuraEnabled(cacheable=true)
    public static List<City__c> cityController() {
        return [SELECT Id, Name, Img__c FROM City__c LIMIT 12];
    }

    // @author: Irakli Iriauli   
    // @description: Get reserved hotel
    @AuraEnabled(cacheable=true)
    public static List<Reserved_Hotel__c> getReservedHotel() {
        return [SELECT Id, Name, Hotel_Name__c, Price__c, Start_Date__c, End_Date__c, Days__c, 
                Person__c, Room__c, Total_Price__c FROM Reserved_Hotel__c ORDER BY CreatedDate desc LIMIT 12];
    }

    // @author: Irakli Iriauli   
    // @description: Get Hotel by Id
    @AuraEnabled(cacheable=true)
    public static List<Hotel__c> getHotelById(Id hotelId) {
        return [SELECT Id, Name, Img__c, Price__c FROM Hotel__c WHERE Id=:hotelId];
    }

    // @author: Irakli Iriauli   
    // @description: Get Hotel by city id
    @AuraEnabled(cacheable=true)
    public static List<Hotel__c> getHotelByCityId(Id cityId) {
        return [SELECT Id, Name, Img__c, Price__c, City__r.Name FROM Hotel__c WHERE City__c =:cityId];
    }
}
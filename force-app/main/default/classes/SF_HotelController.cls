/*
* ============================================
* @apexClassName: SF_HotelController.cls
* @description: Class contains the logic of reserving hotel and canceling, updating reserved hotel dates, getting and updating account details, sending email after reserve.
* @author: L.Mikatsadze
* @email: l.mikatsadze@makingscience.com
* @testClass: SF_HotelControllerTest.cls
* @dateCreated: 25/03/2022
* @lastChange: 30/03/2022 by L.Mikatsadze
* ============================================
*/

public with sharing class SF_HotelController {

    // @author: L.Mikatsadze    
    // @description: Creates new reserved hotel or updates fields
    @AuraEnabled
    public static void reserveHotel(Id hotelId, Date startdate, Date enddate, Integer person, Integer room) {
        try {
            List<Account> acc = [SELECT Id FROM Account WHERE Id='0014H000048oPHkQAM'];
            List<Reserved_Hotel__c> reshotel = [SELECT Id, Hotel__c, Price__c, Start_Date__c, End_Date__c, Person__c, Room__c 
                                                FROM Reserved_Hotel__c WHERE Hotel__c =:hotelId AND Account__c =:acc[0].Id];
            if (reshotel.isEmpty()){
                List<Hotel__c> hotel = [SELECT Id, Name, Price__c FROM Hotel__c WHERE Id=:hotelId]; //subquery
                Reserved_Hotel__c newreshotel = new  Reserved_Hotel__c(
                Account__c = acc[0].Id,
                Hotel__c = hotelId,
                Price__c = hotel[0].Price__c,
                Start_Date__c = startdate,
                End_Date__c = enddate,
                Person__c = person,
                Room__c = room);
                                            
                insert newreshotel;    

                // Id reserveId = newreshotel.Id;
                // sendMail(reserveId); 

            } else if (reshotel[0].Start_Date__c == startdate && reshotel[0].End_Date__c == enddate) {
                reshotel[0].Room__c = room;
                reshotel[0].Person__c = person;

                update reshotel;

                // Id reserveId = reshotel[0].Id;
                // sendMail(reserveId); 
            }
            
            } catch (Exception e){
                throw new AuraHandledException(e.getMessage());
            }
    }
    
    // @author: L.Mikatsadze    
    // @description: Gets reserved hotel id and deletes
    @AuraEnabled
    public static void cancelHotelReserve(Id resHotelId){
        try {
            Reserved_Hotel__c cancelResHotel = new Reserved_Hotel__c(Id = resHotelId);
            
            delete cancelResHotel;  //Database.delete(deleteItem);
            
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    // @author: L.Mikatsadze    
    // @description: Updates reserved hotel details
    @AuraEnabled
    public static void updateReservedHotel(Id reshotelId, Date startdate, Date enddate) {
        try {
            List<Account> acc = [SELECT Id FROM Account WHERE Id='0014H000048oPHkQAM'];
            List<Reserved_Hotel__c> updatehotel = [SELECT Id, Name, Start_Date__c, End_Date__c FROM Reserved_Hotel__c
                                                                    WHERE Id=:reshotelId AND Account__c =:acc[0].Id];

            updatehotel[0].Start_Date__c = startdate;
            updatehotel[0].End_Date__c = enddate;

            update updatehotel;

            // Id reserveId = updatehotel[0].Id;
            // sendMail(reserveId); 
            
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    // @author: L.Mikatsadze    
    // @description: Sends email after booking hotel
    @future
    public static void sendMail(Id reserveId) {
        
        List<Reserved_Hotel__c> reserve = [SELECT Id, Name, Account__r.owner.email, Total_Price__c 
                                                FROM Reserved_Hotel__c WHERE Id=:reserveId LIMIT 1];

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {reserve[0].Account__r.owner.email};
        String subject = 'Your reserve #: ' + reserve[0].Name + ' was placed successfully.';
        String text = 'Total Price: ' + reserve[0].Total_Price__c + ' USD';                                                        
        mail.setToAddresses(toAddresses);
        mail.setSubject(subject);
        mail.setPlainTextBody(text);

        Messaging.sendEmail(new Messaging.SingleEmailMessage[]{mail});
    }
}
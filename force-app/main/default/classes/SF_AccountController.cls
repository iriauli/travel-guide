/*
* ============================================
* @apexClassName: SF_AccountController.cls
* @description: Class contains the logic of getting account details and updating.
* @author: L.Mikatsadze
* @email: l.mikatsadze@makingscience.com
* @testClass: SF_AccountControllerTest.cls
* @dateCreated: 26/03/2022
* @lastChange: 30/03/2022 by L.Mikatsadze
* ============================================
*/

public with sharing class SF_AccountController {

    // @author: L.Mikatsadze   
    // @description: Gets account details
    @AuraEnabled (cacheable=true)
    public static Account getAccountDetails() {
        Account[] account = [SELECT Id, Name, Phone, Account.owner.email FROM Account WHERE Id='0014H000048oPHkQAM'];
       	return account.isEmpty() ? null : account[0];
    }

    // @author: L.Mikatsadze    
    // @description: Updates account details
    @AuraEnabled
    public static void updateAccount(String name, String phone) {
        try {
            List<Account> acc = [SELECT Id FROM Account WHERE Id='0014H000048oPHkQAM'];

            Account newacc = new Account(
            Id = acc[0].Id,
            Name = name,
            Phone = phone);

            update newacc;
            
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
}
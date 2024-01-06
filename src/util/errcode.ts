export class CError extends Error {
    public code: number;
    constructor(code: number, name: string, message: string) {
        super(message);
        this.name = name;
        this.code = code;
    }
}

/**
 * code range : 
 * 10xxxx  =  errors related to user module
 * 11xxxx  =  errors related to product module
 * 12xxxx  =  errors related to inventory module
 * 13xxxx  =  errors related to order module
 * 14xxxx  =  errors related to payment module
 * 15xxxx  =  errors related to promotion module
 * 16xxxx  =  errors related to appointment module
 * 20xxxx  =  errors related to database
 * 21xxxx  =  errors related to network
 */

export const NotFoundAuthenRecord = new CError(100001, 'NotFoundAuthenRecord', 'Not found the record of authentication!');
export const NotFoundUserRecord = new CError(100002, 'NotFoundUserRecord', 'Not found the record of user!');

export const FailToVerifyToken = new CError(100010, 'FailToVerifyToken', 'Fail to verify token!');
export const FailToCreateLoginSessionRecord = new CError(100011, 'FailToCreateLoginSessionRecord', 'Fail to create login session db record!');
export const FailToCreateUser = new CError(100012, 'FailToCreateUser', 'Fail to create user!');
export const FailToInvalidateLoginSession = new CError(100013, 'FailToInvalidateLoginSession', 'Fail to invalidate login session!');

export const FailToCreateMerchant = new CError(101001, 'FailToCreateMerchant', 'Fail to create merchant record!');
export const NotFoundMerchant = new CError(101002, 'NotFoundMerchant', 'Not found the record of merchant!');

export const FailToCreateWorkshop = new CError(101001, 'FailToCreateWorkshop', 'Fail to create workshop record!');
export const NotFoundWorkshop = new CError(101002, 'NotFoundWorkshop', 'Not found the record of workshop!');

export class CError extends Error {
    public code: number;
	constructor(code : number, name : string, message : string) {
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

export const NotFoundAuthenRecord = new CError(100001, 'NotFoundAuthenRecord','Not found the record of authentication!');
export const FailToVerifyToken = new CError(100002, 'FailToVerifyToken','Fail to verify token!');
export const FailToCreateLoginSessionRecord = new CError(100003, 'FailToCreateLoginSessionRecord','Fail to create login session db record!');
export const FailToCreateUser = new CError(100004, 'FailToCreateUser','Fail to create user!');
export const FailToInvalidateLoginSession = new CError(100005, 'FailToInvalidateLoginSession','Fail to invalidate login session!');


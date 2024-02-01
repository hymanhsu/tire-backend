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

export const NotFoundCustomerAuthenRecord = new CError(100001, 'NotFoundCustomerAuthenRecord', 'Not found the record of authentication of customer!');
export const NotFoundUserAuthenRecord = new CError(100001, 'NotFoundUserAuthenRecord', 'Not found the record of authentication of user!');
export const NotFoundUserRecord = new CError(100002, 'NotFoundUserRecord', 'Not found the record of user!');
export const NotFoundUserRole = new CError(100002, 'NotFoundUserRole', 'Not found the role of user!');


export const FailToUpdateToken = new CError(100010, 'FailToUpdateToken', 'Fail to update token!');
export const FailToVerifyToken = new CError(100010, 'FailToVerifyToken', 'Fail to verify token!');
export const FailToCheckParam = new CError(100010, 'FailToCheckParam', 'Fail to check parameters!');

export const FailToCreateLoginSessionRecord = new CError(100011, 'FailToCreateLoginSessionRecord', 'Fail to create login session db record!');
export const FailToCreateUser = new CError(100012, 'FailToCreateUser', 'Fail to create user!');
export const FailToInvalidateLoginSession = new CError(100013, 'FailToInvalidateLoginSession', 'Fail to invalidate login session!');

export const FailToCreateMerchant = new CError(101001, 'FailToCreateMerchant', 'Fail to create merchant record!');
export const FailToDeleteMerchant = new CError(101001, 'FailToDeleteMerchant', 'Fail to delete merchant record!');
export const NotFoundMerchant = new CError(101002, 'NotFoundMerchant', 'Not found the record of merchant!');


export const FailToCreateWorkshop = new CError(101001, 'FailToCreateWorkshop', 'Fail to create workshop record!');
export const FailToDeleteWorkshop = new CError(101001, 'FailToDeleteWorkshop', 'Fail to delete workshop record!');
export const NotFoundWorkshop = new CError(101002, 'NotFoundWorkshop', 'Not found the record of workshop!');


export const FailToCreateCategory = new CError(101001, 'FailToCreateCategory', 'Fail to create category record!');
export const FailToDeleteCategory = new CError(101001, 'FailToDeleteCategory', 'Fail to delete category record!');
export const NotFoundCategories = new CError(101002, 'NotFoundCategories', 'Not found the record of category!');
export const ExceedCategoryMaxLevel = new CError(101002, 'ExceedCategoryMaxLevel', 'Exceed the max level of category!');
export const CannotRemoveCategoryWithChildren = new CError(101002, 'CannotRemoveCategoryWithChildren', 'Cannot remove the category with children!');

export const FailToCreateBrand = new CError(101001, 'FailToCreateBrand', 'Fail to create brand record!');
export const FailToDeleteBrand = new CError(101001, 'FailToDeleteBrand', 'Fail to delete brand record!');

export const FailToCreateAttrTemplate = new CError(101001, 'FailToCreateAttrTemplate', 'Fail to create attribute template record!');
export const FailToDeleteAttrTemplate = new CError(101001, 'FailToDeleteAttrTemplate', 'Fail to delete attribute template record!');
export const FailToCreateAttrTemplateDetail = new CError(101001, 'FailToCreateAttrTemplateDetail', 'Fail to create attribute template detail record!');
export const FailToDeleteAttrTemplateDetail = new CError(101001, 'FailToDeleteAttrTemplateDetail', 'Fail to delete attribute template detail record!');
export const DuplicatedAttrTemplateDetail = new CError(101002, 'DuplicatedAttrTemplateDetail', 'You can not redefine the same attribute!');


export const FailToCreateProduct = new CError(101001, 'FailToCreateProduct', 'Fail to create product record!');
export const FailToDeleteProduct = new CError(101001, 'FailToDeleteProduct', 'Fail to delete product record!');
export const FailToUpdateProduct = new CError(101001, 'FailToUpdateProduct', 'Fail to update product record!');

export const FailToFindProductAttrs = new CError(101001, 'FailToFindProductAttrs', 'Fail to find product attributes!');
export const FailToUpdateProductAttrs = new CError(101001, 'FailToUpdateProductAttrs', 'Fail to update product attributes!');


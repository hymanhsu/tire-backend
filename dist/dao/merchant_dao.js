var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Merchant DAO
 */
import { prisma } from '@App/util/dbwrapper';
import { FailToCreateMerchant, FailToCreateWorkshop, FailToDeleteMerchant, FailToDeleteWorkshop, NotFoundMerchant, NotFoundUserRecord, NotFoundWorkshop } from '@App/util/errcode';
import { generate_id } from '@App/util/genid';
/**
 * Create a merchant
 * @param nation
 * @param province
 * @param city
 * @param merchantSN
 * @param merchantName
 * @param introduction
 * @param websiteUrl
 * @param address
 * @param phoneNumber
 * @returns
 */
export function add_merchant(nation, province, city, merchantSN, merchantName, introduction, websiteUrl, address, phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const merchant = yield prisma.merchants.create({
                data: {
                    id: generate_id(),
                    nation: nation,
                    province: province,
                    city: city,
                    merchant_sn: merchantSN,
                    merchant_name: merchantName,
                    introduction: introduction,
                    website_url: websiteUrl,
                    address: address,
                    phone_number: phoneNumber,
                }
            });
            return Promise.resolve(merchant.id);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateMerchant);
        }
    });
}
export function remove_merchant(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const merchant = yield prisma.merchants.delete({
                where: {
                    id: id,
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToDeleteMerchant);
        }
    });
}
/**
 * Find a merchant by id
 * @param merchantId
 * @returns
 */
export function find_merchant_by_id(merchantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const merchant = yield prisma.merchants.findUnique({
                where: {
                    id: merchantId
                }
            });
            return new Promise((resolve, reject) => {
                if (merchant == null) {
                    reject(NotFoundMerchant);
                }
                else {
                    resolve(merchant);
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundMerchant);
        }
    });
}
/**
 * Find all merchants
 * @returns
 */
export function find_merchants() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const merchants = yield prisma.merchants.findMany({
                orderBy: { c_at: 'desc' }
            });
            return Promise.resolve(merchants);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundWorkshop);
        }
    });
}
/**
 * Find all merchant owners
 * @param merchantId
 * @returns
 */
export function find_all_merchant_owners(merchantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userInfos = yield prisma.$queryRawUnsafe('SELECT u.*  FROM u_users u, merchant_members mm ' +
                'WHERE u.id = mm.user_id  ' +
                'AND mm.role = \'MERT\' ' +
                'AND mm.merchant_id = $1 ' +
                'ORDER BY u.c_at DESC', merchantId);
            return Promise.resolve(userInfos);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundUserRecord);
        }
    });
}
/**
 * Create a workshop
 * @param merchantId
 * @param workshopSN
 * @param workshopName
 * @param introduction
 * @param address
 * @param phoneNumber
 * @param latitude
 * @param longitude
 * @returns
 */
export function add_workshop(merchantId, workshopSN, workshopName, introduction, address, phoneNumber, latitude, longitude) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const workshop = yield prisma.merchant_workshops.create({
                data: {
                    id: generate_id(),
                    merchant_id: merchantId,
                    workshop_sn: workshopSN,
                    workshop_name: workshopName,
                    introduction: introduction,
                    address: address,
                    phone_number: phoneNumber,
                    latitude: latitude,
                    longitude: longitude
                }
            });
            return Promise.resolve(workshop.id);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateWorkshop);
        }
    });
}
export function remove_workshop(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const merchant = yield prisma.merchant_workshops.delete({
                where: {
                    id: id,
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToDeleteWorkshop);
        }
    });
}
/**
 * Find a workshop by id
 * @param workshopId
 * @returns
 */
export function find_workshop_by_id(workshopId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const workshop = yield prisma.merchant_workshops.findUnique({
                where: {
                    id: workshopId
                }
            });
            return new Promise((resolve, reject) => {
                if (workshop == null) {
                    reject(NotFoundWorkshop);
                }
                else {
                    resolve(workshop);
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundWorkshop);
        }
    });
}
/**
 * Find workshop list by merchant
 * @param merchantId
 * @returns
 */
export function find_workshops_by_merchant(merchantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const workshops = yield prisma.merchant_workshops.findMany({
                where: {
                    merchant_id: merchantId
                },
                orderBy: {
                    c_at: 'desc'
                }
            });
            return Promise.resolve(workshops);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundWorkshop);
        }
    });
}
/**
 * Find members of merchant
 * @param merchantId
 * @returns
 */
export function find_members_by_merchant(merchantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userInfos = yield prisma.$queryRawUnsafe('SELECT u.*  FROM u_users u ' +
                'WHERE u.id IN ' +
                '(SELECT m.user_id from merchant_members m WHERE ' +
                'm.merchant_id = $1 ) ORDER BY u.c_at DESC', merchantId);
            return new Promise((resolve, reject) => {
                if (userInfos == undefined || userInfos.length == 0) {
                    resolve([]);
                }
                else {
                    resolve(userInfos);
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.resolve([]);
        }
    });
}
export function find_members_by_workshop(merchantId, workshopId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userInfos = yield prisma.$queryRawUnsafe('SELECT u.*, mm.role  FROM u_users u, merchant_members mm ' +
                'WHERE u.id = mm.user_id ' +
                'AND mm.merchant_id = $1 AND mm.workshop_id = $2 ' +
                'ORDER BY u.c_at DESC', merchantId, workshopId);
            return new Promise((resolve, reject) => {
                if (userInfos == undefined || userInfos.length == 0) {
                    resolve([]);
                }
                else {
                    resolve(userInfos);
                }
            });
        }
        catch (error) {
            console.error(error);
            return Promise.resolve([]);
        }
    });
}
export function add_member_to_workshop(merchantId, workshopId, userId, role) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const member = yield prisma.merchant_members.findFirst({
                where: {
                    merchant_id: merchantId,
                    workshop_id: workshopId,
                    user_id: userId,
                    role: role,
                }
            });
            if (member != null) {
                // have defined before
                return Promise.resolve();
            }
            const memberCreated = yield prisma.merchant_members.create({
                data: {
                    id: generate_id(),
                    user_id: userId,
                    role: role,
                    merchant_id: merchantId,
                    workshop_id: workshopId,
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    });
}
export function remove_member_from_workshop(merchantId, workshopId, userId, role) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const member = yield prisma.merchant_members.findFirst({
                where: {
                    merchant_id: merchantId,
                    workshop_id: workshopId,
                    user_id: userId,
                    role: role,
                }
            });
            if (member == null) {
                // have not defined before
                return Promise.resolve();
            }
            const count = yield prisma.merchant_members.deleteMany({
                where: {
                    merchant_id: merchantId,
                    workshop_id: workshopId,
                    user_id: userId,
                    role: role,
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    });
}

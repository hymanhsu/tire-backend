/**
 * Merchant DAO
 */
import { merchants, merchant_workshops, merchant_members, u_users } from '@prisma/client';
import { prisma } from '../util/dbwrapper.js';
import {
    FailToCreateMerchant, FailToCreateWorkshop, FailToDeleteMerchant,
    FailToDeleteWorkshop, NotFoundMerchant, NotFoundUserRecord, NotFoundWorkshop
} from '../util/errcode.js';
import { generate_id } from '../util/genid.js';


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
export async function add_merchant(nation: string, province: string, city: string, merchantSN: string,
    merchantName: string, introduction: string, websiteUrl: string, address: string, phoneNumber: string): Promise<string> {
    try {
        const merchant = await prisma.merchants.create({
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
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateMerchant);
    }
}

export async function remove_merchant(id: string): Promise<void> {
    try {
        const merchant = await prisma.merchants.delete({
            where: {
                id: id,
            }
        });
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToDeleteMerchant);
    }
}


/**
 * Find a merchant by id
 * @param merchantId 
 * @returns 
 */
export async function find_merchant_by_id(merchantId: string): Promise<merchants> {
    try {
        const merchant: merchants | null = await prisma.merchants.findUnique({
            where: {
                id: merchantId
            }
        });
        return new Promise((resolve, reject) => {
            if (merchant == null) {
                reject(NotFoundMerchant);
            } else {
                resolve(merchant);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundMerchant);
    }
}


/**
 * Find all merchants
 * @returns 
 */
export async function find_merchants(): Promise<merchants[]> {
    try {
        const merchants: merchants[] = await prisma.merchants.findMany({
            orderBy: { c_at: 'desc' }
        });
        return Promise.resolve(merchants);
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundWorkshop);
    }
}

/**
 * Find all merchant owners
 * @param merchantId 
 * @returns 
 */
export async function find_all_merchant_owners(merchantId: string): Promise<u_users[]> {
    try {
        const userInfos: u_users[] = await prisma.$queryRawUnsafe(
            'SELECT u.*  FROM u_users u, merchant_members mm ' +
            'WHERE u.id = mm.user_id  ' +
            'AND mm.role = \'MERT\' ' +
            'AND mm.merchant_id = $1 ' +
            'ORDER BY u.c_at DESC',
            merchantId
        );
        return Promise.resolve(userInfos);
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundUserRecord);
    }
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
export async function add_workshop(merchantId: string, workshopSN: string, workshopName: string, introduction: string,
    address: string, phoneNumber: string, latitude: string, longitude: string): Promise<string> {
    try {
        const workshop = await prisma.merchant_workshops.create({
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
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateWorkshop);
    }
}


export async function remove_workshop(id: string): Promise<void> {
    try {
        const merchant = await prisma.merchant_workshops.delete({
            where: {
                id: id,
            }
        });
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToDeleteWorkshop);
    }
}


/**
 * Find a workshop by id
 * @param workshopId 
 * @returns 
 */
export async function find_workshop_by_id(workshopId: string): Promise<merchant_workshops> {
    try {
        const workshop: merchant_workshops | null = await prisma.merchant_workshops.findUnique({
            where: {
                id: workshopId
            }
        });
        return new Promise((resolve, reject) => {
            if (workshop == null) {
                reject(NotFoundWorkshop);
            } else {
                resolve(workshop);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundWorkshop);
    }
}


/**
 * Find workshop list by merchant
 * @param merchantId 
 * @returns 
 */
export async function find_workshops_by_merchant(merchantId: string): Promise<merchant_workshops[]> {
    try {
        const workshops: merchant_workshops[] = await prisma.merchant_workshops.findMany({
            where: {
                merchant_id: merchantId
            },
            orderBy: {
                c_at: 'desc'
            }
        });
        return Promise.resolve(workshops);
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundWorkshop);
    }
}


/**
 * Find members of merchant
 * @param merchantId 
 * @returns 
 */
export async function find_members_by_merchant(merchantId: string): Promise<u_users[]> {
    try {
        const userInfos: u_users[] = await prisma.$queryRawUnsafe(
            'SELECT u.*  FROM u_users u ' +
            'WHERE u.id IN ' +
            '(SELECT m.user_id from merchant_members m WHERE ' +
            'm.merchant_id = $1 ) ORDER BY u.c_at DESC',
            merchantId
        );
        return new Promise((resolve, reject) => {
            if (userInfos == undefined || userInfos.length == 0) {
                resolve([]);
            } else {
                resolve(userInfos);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
}

export type u_users_with_role = u_users & {
    role: string
};

export async function find_members_by_workshop(merchantId: string, workshopId: string): Promise<u_users_with_role[]> {
    try {
        const userInfos: u_users_with_role[] = await prisma.$queryRawUnsafe(
            'SELECT u.*, mm.role  FROM u_users u, merchant_members mm ' +
            'WHERE u.id = mm.user_id ' +
            'AND mm.merchant_id = $1 AND mm.workshop_id = $2 ' +
            'ORDER BY u.c_at DESC',
            merchantId, workshopId
        );
        return new Promise((resolve, reject) => {
            if (userInfos == undefined || userInfos.length == 0) {
                resolve([]);
            } else {
                resolve(userInfos);
            }
        });
    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
}

export async function add_member_to_workshop(merchantId: string, workshopId: string, userId: string, role: string): Promise<void> {
    try {
        const member: merchant_members | null = await prisma.merchant_members.findFirst({
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
        const memberCreated = await prisma.merchant_members.create({
            data: {
                id: generate_id(),
                user_id: userId,
                role: role,
                merchant_id: merchantId,
                workshop_id: workshopId,
            }
        });
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}


export async function remove_member_from_workshop(merchantId: string, workshopId: string, userId: string, role: string): Promise<void> {
    try {
        const member: merchant_members | null = await prisma.merchant_members.findFirst({
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
        const count = await prisma.merchant_members.deleteMany({
            where: {
                merchant_id: merchantId,
                workshop_id: workshopId,
                user_id: userId,
                role: role,
            }
        });
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}


/**
 * Merchant DAO
 */
import { prisma } from '@App/util/dbwrapper';
import { FailToCreateMerchant, FailToCreateWorkshop, NotFoundMerchant, NotFoundWorkshop } from '@App/util/errcode';
import { generate_id } from '@App/util/genid';
import { merchants, merchant_workshops } from '@prisma/client';

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
export async function createMerchant(nation:string, province:string, city:string, merchantSN:string, 
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


export type Merchant = {
    id: string
    nation: string | null
    province: string | null
    city: string | null
    merchant_sn: string | null
    merchant_name: string | null
    introduction: string | null
    website_url: string | null
    address: string | null
    phone_number: string | null
    invalid: boolean | null
    c_at: Date | null
    u_at: Date | null
};

/**
 * Find a merchant by id
 * @param merchantId 
 * @returns 
 */
export async function findMerchantById(merchantId: string): Promise<Merchant> {
    try {
        const merchant: Merchant | null = await prisma.merchants.findUnique({
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
export async function createWorkshop(merchantId:string, workshopSN:string, workshopName: string, introduction: string, 
    address: string, phoneNumber: string, latitude:string, longitude:string): Promise<string> {
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


export type Worhshop = {
    id: string
    merchant_id: string | null
    workshop_sn: string | null
    workshop_name: string | null
    introduction: string | null
    address: string | null
    phone_number: string | null
    latitude: string | null
    longitude: string | null
    invalid: boolean | null
    c_at: Date | null
    u_at: Date | null
};


/**
 * Find a workshop by id
 * @param workshopId 
 * @returns 
 */
export async function findWorkshopById(workshopId: string): Promise<Worhshop> {
    try {
        const workshop: Worhshop | null = await prisma.merchant_workshops.findUnique({
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
export async function findWorkshopsByMerchant(merchantId: string): Promise<Worhshop[]> {
    try {
        const workshops: Worhshop[] = await prisma.merchant_workshops.findMany({
            where: {
                merchant_id: merchantId
            }
        });
        return Promise.resolve(workshops);
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundWorkshop);
    }
}



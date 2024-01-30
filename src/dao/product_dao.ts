/**
 * Product DAO
 */
import { GeneralObject } from '@App/util/constants';
import { prisma } from '@App/util/dbwrapper';
import {
    CannotRemoveCategoryWithChildren, DuplicatedAttrTemplateDetail, ExceedCategoryMaxLevel, FailToCreateAttrTemplate, FailToCreateBrand,
    FailToCreateCategory, FailToCreateProduct, FailToDeleteAttrTemplate, FailToDeleteBrand, FailToDeleteCategory, FailToDeleteProduct, FailToFindProductAttrs, FailToUpdateProduct, FailToUpdateProductAttrs, NotFoundCategories
} from '@App/util/errcode';
import { generate_id, generate_pretty_id } from '@App/util/genid';
import {
    p_categories, p_brands,
    p_attr_templates, p_attr_template_details, p_products, p_product_attrs
} from '@prisma/client';


export type p_categories_tree_node = {
    id: string,
    parent: string | null,
    label: string | null,
    priority: number | null,
    level: number | null,
    nodes?: p_categories_tree_node[]
};

/**
 * Find all categories by level
 * @returns 
 */
export async function find_all_categories(): Promise<p_categories_tree_node[]> {
    const queryCategories = (categories: p_categories[], level: number, parentId?: string): p_categories[] => {
        const filter: p_categories[] = [];
        for (const element of categories) {
            if (element.level == level) {
                if (parentId == undefined) {
                    filter.push(element);
                } else {
                    if (element.parent_category_id == parentId) {
                        filter.push(element);
                    }
                }
            }
        }
        return filter;
    }
    try {
        const categories: p_categories[] = await prisma.$queryRawUnsafe(
            'SELECT c.* FROM p_categories c ORDER BY c.level ASC, c.priority ASC'
        );
        const firstLevelResult: p_categories_tree_node[] = [];
        // read level 1, level 2, level 3 by order
        const firstLevels = queryCategories(categories, 1);
        for (const ele of firstLevels) {
            const secondLevels = queryCategories(categories, 2, ele.id);
            const secondLevelResult: p_categories_tree_node[] = [];
            for (const secondEle of secondLevels) {
                const thirdLevels = queryCategories(categories, 3, secondEle.id);
                const thirdLevelResult: p_categories_tree_node[] = [];
                for (const thirdEle of thirdLevels) {
                    thirdLevelResult.push({
                        id: thirdEle.id,
                        parent: thirdEle.parent_category_id,
                        label: thirdEle.title,
                        priority: thirdEle.priority,
                        level: thirdEle.level,
                    });
                }
                if (thirdLevelResult.length == 0) {
                    secondLevelResult.push({
                        id: secondEle.id,
                        parent: secondEle.parent_category_id,
                        label: secondEle.title,
                        priority: secondEle.priority,
                        level: secondEle.level,
                    });
                } else {
                    secondLevelResult.push({
                        id: secondEle.id,
                        parent: secondEle.parent_category_id,
                        label: secondEle.title,
                        priority: secondEle.priority,
                        level: secondEle.level,
                        nodes: thirdLevelResult,
                    });
                }
            }
            if (secondLevelResult.length == 0) {
                firstLevelResult.push({
                    id: ele.id,
                    parent: ele.parent_category_id,
                    label: ele.title,
                    priority: ele.priority,
                    level: ele.level,
                });
            } else {
                firstLevelResult.push({
                    id: ele.id,
                    parent: ele.parent_category_id,
                    label: ele.title,
                    priority: ele.priority,
                    level: ele.level,
                    nodes: secondLevelResult,
                });
            }
        }
        return Promise.resolve(firstLevelResult);
    } catch (error) {
        console.error(error);
        return Promise.reject(NotFoundCategories);
    }
}


/**
 * Create category
 * @param level 
 * @param priority 
 * @param title 
 * @param introduction 
 * @param parentCategoryId 
 * @returns 
 */
export async function add_category(level: number, priority: number, title: string,
    introduction: string, parentCategoryId: string): Promise<string> {
    if (level > 3) {
        return Promise.reject(ExceedCategoryMaxLevel);
    }
    try {
        const category = await prisma.p_categories.create({
            data: {
                id: generate_pretty_id(3),
                parent_category_id: (parentCategoryId == null || parentCategoryId == "") ? null : parentCategoryId,
                level: level,
                priority: priority,
                title: title,
                introduction: introduction,
            }
        });
        return Promise.resolve(category.id);
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateCategory);
    }
}

/**
 * Remove category
 * @param categoryId 
 * @returns 
 */
export async function remove_category(categoryId: string): Promise<void> {
    try {
        // check if catetory is used by products
        const childrenCategories: p_categories[] = await prisma.p_categories.findMany({
            where: {
                parent_category_id: categoryId,
            }
        });
        if (childrenCategories.length > 0) {
            return Promise.reject(CannotRemoveCategoryWithChildren);
        }
        //need to check if category has been used in the p_products
        const products: p_products[] = await prisma.p_products.findMany({
            where: {
                category_id: categoryId,
            }
        });
        if(products.length > 0){
            return Promise.reject(FailToDeleteCategory);
        }
        await prisma.p_categories.delete({
            where: {
                id: categoryId,
            }
        });
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToDeleteCategory);
    }
}

/**
 * Find all brands
 * @returns 
 */
export async function find_all_brands(): Promise<p_brands[]> {
    try {
        const brands: p_brands[] = await prisma.p_brands.findMany({
            orderBy: [
                { brand: 'asc' },
                { c_at: 'desc' },
            ]
        });
        return Promise.resolve(brands);
    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
}


/**
 * Create brand
 * @param brand 
 * @param grade 
 * @param holder 
 * @param introduction 
 * @returns 
 */
export async function add_brand(brand: string, grade: number, holder: string,
    introduction: string): Promise<string> {
    try {
        const created = await prisma.p_brands.create({
            data: {
                id: generate_pretty_id(5),
                brand: brand,
                grade: grade,
                holder: holder,
                introduction: introduction,
            }
        });
        return Promise.resolve(created.id);
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateBrand);
    }
}


/**
 * Remove brand
 * @param brandId 
 * @returns 
 */
export async function remove_brand(brandId: string): Promise<void> {
    try {
        //need to check if category has been used in the p_products
        const products: p_products[] = await prisma.p_products.findMany({
            where: {
                brand_id: brandId,
            }
        });
        if(products.length > 0){
            return Promise.reject(FailToDeleteBrand);
        }
        await prisma.p_brands.delete({
            where: {
                id: brandId,
            }
        });
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToDeleteBrand);
    }
}

/**
 * Find all attribute templates
 * @returns 
 */
export async function find_all_attr_templates(merchantId: string, type?: string): Promise<p_attr_templates[]> {
    try {
        let templates: p_attr_templates[] = [];
        if (type == undefined) {
            templates = await prisma.p_attr_templates.findMany({
                where: {
                    merchant_id : merchantId,
                },
                orderBy: [
                    { c_at: 'desc' },
                ]
            });
        }else{
            templates = await prisma.p_attr_templates.findMany({
                where: {
                    merchant_id : merchantId,
                    template_type : type,
                },
                orderBy: [
                    { c_at: 'desc' },
                ]
            });
        }
        return Promise.resolve(templates);
    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
}

export async function find_all_attr_template_details(attrTemplId: string): Promise<p_attr_template_details[]> {
    try {
        const details: p_attr_template_details[] = await prisma.p_attr_template_details.findMany({
            where: {
                attr_templ_id : attrTemplId,
            },
            orderBy: [
                { title: 'asc' },
            ]
        });
        return Promise.resolve(details);
    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
}

/**
 * Add a attribute template
 * @param templateName 
 * @param templateType 
 * @param description 
 * @returns 
 */
export async function add_attr_template(merchantId: string, templateName: string, templateType: string, 
    description: string): Promise<string> {
    try {
        const created = await prisma.p_attr_templates.create({
            data: {
                id: generate_id(),
                merchant_id: merchantId,
                template_name: templateName,
                template_type: templateType,
                description: description,
            }
        });
        return Promise.resolve(created.id);
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateAttrTemplate);
    }
}

export async function add_attr_template_detail(attrTemplId: string, attrName: string, attrType: string,
    paramName: string, title: string, description: string): Promise<string> {
    try {
        const details: p_attr_template_details| null = await prisma.p_attr_template_details.findFirst({
            where: {
                attr_templ_id : attrTemplId,
                attr_name : attrName,
            },
        });
        if(details != null){
            return Promise.reject(DuplicatedAttrTemplateDetail);
        }
        const created = await prisma.p_attr_template_details.create({
            data: {
                id: generate_id(),
                attr_templ_id: attrTemplId,
                attr_name: attrName,
                attr_type: attrType,
                param_name: paramName,
                title: title,
                description: description,
            }
        });
        return Promise.resolve(created.id);
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateAttrTemplate);
    }
}

/**
 * Remove attribute template
 * @param templateId 
 * @returns 
 */
export async function remove_attr_template(templateId: string): Promise<void> {
    try {
        //need to check if category has been used in the p_products
        const products: p_products[] = await prisma.p_products.findMany({
            where: {
                attr_templ_id: templateId,
            }
        });
        if(products.length > 0){
            return Promise.reject(FailToDeleteAttrTemplate);
        }
        return await prisma.$transaction(async (tx): Promise<void> => {
            // delete defines of attr template 
            const deleted = await tx.p_attr_template_details.deleteMany({
                where: {
                    attr_templ_id: templateId,
                }
            });
            // delete attr template
            const deleted2 = await tx.p_attr_templates.delete({
                where: {
                    id: templateId,
                }
            });
            return Promise.resolve();
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToDeleteAttrTemplate);
    }
}

export async function remove_attr_template_detail(attrTemplDetailId: string): Promise<void> {
    try {
        await prisma.p_attr_template_details.delete({
            where: {
                id: attrTemplDetailId,
            }
        });
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToDeleteBrand);
    }
}

export type p_products_ext = p_products & {
    category_title: string,
    brand: string | null,
    attr_templ_title: string | null,
};

export async function find_all_products(merchantId: string): Promise<p_products_ext[]> {
    try {
        const products: p_products_ext[] = await prisma.$queryRawUnsafe(
            'SELECT p.*, c.title as category_title, b.brand, at.template_name as attr_templ_title ' +
            'FROM p_products p, p_categories c, p_brands b, p_attr_templates at ' +
            'WHERE p.category_id = c.id AND p.brand_id = b.id AND p.attr_templ_id = at.id ' +
            'AND p.invalid = FALSE AND p.merchant_id = $1 '+
            'ORDER BY p.c_at DESC',
            merchantId,
        );
        return Promise.resolve(products);
    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
}


export async function add_product(merchantId: string, spuName: string, categoryId: string, brandId: string, 
    attrTemplId: string, title: string, description: string): Promise<string> {
    try {
        return await prisma.$transaction(async (tx): Promise<string> => {
            const created = await tx.p_products.create({
                data: {
                    id: generate_id(),
                    merchant_id: merchantId,
                    spu_name: spuName,
                    category_id: categoryId,
                    brand_id: brandId,
                    attr_templ_id: attrTemplId,
                    status: 'INITIAL',
                    title: title,
                    description: description,
                }
            });
            // add new blank attributes record
            await tx.p_product_attrs.create({
                data: {
                    id: generate_id(),
                    product_id: created.id,
                }
            });
            return Promise.resolve(created.id);
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToCreateProduct);
    }
}


export async function remove_product(productId: string): Promise<void> {
    try {
        return await prisma.$transaction(async (tx): Promise<void> => {
            await tx.p_products.delete({
                where: {
                    id: productId,
                }
            });
            // delete attributes
            await tx.p_product_attrs.deleteMany({
                where: {
                    product_id: productId,
                }
            });
            return Promise.resolve();
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToDeleteProduct);
    }
}


export async function update_product_status(productId: string, status: string): Promise<void> {
    try {
        await prisma.p_products.update({
            data: {
                status: status,
            },
            where: {
                id: productId,
            }
        });
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToUpdateProduct);
    }
}


export type p_attr_template_details_ext = p_attr_template_details & {
    attr_value: string | null,
};

export async function find_product_attrs(productId: string): Promise<p_attr_template_details_ext[]> {
    try {
        const attrsRecs: GeneralObject[] = await prisma.$queryRawUnsafe(
            'SELECT * ' + 
            'FROM p_product_attrs ' + 
            'WHERE product_id = $1',
            productId,
        );
        if(attrsRecs.length == 0){
            return Promise.reject(FailToFindProductAttrs);
        }
        const attrs = attrsRecs[0];
        // console.log(JSON.stringify(attrs));
        // const attrsJson = JSON.stringify(attrs);
        // const product_attrs = JSON.parse(attrsJson);
        const templ_records: p_attr_template_details[] = await prisma.$queryRawUnsafe(
            'SELECT ptd.* ' + 
            'FROM p_products p, p_attr_template_details ptd ' + 
            'WHERE p.id = $1 AND p.attr_templ_id = ptd.attr_templ_id ' +
            'ORDER BY ptd.title ASC',
            productId,
        );
        const result : p_attr_template_details_ext[] = [];
        for(let i = 0; i < templ_records.length; i++){
            const item = templ_records[i];
            const attrName = item.attr_name as string;
            const value : string | null = attrs[attrName];
            result.push({
                ...item,
                attr_value: (value==null)?"":value,
            });
        }
        return Promise.resolve(result);
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToFindProductAttrs);
    }
}


export type p_product_attrs_simple = {
    attr_short_01: string | undefined
    attr_short_02: string | undefined
    attr_short_03: string | undefined
    attr_short_04: string | undefined
    attr_short_05: string | undefined
    attr_short_06: string | undefined
    attr_short_07: string | undefined
    attr_short_08: string | undefined
    attr_short_09: string | undefined
    attr_short_10: string | undefined
    attr_short_11: string | undefined
    attr_short_12: string | undefined
    attr_short_13: string | undefined
    attr_short_14: string | undefined
    attr_short_15: string | undefined
    attr_short_16: string | undefined
    attr_short_17: string | undefined
    attr_short_18: string | undefined
    attr_short_19: string | undefined
    attr_short_20: string | undefined
    attr_medium_01: string | undefined
    attr_medium_02: string | undefined
    attr_medium_03: string | undefined
    attr_medium_04: string | undefined
    attr_medium_05: string | undefined
    attr_medium_06: string | undefined
    attr_medium_07: string | undefined
    attr_medium_08: string | undefined
    attr_medium_09: string | undefined
    attr_medium_10: string | undefined
    attr_long_01: string | undefined
    attr_long_02: string | undefined
    attr_long_03: string | undefined
    attr_long_04: string | undefined
    attr_long_05: string | undefined
}

export async function update_product_attrs(productId: string, attrs: p_product_attrs_simple): Promise<void> {
    try {
        let setSQL = "";
        let setValues : string[]  = [];
        let index = 1;
        const attrsJson = JSON.stringify(attrs);
        const product_attrs = JSON.parse(attrsJson);
        const concatAttr = (attrName:string) => {
            if(product_attrs[attrName] != undefined){
                setSQL += attrName+"=$"+index+",";
                setValues.push(product_attrs[attrName]);
                index++;
            }
        }
        concatAttr('attr_short_01');
        concatAttr('attr_short_02');
        concatAttr('attr_short_03');
        concatAttr('attr_short_04');
        concatAttr('attr_short_05');
        concatAttr('attr_short_06');
        concatAttr('attr_short_07');
        concatAttr('attr_short_08');
        concatAttr('attr_short_09');
        concatAttr('attr_short_10');
        concatAttr('attr_short_11');
        concatAttr('attr_short_12');
        concatAttr('attr_short_13');
        concatAttr('attr_short_14');
        concatAttr('attr_short_15');
        concatAttr('attr_short_16');
        concatAttr('attr_short_17');
        concatAttr('attr_short_18');
        concatAttr('attr_short_19');
        concatAttr('attr_short_20');
        concatAttr('attr_medium_01');
        concatAttr('attr_medium_02');
        concatAttr('attr_medium_03');
        concatAttr('attr_medium_04');
        concatAttr('attr_medium_05');
        concatAttr('attr_medium_06');
        concatAttr('attr_medium_07');
        concatAttr('attr_medium_08');
        concatAttr('attr_medium_09');
        concatAttr('attr_medium_10');
        concatAttr('attr_long_01');
        concatAttr('attr_long_02');
        concatAttr('attr_long_03');
        concatAttr('attr_long_04');
        concatAttr('attr_long_05');
        if(setSQL == ""){
            // DO NOTHING
            return Promise.resolve();
        }
        if(setSQL.endsWith(",")){
            setSQL = setSQL.substring(0, setSQL.length-1);
        }
        setValues.push(productId);
        const sql = "UPDATE p_product_attrs SET " + setSQL + " WHERE product_id=$"+index;
        // console.log(sql);
        // console.log(JSON.stringify(setValues));
        await prisma.$executeRawUnsafe(sql, ...setValues);
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(FailToUpdateProductAttrs);
    }
}



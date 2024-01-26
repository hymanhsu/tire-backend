/**
 * Product DAO
 */
import { prisma } from '@App/util/dbwrapper';
import {
    CannotRemoveCategoryWithChildren, ExceedCategoryMaxLevel, FailToCreateAttrTemplate, FailToCreateBrand,
    FailToCreateCategory, FailToDeleteAttrTemplate, FailToDeleteBrand, FailToDeleteCategory, NotFoundCategories
} from '@App/util/errcode';
import { generate_id, generate_pretty_id } from '@App/util/genid';
import {
    p_categories, p_brands,
    p_attr_templates, p_attr_template_details, p_products
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
export async function find_all_attr_templates(merchantId: string): Promise<p_attr_templates[]> {
    try {
        const templates: p_attr_templates[] = await prisma.p_attr_templates.findMany({
            where: {
                merchant_id : merchantId,
            },
            orderBy: [
                { c_at: 'desc' },
            ]
        });
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



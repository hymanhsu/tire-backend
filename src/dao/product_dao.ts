/**
 * Product DAO
 */
import { prisma } from '@App/util/dbwrapper';
import { CannotRemoveCategoryWithChildren, ExceedCategoryMaxLevel, FailToCreateCategory, FailToDeleteCategory, NotFoundCategories } from '@App/util/errcode';
import { generate_pretty_id } from '@App/util/genid';
import { p_categories } from '@prisma/client';


export type p_categories_tree_node = p_categories & {
    children?: p_categories_tree_node[]
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
                        ...thirdEle,
                    });
                }
                if (thirdLevelResult.length == 0) {
                    secondLevelResult.push({
                        ...secondEle,
                    });
                } else {
                    secondLevelResult.push({
                        ...secondEle,
                        children: thirdLevelResult,
                    });
                }
            }
            if (secondLevelResult.length == 0) {
                firstLevelResult.push({
                    ...ele,
                });
            } else {
                firstLevelResult.push({
                    ...ele,
                    children: secondLevelResult,
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
        const childrenCategories : p_categories[] = await prisma.p_categories.findMany({
            where: {
                parent_category_id: categoryId,
            }
        });
        if(childrenCategories.length > 0){
            return Promise.reject(CannotRemoveCategoryWithChildren);
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


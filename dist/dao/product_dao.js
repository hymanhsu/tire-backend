var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from '../util/dbwrapper.js';
import { CannotRemoveCategoryWithChildren, DuplicatedAttrTemplateDetail, ExceedCategoryMaxLevel, FailToCreateAttrTemplate, FailToCreateBrand, FailToCreateCategory, FailToCreateProduct, FailToDeleteAttrTemplate, FailToDeleteBrand, FailToDeleteCategory, FailToDeleteProduct, FailToFindProductAttrs, FailToUpdateProduct, FailToUpdateProductAttrs, NotFoundCategories } from '../util/errcode.js';
import { generate_id, generate_pretty_id } from '../util/genid.js';
/**
 * Find all categories by level
 * @returns
 */
export function find_all_categories() {
    return __awaiter(this, void 0, void 0, function* () {
        const queryCategories = (categories, level, parentId) => {
            const filter = [];
            for (const element of categories) {
                if (element.level == level) {
                    if (parentId == undefined) {
                        filter.push(element);
                    }
                    else {
                        if (element.parent_category_id == parentId) {
                            filter.push(element);
                        }
                    }
                }
            }
            return filter;
        };
        try {
            const categories = yield prisma.$queryRawUnsafe('SELECT c.* FROM p_categories c ORDER BY c.level ASC, c.priority ASC');
            const firstLevelResult = [];
            // read level 1, level 2, level 3 by order
            const firstLevels = queryCategories(categories, 1);
            for (const ele of firstLevels) {
                const secondLevels = queryCategories(categories, 2, ele.id);
                const secondLevelResult = [];
                for (const secondEle of secondLevels) {
                    const thirdLevels = queryCategories(categories, 3, secondEle.id);
                    const thirdLevelResult = [];
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
                    }
                    else {
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
                }
                else {
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
        }
        catch (error) {
            console.error(error);
            return Promise.reject(NotFoundCategories);
        }
    });
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
export function add_category(level, priority, title, introduction, parentCategoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (level > 3) {
            return Promise.reject(ExceedCategoryMaxLevel);
        }
        try {
            const category = yield prisma.p_categories.create({
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
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateCategory);
        }
    });
}
/**
 * Remove category
 * @param categoryId
 * @returns
 */
export function remove_category(categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // check if catetory is used by products
            const childrenCategories = yield prisma.p_categories.findMany({
                where: {
                    parent_category_id: categoryId,
                }
            });
            if (childrenCategories.length > 0) {
                return Promise.reject(CannotRemoveCategoryWithChildren);
            }
            //need to check if category has been used in the p_products
            const products = yield prisma.p_products.findMany({
                where: {
                    category_id: categoryId,
                }
            });
            if (products.length > 0) {
                return Promise.reject(FailToDeleteCategory);
            }
            yield prisma.p_categories.delete({
                where: {
                    id: categoryId,
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToDeleteCategory);
        }
    });
}
/**
 * Find all brands
 * @returns
 */
export function find_all_brands() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const brands = yield prisma.p_brands.findMany({
                orderBy: [
                    { brand: 'asc' },
                    { c_at: 'desc' },
                ]
            });
            return Promise.resolve(brands);
        }
        catch (error) {
            console.error(error);
            return Promise.resolve([]);
        }
    });
}
/**
 * Create brand
 * @param brand
 * @param grade
 * @param holder
 * @param introduction
 * @returns
 */
export function add_brand(brand, grade, holder, introduction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const created = yield prisma.p_brands.create({
                data: {
                    id: generate_pretty_id(5),
                    brand: brand,
                    grade: grade,
                    holder: holder,
                    introduction: introduction,
                }
            });
            return Promise.resolve(created.id);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateBrand);
        }
    });
}
/**
 * Remove brand
 * @param brandId
 * @returns
 */
export function remove_brand(brandId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //need to check if category has been used in the p_products
            const products = yield prisma.p_products.findMany({
                where: {
                    brand_id: brandId,
                }
            });
            if (products.length > 0) {
                return Promise.reject(FailToDeleteBrand);
            }
            yield prisma.p_brands.delete({
                where: {
                    id: brandId,
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToDeleteBrand);
        }
    });
}
/**
 * Find all attribute templates
 * @returns
 */
export function find_all_attr_templates(merchantId, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let templates = [];
            if (type == undefined) {
                templates = yield prisma.p_attr_templates.findMany({
                    where: {
                        merchant_id: merchantId,
                    },
                    orderBy: [
                        { c_at: 'desc' },
                    ]
                });
            }
            else {
                templates = yield prisma.p_attr_templates.findMany({
                    where: {
                        merchant_id: merchantId,
                        template_type: type,
                    },
                    orderBy: [
                        { c_at: 'desc' },
                    ]
                });
            }
            return Promise.resolve(templates);
        }
        catch (error) {
            console.error(error);
            return Promise.resolve([]);
        }
    });
}
export function find_all_attr_template_details(attrTemplId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const details = yield prisma.p_attr_template_details.findMany({
                where: {
                    attr_templ_id: attrTemplId,
                },
                orderBy: [
                    { title: 'asc' },
                ]
            });
            return Promise.resolve(details);
        }
        catch (error) {
            console.error(error);
            return Promise.resolve([]);
        }
    });
}
/**
 * Add a attribute template
 * @param templateName
 * @param templateType
 * @param description
 * @returns
 */
export function add_attr_template(merchantId, templateName, templateType, description) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const created = yield prisma.p_attr_templates.create({
                data: {
                    id: generate_id(),
                    merchant_id: merchantId,
                    template_name: templateName,
                    template_type: templateType,
                    description: description,
                }
            });
            return Promise.resolve(created.id);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateAttrTemplate);
        }
    });
}
export function add_attr_template_detail(attrTemplId, attrName, attrType, paramName, title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const details = yield prisma.p_attr_template_details.findFirst({
                where: {
                    attr_templ_id: attrTemplId,
                    attr_name: attrName,
                },
            });
            if (details != null) {
                return Promise.reject(DuplicatedAttrTemplateDetail);
            }
            const created = yield prisma.p_attr_template_details.create({
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
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateAttrTemplate);
        }
    });
}
/**
 * Remove attribute template
 * @param templateId
 * @returns
 */
export function remove_attr_template(templateId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //need to check if category has been used in the p_products
            const products = yield prisma.p_products.findMany({
                where: {
                    attr_templ_id: templateId,
                }
            });
            if (products.length > 0) {
                return Promise.reject(FailToDeleteAttrTemplate);
            }
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // delete defines of attr template 
                const deleted = yield tx.p_attr_template_details.deleteMany({
                    where: {
                        attr_templ_id: templateId,
                    }
                });
                // delete attr template
                const deleted2 = yield tx.p_attr_templates.delete({
                    where: {
                        id: templateId,
                    }
                });
                return Promise.resolve();
            }));
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToDeleteAttrTemplate);
        }
    });
}
export function remove_attr_template_detail(attrTemplDetailId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.p_attr_template_details.delete({
                where: {
                    id: attrTemplDetailId,
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToDeleteBrand);
        }
    });
}
export function find_all_products(merchantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield prisma.$queryRawUnsafe('SELECT p.*, c.title as category_title, b.brand, at.template_name as attr_templ_title ' +
                'FROM p_products p, p_categories c, p_brands b, p_attr_templates at ' +
                'WHERE p.category_id = c.id AND p.brand_id = b.id AND p.attr_templ_id = at.id ' +
                'AND p.invalid = FALSE AND p.merchant_id = $1 ' +
                'ORDER BY p.c_at DESC', merchantId);
            return Promise.resolve(products);
        }
        catch (error) {
            console.error(error);
            return Promise.resolve([]);
        }
    });
}
export function add_product(merchantId, spuName, categoryId, brandId, attrTemplId, title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const created = yield tx.p_products.create({
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
                yield tx.p_product_attrs.create({
                    data: {
                        id: generate_id(),
                        product_id: created.id,
                    }
                });
                return Promise.resolve(created.id);
            }));
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToCreateProduct);
        }
    });
}
export function remove_product(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.p_products.delete({
                    where: {
                        id: productId,
                    }
                });
                // delete attributes
                yield tx.p_product_attrs.deleteMany({
                    where: {
                        product_id: productId,
                    }
                });
                return Promise.resolve();
            }));
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToDeleteProduct);
        }
    });
}
export function update_product_status(productId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.p_products.update({
                data: {
                    status: status,
                },
                where: {
                    id: productId,
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToUpdateProduct);
        }
    });
}
export function find_product_attrs(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const attrsRecs = yield prisma.$queryRawUnsafe('SELECT * ' +
                'FROM p_product_attrs ' +
                'WHERE product_id = $1', productId);
            if (attrsRecs.length == 0) {
                return Promise.reject(FailToFindProductAttrs);
            }
            const attrs = attrsRecs[0];
            // console.log(JSON.stringify(attrs));
            // const attrsJson = JSON.stringify(attrs);
            // const product_attrs = JSON.parse(attrsJson);
            const templ_records = yield prisma.$queryRawUnsafe('SELECT ptd.* ' +
                'FROM p_products p, p_attr_template_details ptd ' +
                'WHERE p.id = $1 AND p.attr_templ_id = ptd.attr_templ_id ' +
                'ORDER BY ptd.title ASC', productId);
            const result = [];
            for (let i = 0; i < templ_records.length; i++) {
                const item = templ_records[i];
                const attrName = item.attr_name;
                const value = attrs[attrName];
                result.push(Object.assign(Object.assign({}, item), { attr_value: (value == null) ? "" : value }));
            }
            return Promise.resolve(result);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToFindProductAttrs);
        }
    });
}
export function update_product_attrs(productId, attrs) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let setSQL = "";
            let setValues = [];
            let index = 1;
            const attrsJson = JSON.stringify(attrs);
            const product_attrs = JSON.parse(attrsJson);
            const concatAttr = (attrName) => {
                if (product_attrs[attrName] != undefined) {
                    setSQL += attrName + "=$" + index + ",";
                    setValues.push(product_attrs[attrName]);
                    index++;
                }
            };
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
            if (setSQL == "") {
                // DO NOTHING
                return Promise.resolve();
            }
            if (setSQL.endsWith(",")) {
                setSQL = setSQL.substring(0, setSQL.length - 1);
            }
            setValues.push(productId);
            const sql = "UPDATE p_product_attrs SET " + setSQL + " WHERE product_id=$" + index;
            // console.log(sql);
            // console.log(JSON.stringify(setValues));
            yield prisma.$executeRawUnsafe(sql, ...setValues);
            return Promise.resolve();
        }
        catch (error) {
            console.error(error);
            return Promise.reject(FailToUpdateProductAttrs);
        }
    });
}

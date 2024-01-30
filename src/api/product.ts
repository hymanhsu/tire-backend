import express, { Express, Request, Response } from "express"
import { checkAuthToken, LoginSession } from "@App/util/jwtoken";
import { BasicChangeStatusRequest, BasicMerchantRequest, NormalCreateDeleteRequest } from "@App/util/constants";
import {
    find_all_products, add_product, remove_product, update_product_status, find_product_attrs, p_product_attrs_simple, update_product_attrs,
} from "@App/dao/product_dao";

export const productRouter = express.Router();


productRouter.post("/queryProducts", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const basicMerchantRequest = req.body as BasicMerchantRequest;
    find_all_products(basicMerchantRequest.merchant_id)
        .then((products) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: products
                }
            );
        })
        .catch((err) => {
            res.json(
                {
                    meta: { status: false, message: err.message },
                    data: []
                }
            );
        });
});


type AddProductRequest = BasicMerchantRequest & {
    spu_name: string, 
    category_id: string, 
    brand_id: string, 
    attr_templ_id: string, 
    title: string, 
    description: string
}

productRouter.post("/addProduct", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const addProductRequest = req.body as AddProductRequest;
    add_product(addProductRequest.merchant_id, addProductRequest.spu_name, addProductRequest.category_id, 
        addProductRequest.brand_id, addProductRequest.attr_templ_id, addProductRequest.title, 
        addProductRequest.description)
        .then((productId) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { id: productId }
                }
            );
        })
        .catch((err) => {
            res.json(
                {
                    meta: { status: false, message: err.message },
                    data: {}
                }
            );
        });
});


productRouter.post("/removeProduct", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const normalCreateDeleteRequest = req.body as NormalCreateDeleteRequest;
    remove_product(normalCreateDeleteRequest.id)
        .then(() => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: {}
                }
            );
        })
        .catch((err) => {
            res.json(
                {
                    meta: { status: false, message: err.message },
                    data: {}
                }
            );
        });
});


productRouter.post("/changeProductStatus", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const basicChangeStatusRequest = req.body as BasicChangeStatusRequest;
    update_product_status(basicChangeStatusRequest.id, basicChangeStatusRequest.status)
        .then(() => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: {}
                }
            );
        })
        .catch((err) => {
            res.json(
                {
                    meta: { status: false, message: err.message },
                    data: {}
                }
            );
        });
});


type QueryProductAttrsRequest = {
    product_id: string, 
}

productRouter.post("/queryProductAttrs", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const queryProductAttrsRequest = req.body as QueryProductAttrsRequest;
    find_product_attrs(queryProductAttrsRequest.product_id)
        .then((attrs) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: attrs
                }
            );
        })
        .catch((err) => {
            res.json(
                {
                    meta: { status: false, message: err.message },
                    data: []
                }
            );
        });
});


type UpdateProductAttrsRequest = p_product_attrs_simple & {
    product_id: string, 
}

productRouter.post("/updateProductAttrs", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const updateProductAttrsRequest = req.body as UpdateProductAttrsRequest;
    update_product_attrs(updateProductAttrsRequest.product_id, updateProductAttrsRequest)
        .then(() => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: {}
                }
            );
        })
        .catch((err) => {
            res.json(
                {
                    meta: { status: false, message: err.message },
                    data: {}
                }
            );
        });
});


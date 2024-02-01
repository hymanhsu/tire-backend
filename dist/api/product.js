var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { checkAuthToken } from "../util/jwtoken.js";
import { find_all_products, add_product, remove_product, update_product_status, find_product_attrs, update_product_attrs, } from "../dao/product_dao.js";
export const productRouter = express.Router();
productRouter.post("/queryProducts", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const basicMerchantRequest = req.body;
    find_all_products(basicMerchantRequest.merchant_id)
        .then((products) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: products
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: []
        });
    });
}));
productRouter.post("/addProduct", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const addProductRequest = req.body;
    add_product(addProductRequest.merchant_id, addProductRequest.spu_name, addProductRequest.category_id, addProductRequest.brand_id, addProductRequest.attr_templ_id, addProductRequest.title, addProductRequest.description)
        .then((productId) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { id: productId }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
productRouter.post("/removeProduct", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    remove_product(normalCreateDeleteRequest.id)
        .then(() => {
        res.json({
            meta: { status: true, message: "ok" },
            data: {}
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
productRouter.post("/changeProductStatus", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const basicChangeStatusRequest = req.body;
    update_product_status(basicChangeStatusRequest.id, basicChangeStatusRequest.status)
        .then(() => {
        res.json({
            meta: { status: true, message: "ok" },
            data: {}
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
productRouter.post("/queryProductAttrs", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const queryProductAttrsRequest = req.body;
    find_product_attrs(queryProductAttrsRequest.product_id)
        .then((attrs) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: attrs
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: []
        });
    });
}));
productRouter.post("/updateProductAttrs", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const updateProductAttrsRequest = req.body;
    update_product_attrs(updateProductAttrsRequest.product_id, updateProductAttrsRequest)
        .then(() => {
        res.json({
            meta: { status: true, message: "ok" },
            data: {}
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));

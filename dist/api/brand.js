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
import { find_all_brands, add_brand, remove_brand } from "../dao/product_dao.js";
export const brandRouter = express.Router();
brandRouter.get("/queryAllBrands", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    find_all_brands()
        .then((brands) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: brands
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: []
        });
    });
}));
brandRouter.post("/addBrand", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const addBrandRequest = req.body;
    add_brand(addBrandRequest.brand, addBrandRequest.grade, addBrandRequest.holder, addBrandRequest.introduction)
        .then((brandId) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { id: brandId }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
brandRouter.post("/removeBrand", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    remove_brand(normalCreateDeleteRequest.id)
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

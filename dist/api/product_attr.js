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
import { checkAuthToken } from "@App/util/jwtoken";
import { find_all_attr_templates, add_attr_template, add_attr_template_detail, remove_attr_template, remove_attr_template_detail, find_all_attr_template_details } from "@App/dao/product_dao";
export const productAttrRouter = express.Router();
productAttrRouter.post("/queryAllAttrTemplates", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const queryAllAttrTemplatesRequest = req.body;
    find_all_attr_templates(queryAllAttrTemplatesRequest.merchant_id, queryAllAttrTemplatesRequest.template_type)
        .then((templates) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: templates
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: []
        });
    });
}));
productAttrRouter.post("/queryAllAttrTemplateDetails", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const queryAllAttrTemplateDetailsRequest = req.body;
    find_all_attr_template_details(queryAllAttrTemplateDetailsRequest.attr_templ_id)
        .then((templateDetails) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: templateDetails
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: []
        });
    });
}));
productAttrRouter.post("/addAttrTemplate", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const addAttrTemplateRequest = req.body;
    add_attr_template(addAttrTemplateRequest.merchant_id, addAttrTemplateRequest.template_name, addAttrTemplateRequest.template_type, addAttrTemplateRequest.description)
        .then((templateId) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { id: templateId }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
productAttrRouter.post("/addAttrTemplateDetail", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const addAttrTemplateDetailRequest = req.body;
    add_attr_template_detail(addAttrTemplateDetailRequest.attr_templ_id, addAttrTemplateDetailRequest.attr_name, addAttrTemplateDetailRequest.attr_type, addAttrTemplateDetailRequest.param_name, addAttrTemplateDetailRequest.title, addAttrTemplateDetailRequest.description)
        .then((templateDetailId) => {
        res.json({
            meta: { status: true, message: "ok" },
            data: { id: templateDetailId }
        });
    })
        .catch((err) => {
        res.json({
            meta: { status: false, message: err.message },
            data: {}
        });
    });
}));
productAttrRouter.post("/removeAttrTemplate", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    remove_attr_template(normalCreateDeleteRequest.id)
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
productAttrRouter.post("/removeAttrTemplateDetail", checkAuthToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loginSession == undefined) {
        res.json({
            meta: { status: false, message: "Current user have not login!" },
            data: {}
        });
        return;
    }
    const normalCreateDeleteRequest = req.body;
    remove_attr_template_detail(normalCreateDeleteRequest.id)
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

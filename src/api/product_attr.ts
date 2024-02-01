import express, { Express, Request, Response } from "express"
import { checkAuthToken, LoginSession } from "../util/jwtoken.js";
import { BasicMerchantRequest, NormalCreateDeleteRequest } from "../util/constants.js";
import {
    find_all_attr_templates, add_attr_template, add_attr_template_detail,
    remove_attr_template, remove_attr_template_detail, find_all_attr_template_details
} from "../dao/product_dao.js";

export const productAttrRouter = express.Router();

type QueryAllAttrTemplatesRequest = BasicMerchantRequest & {
    template_type : string | undefined
}

productAttrRouter.post("/queryAllAttrTemplates", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const queryAllAttrTemplatesRequest = req.body as QueryAllAttrTemplatesRequest;
    find_all_attr_templates(queryAllAttrTemplatesRequest.merchant_id, queryAllAttrTemplatesRequest.template_type)
        .then((templates) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: templates
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

type QueryAllAttrTemplateDetailsRequest =  {
    attr_templ_id: string,
}

productAttrRouter.post("/queryAllAttrTemplateDetails", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const queryAllAttrTemplateDetailsRequest = req.body as QueryAllAttrTemplateDetailsRequest;
    find_all_attr_template_details(queryAllAttrTemplateDetailsRequest.attr_templ_id)
        .then((templateDetails) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: templateDetails
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

type AddAttrTemplateRequest = BasicMerchantRequest & {
    template_name: string,
    template_type: string,
    description: string
}

productAttrRouter.post("/addAttrTemplate", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const addAttrTemplateRequest = req.body as AddAttrTemplateRequest;
    add_attr_template(addAttrTemplateRequest.merchant_id, addAttrTemplateRequest.template_name,
        addAttrTemplateRequest.template_type, addAttrTemplateRequest.description)
        .then((templateId) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { id: templateId }
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

type AddAttrTemplateDetailRequest = {
    attr_templ_id: string, 
    attr_name: string, 
    attr_type: string,
    param_name: string, 
    title: string, 
    description: string,
}

productAttrRouter.post("/addAttrTemplateDetail", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const addAttrTemplateDetailRequest = req.body as AddAttrTemplateDetailRequest;
    add_attr_template_detail(addAttrTemplateDetailRequest.attr_templ_id, 
        addAttrTemplateDetailRequest.attr_name, addAttrTemplateDetailRequest.attr_type, 
        addAttrTemplateDetailRequest.param_name, addAttrTemplateDetailRequest.title, 
        addAttrTemplateDetailRequest.description)
        .then((templateDetailId) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { id: templateDetailId }
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

productAttrRouter.post("/removeAttrTemplate", checkAuthToken, async (req: Request, res: Response) => {
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
    remove_attr_template(normalCreateDeleteRequest.id)
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

productAttrRouter.post("/removeAttrTemplateDetail", checkAuthToken, async (req: Request, res: Response) => {
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
    remove_attr_template_detail(normalCreateDeleteRequest.id)
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


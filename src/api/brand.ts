import express, { Express, Request, Response } from "express"
import { checkAuthToken, LoginSession } from "@App/util/jwtoken";
import { NormalCreateDeleteRequest } from "@App/util/constants";
import { find_all_categories, add_category, remove_category, find_all_brands, add_brand, remove_brand } from "@App/dao/product_dao";

export const brandRouter = express.Router();


brandRouter.get("/queryAllBrands", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    find_all_brands()
        .then((brands) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: brands
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

type AddBrandRequest = {
    brand: string, 
    grade: number, 
    holder: string,
    introduction: string
}

brandRouter.post("/addBrand", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const addBrandRequest = req.body as AddBrandRequest;
    add_brand(addBrandRequest.brand, addBrandRequest.grade, addBrandRequest.holder, addBrandRequest.introduction)
        .then((brandId) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { id: brandId}
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


brandRouter.post("/removeBrand", checkAuthToken, async (req: Request, res: Response) => {
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
    remove_brand(normalCreateDeleteRequest.id)
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


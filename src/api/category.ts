import express, { Express, Request, Response } from "express"
import { checkAuthToken, LoginSession } from "@App/util/jwtoken";
import { NormalCreateDeleteRequest } from "@App/util/constants";
import { find_all_categories, add_category, remove_category } from "@App/dao/product_dao";

export const categoryRouter = express.Router();


categoryRouter.get("/queryAllCategories", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    find_all_categories()
        .then((categories) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: categories
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

type AddCategoryRequest = {
    level: number,
    priority: number,
    title: string,
    introduction: string,
    parent_category_id: string
}

categoryRouter.post("/addCategory", checkAuthToken, async (req: Request, res: Response) => {
    if (req.loginSession == undefined) {
        res.json(
            {
                meta: { status: false, message: "Current user have not login!" },
                data: {}
            }
        );
        return;
    }
    const addCategoryRequest = req.body as AddCategoryRequest;
    add_category(addCategoryRequest.level, addCategoryRequest.priority, addCategoryRequest.title,
        addCategoryRequest.introduction, addCategoryRequest.parent_category_id)
        .then((categoryId) => {
            res.json(
                {
                    meta: { status: true, message: "ok" },
                    data: { id: categoryId}
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


categoryRouter.post("/removeCategory", checkAuthToken, async (req: Request, res: Response) => {
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
    remove_category(normalCreateDeleteRequest.id)
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


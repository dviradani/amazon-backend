import express from "express";
import expressAsyncHandler from "express-async-handler";

import Product from "../Models/ProductModel.js";
import { isAuth } from "../utils.js";

export const productRouter = express.Router();

const PAGE_SIZE = 6;

productRouter.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const products = await Product.find();
        res.send(products);
    })
)

productRouter.get(
    "/categories",
    expressAsyncHandler(async (req, res) => {
        const categories = await Product.find().distinct("category");
        res.send(categories);
    })
)

productRouter.get(
    "/token/:token",
    expressAsyncHandler(async (req, res) => {
        const { token } = req.params;
        const product = await Product.findOne({ token });
        product ? res.send(product) : res.status(404).send("Product not found");
    })
)

productRouter.get(
    "/id/:id",
    expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const product = await Product.findById(id);
        product ? res.send(product) : res.status(404).send("Product not found");
    })
)

productRouter.get(
    "/search",
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const pageSize = query.pageSize || PAGE_SIZE;
        const page = query.page || 1;
        const category = query.category || "";
        const price = query.price || "";
        const rating = query.rating || "";
        const order = query.order || "";
        const searchQuery = query.query || "";

        const queryFilter = searchQuery && searchQuery !== "all" ? { title: { $regex: searchQuery, $options: 'i' } } : {};
        const categoryFilter = category && category !== "all" ? { category: { $regex: category, $options: 'i' } } : {};
        const ratingFilter = rating && rating !== "all" ? {} : { "rating.rate": { $gte: Number(rating) } };
        const priceFilter = price && price !== "all" ? {} : { price: { $gte: Number(price.split("-")[0]), $lte: Number(price.split("-")[1]) } };
        
        const sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"  
        ? { rating: 1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

        const products = await Product.find({...queryFilter,...categoryFilter,...ratingFilter,...priceFilter }).sort(sortOrder).skip((page - 1) * pageSize).limit(pageSize);
        const countProducts = products.length;
        res.send({products,page,countProducts,pages: Math.ceil(countProducts / pageSize)});
    })
)

export default productRouter;


import express from "express";
import { createUrl, getUrl, getUserUrls } from "../controllers/urlController.js";
import isAuth from "../middleware/auth.js";

const urlRouter = express.Router();

urlRouter.post("/create", isAuth, createUrl)
urlRouter.get("/user/urls", isAuth, getUserUrls)
urlRouter.get('/:shortId', getUrl)


export default urlRouter;
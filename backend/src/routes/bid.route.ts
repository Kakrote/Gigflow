import { Router } from "express";
import * as bidController from "../controllers/bid.controller";
import { protect } from "../middleware/verifyToken.middleware";

const route=Router();

route.post("/",protect,bidController.createBid);
route.get("/my",protect,bidController.getMyBid);
route.patch("/:bidId/hire",protect,bidController.hireBid);

export default route;
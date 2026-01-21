import { Router } from "express";
import * as gigController from "../controllers/gig.controller";
import { protect } from "../middleware/verifyToken.middleware";

const router=Router();

router.get("/",gigController.getGigs);
router.post("/",protect,gigController.createGig);
router.get("/my",protect,gigController.getMyGigs);
router.delete("/:gigId",protect,gigController.removeGig);

export default router;
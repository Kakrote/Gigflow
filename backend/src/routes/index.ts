import healthRoute from "./health.route";
import { Router } from "express";
import authRoute from "./auth.route"

const route=Router();
route.use(healthRoute);
route.use("/auth",authRoute);

export default route;
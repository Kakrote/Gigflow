import healthRoute from "./health.route";
import { Router } from "express";
import authRoute from "./auth.route"
import gigRouter from "./gig.route"
import bidroute from "./bid.route"

const route=Router();
route.use(healthRoute);
route.use("/auth",authRoute);
route.use("/gig",gigRouter)
route.use("/bid",bidroute)

export default route;
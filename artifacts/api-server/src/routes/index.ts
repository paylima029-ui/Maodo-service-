import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import ordersRouter from "./orders";
import paymentRouter from "./payment";
import authRouter from "./auth";
import visitsRouter from "./visits";
import formationsRouter from "./formations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(servicesRouter);
router.use(ordersRouter);
router.use(paymentRouter);
router.use(visitsRouter);
router.use(formationsRouter);

export default router;

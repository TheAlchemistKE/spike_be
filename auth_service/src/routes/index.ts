import {Router} from "express";
import {requestLogger} from "../middleware/request_logger";
import errorHandler from "../middleware/error_handler";
import auth from "./auth";
import user from "./user";
import {checkTokenExpiration} from "../middleware/check_expiration";

const router = Router();
router.use(requestLogger)
router.use(errorHandler)
router.use('/auth', auth)
router.use(checkTokenExpiration)
router.use('/users', user)

export default router;

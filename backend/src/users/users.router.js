const { Router } = require("express");
const { authorize } = require("../auth/auth.controller");
const { tryCatchWrapper } = require("../helpers/try-catch-wrapper");
const { getCurrent } = require("./users.controller");

const router = Router();

router.get("/", authorize, tryCatchWrapper(getCurrent));

exports.usersRouter = router;

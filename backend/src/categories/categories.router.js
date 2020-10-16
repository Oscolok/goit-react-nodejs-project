const { Router } = require("express");
const Joi = require("Joi");
const { validate } = require("../helpers/validate");
const { tryCatchWrapper } = require("../helpers/try-catch-wrapper");
const { addCategory } = require("./categories.controller");

const router = Router();

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
});

router.post("/", validate(createCategorySchema), tryCatchWrapper(addCategory));

exports.categoryRouter = router;

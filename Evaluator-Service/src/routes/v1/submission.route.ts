import { Router } from "express";
import SubmissionController from "../../controllers/submission.controller.js";
import validate from "../../validators/zodValidator.js";
import { CreateSubmissionZodSchema } from "../../dtos/CreateSubmissionDto.js";

const router = Router();

const submissionController = new SubmissionController();

router.route("/").post(validate(CreateSubmissionZodSchema), submissionController.addSubmission);

export default router;

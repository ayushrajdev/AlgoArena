import type { NextFunction, Request, Response } from "express";
import type { CreateSubmissionDto } from "../dtos/CreateSubmissionDto.js";

export default class SubmissionController {
  constructor() {}
  async addSubmission(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    
    console.log("inside add submission")
    const submissionDto = req.body as CreateSubmissionDto
    res.status(200).json({submissionDto})
  }
}


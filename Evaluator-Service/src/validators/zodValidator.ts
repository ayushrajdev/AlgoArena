import type { ZodSchema } from "zod";
import type { NextFunction, Request, Response } from "express";

export default function validate(schema: ZodSchema<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse({ ...req.body });
      next();
    } catch (error) {
        console.log(error);
        
      return res.status(400).json({
        success: false,
        message: "Invalid request params received",
        data: {},
        error: error,
      });
    }
  };
}

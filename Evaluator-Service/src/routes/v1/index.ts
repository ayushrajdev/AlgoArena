import { Router, type Response } from "express";
import submissionRouter from "./submission.route.js";

const v1Router = Router();

v1Router.use("/submissions", submissionRouter);
v1Router.use("/ping", (_, res: Response) => {
  // return res.status(200).json({ message: "api is live" });
  return res.end()
});

export default v1Router;

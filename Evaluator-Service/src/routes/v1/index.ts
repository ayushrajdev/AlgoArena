import { Router, type Response } from "express";

const v1Router = Router();

v1Router.use("/ping", (_, res: Response) => {
  return res.status(200).json({ message: "api is live" });
});

export default v1Router;

import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./user/routes/user.routes";
import "reflect-metadata"

const app = express();

app.use(bodyParser.json());

app.use("/user", userRoutes);

export default app;

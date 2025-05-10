import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./user/routes/user.routes";
import "reflect-metadata"
import leaveRouter from "./user/routes/leave.routes";

const app = express();

app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/leave", leaveRouter);

export default app;

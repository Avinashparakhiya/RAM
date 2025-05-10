import { Router } from "express";
import LeaveController from "../controllers/leave.controller";

const leaveRouter = Router();

const controller = new LeaveController();

leaveRouter.post("/apply", async (req, res, next) => {
    try {
        await controller.applyLeave(req, res);
    } catch (error) {
        next(error);
    }
});
leaveRouter.post("/approve-or-reject", async (req, res, next) => {
    try {
        await controller.approveOrRejectLeave(req, res);
    } catch (error) {
        next(error);
    }
});
leaveRouter.get("/get-leave-by-id/:leaveId", async (req, res, next) => {
    try {
        await controller.getLeaveRequestByLeaveId(req, res);
    } catch (error) {
        next(error);
    }
});
leaveRouter.get("/get-leave-by-user/:userId", async (req, res, next) => {
    try {
        await controller.getLeaveRequestByUserId(req, res);
    } catch (error) {
        next(error);
    }
});
leaveRouter.get("/get-all-leave-requests", async (req, res, next) => {
    try {
        await controller.getAllLeaveRequests(req, res);
    } catch (error) {
        next(error);
    }
});

export default leaveRouter;
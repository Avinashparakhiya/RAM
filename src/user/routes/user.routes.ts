import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

router.post("/login", async (req, res, next) => {
    try {
        const userController = new UserController();
        await userController.login(req, res);
    } catch (error) {
        next(error);
    }
});

router.post("/register", async (req, res, next) => {
    try {
        const userController = new UserController();
        await userController.register(req, res);
    } catch (error) {
        next(error);
    }
});

// New route for updating user details
router.put("/update/:id", async (req, res, next) => {
    try {
        const userController = new UserController();
        await userController.updateUser(req, res);
    } catch (error) {
        next(error);
    }
});

router.get("/hods", async (req, res, next) => {
    try {
        const userController = new UserController();
        await userController.getAllHODs(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
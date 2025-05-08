import { Router } from "express";
import userController from "../controllers/user.controller"; // Import the default instance

const router = Router();

router.post("/register", async (req, res, next) => {
	try {
		await userController.register(req, res);
	} catch (error) {
		next(error);
	}
});

export default router;
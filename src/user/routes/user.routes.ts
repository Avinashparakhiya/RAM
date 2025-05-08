import { Router } from "express";
import UserController from "../controllers/user.controller"; // Import the default instance

const router = Router();

router.post("/register", async (req, res, next) => {
	try {
		const userController = new UserController(); // Create a new instance of UserController
		await userController.register(req, res);
	} catch (error) {
		next(error);
	}
});

export default router;
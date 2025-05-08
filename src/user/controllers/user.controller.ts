import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../../config/database";
import { sendMail } from "../../utils/sendMail";
import { onboard } from "../../utils/sendNotificationTemplate";

export default class UserController {
  async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOneBy({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists!" });
      }

      const newUser = userRepository.create({ name, email, password });
      await userRepository.save(newUser);

      await sendMail(
        email, // Recipient email
        "Welcome to Our Platform", // Email subject
        onboard // Email content
      );

      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}

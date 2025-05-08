import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../../config/database";

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

      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}

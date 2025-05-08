import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../../config/database";
import { validate } from "class-validator";
import { accountUpdateTemplate, onboardTemplate } from "../../utils/sendNotificationTemplate";
import { sendMail } from "../../utils/sendMail";
import { messages } from "../../utils/notificationMessage";

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

      // Validate the newUser object
      const errors = await validate(newUser);
      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation failed!",
          errors: errors.map((err) => err.constraints),
        });
      }

      await userRepository.save(newUser);

      await sendMail(
        email, // Recipient email
        messages.WELCOME,
        onboardTemplate(name, email, password) // Email content
      );

      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  // New method for updating user details
  async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // User ID from the URL
    const { name, email, password } = req.body; // Fields to update

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      // Update only the fields provided in the request body
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;

      // Validate the updated user object
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation failed!",
          errors: errors.map((err) => err.constraints),
        });
      }

      await userRepository.save(user);

      const emailBody = accountUpdateTemplate(user.name, {
        email: email ?? undefined,
        password: password ?? undefined,
        name: name ?? undefined,
      });

      await sendMail(
        user.email, // Use the updated email if changed
        messages.UPDATE_PROFILE, // Email subject
        emailBody
      );

      return res.status(200).json({ message: "User updated successfully!", user });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}
import { Request, Response } from "express";
import { User, UserRole } from "../entities/user.entity";
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
    const { name, email, password, managerId } = req.body; // Fields to update
  
    try {
      const userRepository = AppDataSource.getRepository(User);
  
      // Find the user to update
      const user = await userRepository.findOneBy({ id });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
  
      // Update only the fields provided in the request body
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
  
      // Update the manager if `managerId` is provided
      if (managerId) {
        const manager = await userRepository.findOneBy({ id: managerId });
        if (!manager) {
          return res.status(404).json({ message: "Manager not found!" });
        }
        user.manager = manager;
      }
  
      // Validate the updated user object
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation failed!",
          errors: errors.map((err) => err.constraints),
        });
      }
  
      // Save the updated user
      await userRepository.save(user);
  
      const emailBody = accountUpdateTemplate(user.name, {
        email: email ?? undefined,
        password: password ?? undefined,
        name: name ?? undefined,
        manager: managerId ? managerId : undefined,
      });
  
      // Send notification email
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

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation failed!",
          errors: errors.map((err) => err.constraints),
        });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials!" });
      }

      return res.status(200).json({
        message: "Login successful!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getAllHODs(req: Request, res: Response): Promise<Response> {
    try {
      const userRepository = AppDataSource.getRepository(User);

      // Fetch all users with the role 'HOD'
      const hodUsers = await userRepository.find({
        where: { role: UserRole.HOD,isActive: true },
      });

      return res.status(200).json({
        message: "HOD users fetched successfully!",
        data: hodUsers,
      });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}
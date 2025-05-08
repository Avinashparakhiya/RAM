import { Request, Response } from "express";
import { AppDataSource } from "../../config/database";
import { UserSession } from "../entities/userSession.entity";
import { User } from "../entities/user.entity";
import { IsNull } from "typeorm";

export default class UserSessionController {
    // Check-in logic
    async checkIn(req: Request, res: Response): Promise<Response> {
        const { userId, date } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const userSessionRepository = AppDataSource.getRepository(UserSession);

            // Verify if the user exists
            const user = await userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }

            const loginTime = date ? new Date(date) : new Date();

            // Create a new session record with the current time as loginTime
            const newSession = userSessionRepository.create({
                user,
                loginTime,
            });

            await userSessionRepository.save(newSession);

            return res.status(201).json({ message: "Check-in successful!", session: newSession });
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    }

    // Check-out logic
    async checkOut(req: Request, res: Response): Promise<Response> {
        const { userId, date } = req.body;

        try {
            const userSessionRepository = AppDataSource.getRepository(UserSession);

            // Find the latest session for the user where logoutTime is null
            const latestSession = await userSessionRepository.findOne({
                where: { user: { id: userId }, logoutTime: IsNull() },
                order: { createdAt: "DESC" },
            });

            if (!latestSession) {
                return res.status(404).json({ message: "No active session found for the user!" });
            }

            const loginOutTime = date ? new Date(date) : new Date();

            // Calculate the total minutes between loginTime and logoutTime
            const loginTime = new Date(latestSession.loginTime);
            const logoutTime = new Date(loginOutTime);
            const totalMinutes = Math.round((Math.abs(logoutTime.getTime() - loginTime.getTime()) / (1000 * 60)) * 100) / 100;

            latestSession.totalMinutes = totalMinutes;
            latestSession.logoutTime = logoutTime;
            await userSessionRepository.save(latestSession);

            return res.status(200).json({
                message: "Check-out successful!",
                session: latestSession,
                totalMinutes,
            });
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    }
}
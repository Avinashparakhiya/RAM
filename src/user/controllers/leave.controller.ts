import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { Leave, LeaveStatus, LeaveType } from "../entities/leave.entity";
import { AppDataSource } from "../../config/database";
import { UserService } from "../services/user.service";
import { messages } from "../../utils/notificationMessage";
import { leaveRequestTemplate } from "../../utils/sendNotificationTemplate";
import { sendMail } from "../../utils/sendMail";

export default class LeaveController {
  async applyLeave(req: Request, res: Response): Promise<Response> {
    const { userId, leaveType, startDate, endDate } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const leaveRepository = AppDataSource.getRepository(Leave);

      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const oldLeaveRequest = await leaveRepository.findOneBy({ userId, status: LeaveStatus.PENDING })
      if (oldLeaveRequest) {
        return res.status(400).json({ message: "Leave request already exists!" });
      }

      const leave = leaveRepository.create({
        userId,
        type: leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: LeaveStatus.PENDING, // default status
      });

      const leaveRequest = await leaveRepository.save(leave);

      const userService = new UserService()
      const managerEmail = await userService.getEmailOfManagerForUser(userId);
      const viewUrl = `https://yourapp.com/leaves/view?id=${leaveRequest.id}`;
      console.log(`Sending email to manager mail: ${managerEmail}`)
      sendMail(
        managerEmail,
        messages.LEAVE_REQUEST,
        leaveRequestTemplate(
          user.name, 
          startDate, 
          endDate, 
          leaveType,
          viewUrl
        )
      )

      return res.status(201).json({ message: "Leave applied successfully!", leave });
    } catch (error) {
      console.error("Apply Leave Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async approveOrRejectLeave(req: Request, res: Response): Promise<Response> {
    const { leaveId, action } = req.body; // action = "approve" or "reject"

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'." });
    }

    try {
      const leaveRepository = AppDataSource.getRepository(Leave);
      const leave = await leaveRepository.findOneBy({ id: leaveId });

      if (!leave) {
        return res.status(404).json({ message: "Leave not found!" });
      }

      if (leave.status !== LeaveStatus.PENDING) { // fixed comparison
        return res.status(400).json({ message: "Leave request is already processed." });
      }

      leave.status = action === 'approve' ? LeaveStatus.APPROVED : LeaveStatus.REJECTED;
      await leaveRepository.save(leave);

      return res.status(200).json({ message: `Leave ${leave.status} successfully.` });
    } catch (error) {
      console.error("Approve/Reject Leave Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getLeaveRequestByLeaveId(req: Request, res: Response): Promise<Response> {
    const { leaveId } = req.params
    try {
      const leaveRepository = AppDataSource.getRepository(Leave);
      const leaveRequest = await leaveRepository.findOneBy({ id: leaveId })
  
      if (!leaveRequest) {
        return res.status(404).json({ message: "Leave not found!" });
      }
  
      return res.status(200).json({ leaveRequest });
    } catch (error) {
      console.error("Get Leave Request Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getLeaveRequestByUserId(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params
    try {
      const leaveRepository = AppDataSource.getRepository(Leave);
      const leaveRequests = await leaveRepository.findOneBy({ userId });

      if (!leaveRequests) {
        return res.status(404).json({ message: "Leave not found!" });
      }

      return res.status(200).json({ leaveRequests });
    } catch (error) {
      console.error("Get Leave Request Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllLeaveRequests(req: Request, res: Response): Promise<Response> {
    try {
      const leaveRepository = AppDataSource.getRepository(Leave);
      const leaveRequests = await leaveRepository.findBy({ status: LeaveStatus.PENDING });

      return res.status(200).json({ leaveRequests });
    } catch (error) {
      console.error("Get All Leave Requests Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}


import { AppDataSource } from "../../config/database";
import { User } from "../../user/entities/user.entity";
import { sendMail } from "../../utils/sendMail";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async registerUser(email: string, password: string): Promise<User> {
    const userExists = await this.userRepository.findOneBy({ email });

    if (userExists) {
      throw new Error("User already exists.");
    }

    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  async getEmailOfManagerForUser(userId: string) {
    const userExists = await this.userRepository.findOneBy({ id: userId });

    if (!userExists) {
      throw new Error("User already exists.");
    }

    return userExists.manager.email;
  }
}

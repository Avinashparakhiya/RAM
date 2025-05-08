import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";

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
}

import { DataSource } from "typeorm";
import { User } from "../user/entities/user.entity";
import 'dotenv/config';
import { UserSession } from "../user/entities/userSession.entity";
import { Leave } from "../user/entities/leave.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, UserSession, Leave],
  synchronize: true, // Use only in development, otherwise, use migrations
  logging: false,
  ssl: {
    rejectUnauthorized: false, // Disable strict SSL validation
    ca: process.env.DB_SSL
  }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [user_entity_1.User],
    synchronize: true, // Use only in development, otherwise, use migrations
    logging: false,
    ssl: {
        rejectUnauthorized: false, // Disable strict SSL validation
        ca: process.env.DB_SSL // Use the SSL certificate from the .env file
    }
});

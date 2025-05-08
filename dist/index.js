"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("./config/database");
const app_1 = __importDefault(require("./app"));
const PORT = 3000;
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected successfully!");
    app_1.default.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((error) => console.error("Database connection error:", error));

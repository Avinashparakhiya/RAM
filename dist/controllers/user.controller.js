"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("../entities/user.entity");
const database_1 = require("../config/database");
class UserController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const userRepository = database_1.AppDataSource.getRepository(user_entity_1.User);
                const existingUser = yield userRepository.findOneBy({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "User already exists" });
                }
                const newUser = userRepository.create({ email, password });
                yield userRepository.save(newUser);
                return res.status(201).json(newUser);
            }
            catch (error) {
                return res.status(500).json({ error: error });
            }
        });
    }
}
exports.default = new UserController();

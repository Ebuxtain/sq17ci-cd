"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoController_1 = require("../controller/todoController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/* GET listing of item */
router.post('/create', auth_1.auth, todoController_1.createTodo);
router.get('/get-todo', auth_1.auth, todoController_1.getTodo);
router.patch('/update-todo/:id', auth_1.auth, todoController_1.updateTodo);
router.delete('/delete-todo/:id', auth_1.auth, todoController_1.deleteTodo);
exports.default = router;

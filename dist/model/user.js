"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const todo_1 = require("./todo");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "User"
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
    },
}, { sequelize: database_config_1.default, tableName: 'user' });
UserInstance.hasMany(todo_1.TodoInstance, { foreignKey: 'userId', as: 'todo' });
todo_1.TodoInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'user' });

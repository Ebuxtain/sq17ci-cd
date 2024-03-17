"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.getTodo = exports.createTodo = void 0;
const utils_1 = require("../utils/utils");
const todo_1 = require("../model/todo");
const uuid_1 = require("uuid");
const createTodo = async (req, res) => {
    try {
        const verified = req.user;
        const id = (0, uuid_1.v4)();
        // validate with joi
        const validateResult = utils_1.createTodoSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        const todoRecord = await todo_1.TodoInstance.create({
            id,
            ...req.body,
            userId: verified.id
        });
        return res.status(201).json({ msg: "Todo Created Successfully", todoRecord });
    }
    catch (err) {
        console.log(err);
        return res.status(505).json({
            error: "Internal server error"
        });
    }
};
exports.createTodo = createTodo;
const getTodo = async (req, res) => {
    const limit = req.query?.limit;
    const offset = req.query?.offset;
    const getAllTodo = await todo_1.TodoInstance.findAndCountAll({
        limit: limit,
        offset: offset
    });
    return res.status(200).json({
        msg: "You have successfullY retrived all todo",
        count: getAllTodo.count,
        todo: getAllTodo.rows
    });
};
exports.getTodo = getTodo;
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        // validate with joi
        const validateResult = utils_1.updateTodoschema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        // Check if the todo exist
        const updateTodo = (await todo_1.TodoInstance.findOne({
            where: { id: id },
        }));
        if (!updateTodo) {
            return res.status(400).json({
                error: "Cannot find existing todo",
            });
        }
        ;
        const updateRecord = await updateTodo.update({
            completed
        });
        return res.status(200).json({
            msg: "You have updated your Todo",
            updateRecord
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.updateTodo = updateTodo;
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = (await todo_1.TodoInstance.findOne({
            where: { id: id },
        }));
        if (!deleteTodo) {
            return res.status(400).json({
                error: "error in deleting Todo"
            });
        }
        const deleteRecord = await deleteTodo.destroy();
        return res.status(201).json({
            msg: "Deleted successfully",
            deleteRecord
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.deleteTodo = deleteTodo;

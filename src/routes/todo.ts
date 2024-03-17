import express from 'express';
import { createTodo, deleteTodo, getTodo, updateTodo } from '../controller/todoController';
import {auth} from "../middleware/auth"


const router = express.Router();


/* GET listing of item */

router.post('/create', auth, createTodo);
router.get('/get-todo', auth, getTodo);
router.patch('/update-todo/:id', auth,  updateTodo);
router.delete('/delete-todo/:id', auth, deleteTodo)

export default router;



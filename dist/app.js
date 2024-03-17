"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const database_config_1 = __importDefault(require("./config/database.config"));
const user_1 = __importDefault(require("./routes/user"));
const todo_1 = __importDefault(require("./routes/todo"));
const app = (0, express_1.default)();
// db connection
database_config_1.default.sync().then(() => {
    console.log(`Database is connected successfully`);
}).catch(err => {
    console.log(err);
});
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Test route
// app.get('/', (req:Request, res:Response)=>{
//   return res.status(200).json({
//     msg :'hello world'
//   })
// })
app.use('/todos', todo_1.default);
app.use('/users', user_1.default);
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

import dotenv from 'dotenv';
dotenv.config();
import express,{Request, Response} from  'express';
import logger from 'morgan';
import db from './config/database.config';
import userRouter from './routes/user';
import todoRouter from './routes/todo';


const app = express();

// db connection

db.sync().then(()=>{
  console.log (`Database is connected successfully`)
}).catch(err=>{
  console.log(err)

})


app.use(logger('dev'));
app.use(express.json());

// Test route
// app.get('/', (req:Request, res:Response)=>{
//   return res.status(200).json({
//     msg :'hello world'
//   })
// })

app.use('/todos', todoRouter)
app.use('/users', userRouter)


const port = 5000
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})

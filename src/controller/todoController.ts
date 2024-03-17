import { Request, Response } from "express";
import { createTodoSchema, options, updateTodoschema } from "../utils/utils";
import { TodoInstance } from "../model/todo";
import { v4 as uuid4 } from "uuid";
import { UserInstance } from "../model/user";

export const createTodo = async (req: Request | any, res: Response) => {
  try {
    const verified = req.user
    const id = uuid4();

    // validate with joi

    const validateResult = createTodoSchema.validate(req.body,options);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    const todoRecord = await TodoInstance.create({
      id,
      ...req.body,
      userId: verified.id
    });

    return res.status(201).json({msg: "Todo Created Successfully", todoRecord})
  } catch (err) {
    console.log(err);
    return res.status(505).json({
        error: "Internal server error"
    });
  }
};

export const getTodo = async(req: Request, res:Response)=> {
    

  const limit = req.query?.limit as number | undefined
  const offset = req.query?.offset as number | undefined

  const getAllTodo = await TodoInstance.findAndCountAll({
    limit : limit,
    offset : offset
  });
       

  return res.status(200).json({
    msg: "You have successfullY retrived all todo",
   count:  getAllTodo.count,
   todo:  getAllTodo.rows

  })
}


export const updateTodo = async(req:Request, res:Response)=>{
   try{
    
    const {id} = req.params


    const {completed} = req.body

    // validate with joi

  const validateResult = updateTodoschema.validate(req.body,options);

  if(validateResult.error){
    return res.status(400).json({
      Error: validateResult.error.details[0].message
    })
  }

   // Check if the todo exist

    const updateTodo = (await TodoInstance.findOne({
      where : {id: id},
    }))

    if(!updateTodo){
      return res.status(400).json({
        error: "Cannot find existing todo",
    });
    };
    

    const updateRecord = await updateTodo.update({
      completed
    });

    return res.status(200).json({
      msg: "You have updated your Todo",
      updateRecord
    });


   }catch(err){
    console.log(err)
   }
};

export const deleteTodo = async(req:Request, res:Response)=>{
  try{
    const {id} = req.params

   

    const deleteTodo = ( await TodoInstance.findOne({
      where : {id : id},
    }))

    if(!deleteTodo){
      return res.status(400).json({
        error : "error in deleting Todo"
      })
    }
 
  const deleteRecord = await deleteTodo.destroy( 
  )
  return res.status(201).json({
    msg:"Deleted successfully",
    deleteRecord
  })

  }catch(err){
    console.log(err)
  }
}
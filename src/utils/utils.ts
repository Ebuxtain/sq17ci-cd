import Joi from 'joi';


export const registerUserSchema = Joi.object().keys({
 email: Joi.string().trim().lowercase().required(),
 firstName: Joi.string().required(),
 phone: Joi.string().required(),
 password: Joi.string().min(3).regex(/^[a-zA-z0-9]{3,30}$/).required(),
 confirm_password: Joi.any().equal(Joi.ref('password')).required()
 .label('Confirm password').messages({'any.only':'{{#label}} does not match'})
})

export const options = {
    abortEarly: false,
    errors: {
      wrap: {
        label: ''
      }
    }
  };
  
 

export const loginUserSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().min(3).regex(/^[a-zA-z0-9]{3,30}$/).required(),
    
   })


export const createTodoSchema = Joi.object().keys({
      description: Joi.string().required(),
      completed: Joi.boolean().required(),  
})


export const updateTodoschema = Joi.object().keys({
    completed: Joi.boolean().required(),
})



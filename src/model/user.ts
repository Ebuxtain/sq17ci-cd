import {DataTypes, Model} from "sequelize"
import db from  '../config/database.config'
import { TodoInstance } from "./todo"


 export interface  UserAttributes {
    id : string,
    firstName: string,
    email: string,
    password: string,
    otp: number,
    otp_expiry: Date,
    verified: boolean,
    role: string,
    phone: string
}
 

export class UserInstance extends Model<UserAttributes> {
    public id!: number;
  otp: number | undefined;
  otp_expiry: boolean | any;

}


UserInstance.init(
   {
    id: {
        type : DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "User"
    },
    phone:{
        type: DataTypes.STRING,
    },
   }, 
   { sequelize: db , tableName:'user'}
)

UserInstance.hasMany(TodoInstance, {foreignKey: 'userId', as:'todo'})
TodoInstance.belongsTo(UserInstance, {foreignKey: 'userId', as:'user'})






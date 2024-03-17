import { DataTypes, Model } from "sequelize";
import db from "../config/database.config";

export interface TodoAttrbutes {
  id: string;
  description: string;
  completed: string;
  userId: string;
}

export class TodoInstance extends Model<TodoAttrbutes> {}

TodoInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userId: {
        type: DataTypes.UUIDV4,
    }

  },
  { sequelize: db, tableName: "todo" }
);

// Relationship


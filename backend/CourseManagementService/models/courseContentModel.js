import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

// Course Modules/topics
const courseContent = sequelize.define(
    'coursecontents',
    {
        content_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        course_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        subtitle: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        desc: {
            type: DataTypes.TEXT, 
            allowNull: true,
        },
    }, {
        timestamps: true
    }
);

export default courseContent;
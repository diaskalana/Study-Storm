import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Courses = sequelize.define(
    'courses',
    {
        course_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        desc: {
            type: DataTypes.TEXT, 
            allowNull: false
        },
        subject: { // subject of the course Ex: Math, Science, etc.
            type: DataTypes.STRING, 
            allowNull: false
        },
        language: {
            type: DataTypes.STRING, 
            allowNull: false,
            defaultValue: 'English'
        },
        type: {
            type: DataTypes.STRING, 
            allowNull: false,
            defaultValue: 'Course'
        },
        level: {
            type: DataTypes.STRING, 
            allowNull: false,
            defaultValue: 'Beginner'
        },
        duration: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        skills: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        start_date: {
            type: DataTypes.DATEONLY, 
            allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE, 
            allowNull: false,
            defaultValue: 0.0
        },
        thumbnail: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        approved: {
            type: DataTypes.BOOLEAN, 
            allowNull: true,
            defaultValue: null
        },
        studentCount: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            defaultValue: 0
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: true
    }
);

export default Courses;
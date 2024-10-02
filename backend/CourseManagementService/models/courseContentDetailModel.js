import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

// contents for each module
const courseContentDetail = sequelize.define(
    'coursecontentdetails',
    {
        detail_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        desc: {
            type: DataTypes.TEXT, 
            allowNull: true
        },
        attatchment: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        attatchment_type: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN, 
            allowNull: true,
            defaultValue: null
        },
    }, {
        timestamps: true
    }
);

export default courseContentDetail;
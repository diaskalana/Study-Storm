import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.DB_USER, process.env.MYSQL_ROOT_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Database Connected`);
    } catch (error) {
        console.error(`DB Error: ${error.message}`);
        process.exit(1);
    }
}


(async () => {
    await sequelize.sync({ alter: true });
})();

export { connectDB, sequelize };

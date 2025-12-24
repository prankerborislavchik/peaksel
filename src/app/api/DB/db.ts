import * as pg from 'pg';
import { Sequelize } from "sequelize";
// 'postgres://postgres:YNHdp58msWPk0C75peK2QbOD@localhost:5432/peaksel-shop'
const sequelize = new Sequelize(process.env.POSTGRES_DATABASE || '', process.env.POSTGRES_USER || '',
    process.env.POSTGRES_PASSWORD || '',
    {
        dialect: 'postgres',
        port: parseInt(process.env.POSTGRES_PORT || "5432"),
        host: process.env.POSTGRES_HOST,
        dialectModule: pg,
        // ssl: true,
        dialectOptions: {
            ssl: false
        }
    }
)

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');
        
        const tablesExist = await sequelize.getQueryInterface().showAllTables();
        console.log(`Found ${tablesExist.length} tables in database`);
        
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
};
initializeDatabase()

export { sequelize }
// export const sequelize = new Sequelize((process.env.POSTGRES_URL || '')+'?sslmode=require')
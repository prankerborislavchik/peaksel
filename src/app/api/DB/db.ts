import * as pg from 'pg';
import { Sequelize } from "sequelize";
// 'postgres://postgres:YNHdp58msWPk0C75peK2QbOD@localhost:5432/peaksel-shop'
export const sequelize = new Sequelize(process.env.POSTGRES_DATABASE || '', process.env.POSTGRES_USER || '',
    process.env.POSTGRES_PASSWORD || '',
    {
        dialect: 'postgres',
        port: 5432,
        host: process.env.POSTGRES_HOST,
        dialectModule: pg,
        // ssl: true,
        dialectOptions: {
            ssl: {
                require: true
            }
        }
    }
)
// export const sequelize = new Sequelize((process.env.POSTGRES_URL || '')+'?sslmode=require')
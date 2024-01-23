import * as pg from 'pg';
import { Sequelize } from "sequelize";
// 'postgres://postgres:YNHdp58msWPk0C75peK2QbOD@localhost:5432/peaksel-shop'
export const sequelize = new Sequelize('peaksel_shop', 'postgres', 'YNHdp58msWPk0C75peK2QbOD', {
    dialect: 'postgres',
    port: 5432,
    host: 'localhost',
    dialectModule: pg
})
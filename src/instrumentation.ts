import { sequelize } from "./app/api/DB/db";

export async function register() {
    if (!process.env.SECRET_KEY || !process.env.HOST
        || !process.env.EMAIL || !process.env.EMAIL_PASSWORD || !process.env.BASE_URL) {
        throw new Error(`Для запуска необходимо объявить следующие ENV переменные: 
        SECRET_KEY, HOST, EMAIL, EMAIL_PASSWORD, BASE_URL`)
    }


    await sequelize.authenticate()
    await sequelize.sync()

}
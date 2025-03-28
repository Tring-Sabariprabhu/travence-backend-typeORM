import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv"
import { User } from "../modules/User/entity/User.entity";
dotenv.config()

export const dbdataSource: DataSourceOptions = {
    type: 'postgres',
    database: process.env.DATABASE_NAME ,
    entities: ['src/**/*.entity.{js,ts}'],
    // entities: [User],
    host: process.env.HOST ,
    port: Number(process.env.PORT),
    username: process.env.USER_NAME ,
    password: process.env.PASSWORD ,
    synchronize: false,
    logging: true,
    migrations: ['src/database/migrations/*.{js,ts}'],
  };
  const dataSource = new DataSource(dbdataSource);
  export default dataSource;
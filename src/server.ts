// import { createSchema } from './schema';
import dataSource from './database/data-source';

dataSource.initialize().then(async()=>{
    console.log("Database is connected");
}).catch((err)=>{
    console.log(err);
    console.log("Database is not connected");
})
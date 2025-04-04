import express from 'express';
import dataSource from './database/data-source';
import { createSchema } from './schema';
import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

dataSource.initialize()
    .then(async () => {
        console.log("Database is Connected");

        const schema = await createSchema();

        const server = new ApolloServer({ schema });
        await server.start();

        app.use(
            '/graphql',
            cors<cors.CorsRequest>(), 
            bodyParser.json(),
            expressMiddleware(server)
        );

        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}/graphql`);
        });
    })
    .catch((error) => console.log(error));

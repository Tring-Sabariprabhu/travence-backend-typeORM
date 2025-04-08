import { createSchema } from './schema';
import dataSource from './database/data-source';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';
dotenv.config();
const app = express();
app.disable('x-powered-by');


export interface MyContext{
    user: {
        user_id: string
    }
}
dataSource.initialize()
  .then(async () => {
    console.log("Database is connected");
    const schema = await createSchema();
    const server = new ApolloServer({ schema});
    await server.start();
    app.use(
      '/graphql',
      cors({
        credentials: true
      }),
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          const token = req.headers.authorization?.split(' ')[1] || '';
          if (!token) {
            return {user: null};
          }
          try {
            if(process.env.JWT_SECRET_KEY){
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                return { user: decoded };
            }
            throw new Error("Secret key not found");
          } catch (err : any) {
            throw new GraphQLError(err);
          }
        }
      })
    );
    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}/graphql`);
    });
  })
  .catch((error) => console.log(error));
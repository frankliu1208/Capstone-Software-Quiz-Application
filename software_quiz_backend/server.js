import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js'
import connect from './database/conn.js'

import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

//app represents an instance of Express.js application
//  this code configures the Express application to enable CORS with the specified options. It allows requests from http://localhost:4200
//  and includes credentials in the response. This is useful when you have a frontend application
//  running on http://localhost:4200 that needs to make requests to your Express backend.
app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}));


//----------------------------------cors workaround that also works
// Enable CORS for all routes
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//   });

app.use(express.json());
config()
const port = process.env.PORT || 3000

app.use('/api', router) //  any request that starts with "/api" will be handled by the router

connect()


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
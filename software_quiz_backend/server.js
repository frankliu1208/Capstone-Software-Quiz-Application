import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js'
import connect from './database/conn.js'

import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

//app represents an instance of Express.js application
//  this code configures the Express application to enable CORS with the specified options. It allows requests from http://localhost:4200 and includes credentials in the response. This is useful when you have a frontend application
//  running on http://localhost:4200 that needs to make requests to your Express backend.
app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']    // it allows requests from a specific origin to access the server's resources
}));

app.use(express.json()); // The express.json() middleware helps parse incoming request bodies that contain JSON data.
// When a request with a JSON payload arrives, this middleware intercepts it and attempts to parse the JSON content

config()

const port = process.env.PORT || 3000

app.use('/api', router) //  any request that starts with "/api" will be handled by the router

connect()

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


// Cross-Origin Requests: Requests made from a web page to a different origin are considered cross-origin requests.
// These requests are blocked by the browser unless explicitly allowed by CORS.

// This line utilizes the app.use method provided by Express.js. It's used to register middleware functions that
// will be executed for every incoming request before reaching the actual route handlers.
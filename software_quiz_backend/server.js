import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js'
import connect from './database/conn.js'

import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

//origin will be access the application can be the applications url
app.use(cors({
    credentials:true,
    origin:['*']
}));

app.use(express.json());
config()
const port = process.env.PORT || 3000

app.use('/api', router) //  any request that starts with "/api" will be handled by the router

connect()

// app.get('/', (req, res)=>{
//     try {
//         res.json("Get requests")
//     } catch (error) {
//         res.json(error)
//     }
// })

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
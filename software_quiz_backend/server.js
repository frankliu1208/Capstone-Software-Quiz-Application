import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js'
import connect from './database/conn.js'

const app = express();

app.use(cors());
app.use(express.json());
config()
const port = process.env.PORT || 3000
app.use('/api', router)

connect()

app.get('/', (req, res)=>{
    try {
        res.json("Get requests")
    } catch (error) {
        res.json(error)
    }
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
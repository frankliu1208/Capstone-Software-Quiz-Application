import mongoose from "mongoose";

export default async function connect(){
    await mongoose.connect(process.env.ATLAS_DATABASE_CONN_STRING)
    console.log("atlas database connected")
}
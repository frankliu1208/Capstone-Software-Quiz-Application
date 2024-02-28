import mongoose from "mongoose";

export default async function connect(){
    // need to set up MongoBD atlas first and obtain the connection string,  it is stored at .env file
    await mongoose.connect(process.env.ATLAS_DATABASE_CONN_STRING)
    console.log("atlas database connected")
}

import mongoose from "mongoose";
const { Schema } = mongoose;


const userModel = new Schema({
    userId : { type : String },
    userName : { type : String},
    userEmail : { type : String},
    isEmployer : { type : Boolean},
})

export default mongoose.model('user', userModel);  // result is the name of the collection in MongoDB database
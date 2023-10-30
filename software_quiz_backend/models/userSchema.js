
import mongoose from "mongoose";
const { Schema } = mongoose;

// commented out some orinal types to get basic register/login working
const userModel = new Schema({
    // userId : { type : String , required:true },
    userName : { type : String, required:true},
    userEmail : { type : String, required:true, unique:true},
    // isEmployer : { type : Boolean, required:true},
    userPassword : { type : String, required:true}
})

export default mongoose.model('user', userModel);  // result is the name of the collection in MongoDB database

import mongoose from "mongoose";
const { Schema } = mongoose;

// commented out some orinal types to get basic register/login working
const userModel = new Schema({
    
    userName : { type : String, required:true},
    userEmail : { type : String, required:true, unique:true},
    userPassword : { type : String, required:true},
    userQuizes: { type: [mongoose.Types.ObjectId], default: [] } // Array of Quiz ObjectIds
})

export default mongoose.model('user', userModel);  // user is the name of the collection in MongoDB database
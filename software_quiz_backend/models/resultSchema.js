
import mongoose from "mongoose";
const { Schema } = mongoose;


/** below define the rules  */
const resultModel = new Schema({
    // userId : { type : String },
    userName : { type : String},
    userEmail : { type : String},
    testDate : { type : Date},
    score : { type : Number },
    timeTaken : { type : Number}
})

export default mongoose.model('result', resultModel);  // result is the name of the collection in MongoDB database
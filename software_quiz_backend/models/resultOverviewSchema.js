
import mongoose from "mongoose";
const { Schema } = mongoose;


/** below define the rules  */
const resultOverviewModel = new Schema({
    // userId : { type : String },
    userName : { type : String},
    userEmail : { type : String},
    testDate : { type : Date},
    score : { type : Number },
    timeTaken : { type : Number}
})

export default mongoose.model('resultOverview', resultOverviewModel);  // resultOverview is the name of the collection in MongoDB database

import mongoose from "mongoose";
// Extracting the Schema object from Mongoose
const { Schema } = mongoose;


/** below define the rules  */
const resultOverviewModel = new Schema({
    candidateEmail : { type : String},
    quizId : { type : String},
    testDate : { type : Date},
    score : { type : Number, default:-1 },
    timeTaken : { type : Number, default: -1}
})

export default mongoose.model('resultOverview', resultOverviewModel);  // resultOverview is the name of the collection in MongoDB database
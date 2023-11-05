
import mongoose from "mongoose";
const { Schema } = mongoose;


/** below define the rules  */
const candidateQuizResultModel = new Schema({
    resultId : { type : String},
    resultOverviewId : { type : String},
    questionId : { type : Date},
    userAnswer : { type : Number },
    isCorrect : { type : Boolean}
})

export default mongoose.model('candidateQuizResult', candidateQuizResultModel);  // candidateQuizResult is the name of the collection in MongoDB database
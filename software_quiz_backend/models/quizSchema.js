
import mongoose from "mongoose";
const { Schema } = mongoose;


const quizModel = new Schema({
    // quizId : { type : String },  // we use default _id to act as quizId
    quizName : { type : String},
    quizTime : { type : String},
    questionNumber : { type : Number},
    createTime: { type: Date},
})

export default mongoose.model('quiz', quizModel);  // quiz is the name of the collection in MongoDB database
import mongoose from "mongoose";
const { Schema } = mongoose;


const questionModel = new Schema({
    // quizId: { type: String},
    questionId: { type : String},
    questionContent: { type : String},
    type: { type : String},
    answersItem : { type : Array, default: []},  // what should be the type?
    userAnswer: { type : String},    // what should be the type?
    correctAnser: { type: String },    // what should be the type?
});

export default mongoose.model('question', questionModel);  // question is the name of the collection in MongoDB database
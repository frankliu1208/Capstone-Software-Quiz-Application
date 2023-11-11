import mongoose from "mongoose";
const { Schema } = mongoose;


const questionModel = new Schema({
    quizId: { type: String},
    // questionId: { type : String},    // we can use _id in mongodb as the questionId
    questionContent: { type : String},
    type: { type : String},
    answersItem : { type : Array, default: []},  // what should be the type?
    // userAnswer: { type : String},
    correctAnswer: { type: String },    // what should be the type?
});

export default mongoose.model('question', questionModel);  // question is the name of the collection in MongoDB database
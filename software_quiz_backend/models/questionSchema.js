import mongoose from "mongoose";
const { Schema } = mongoose;


const questionModel = new Schema({
    quizId: { type: String},  // this property is needed as we need to know this questions shall belong to which quiz
    // questionId: { type : String},    // we can use _id in mongodb as the questionId
    questionContent: { type : String},
    type: { type : String},
    answersItem : { type : Array, default: []},
    correctAnswer: { type : Array, default: [] },
});

export default mongoose.model('question', questionModel);  // question is the name of the collection in MongoDB database
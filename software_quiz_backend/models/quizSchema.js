
import mongoose from "mongoose";
const { Schema } = mongoose;


const quizModel = new Schema({
    // quizId : { type : String },  // we use default _id to act as quizId
    quizName : { type : String},
    quizTime : { type : Number},
    // questionNumber : { type : Number},

    createTime: { type: Date},
    quizQuestions: { type: [mongoose.Types.ObjectId], default: [] } // Array of question ObjectIds
})

// quizModel.pre('save',function(next){
//     this.questionNumber = this.quizQuestions.length;
//     console.log('question count =', this.questionNumber);
//     next();
// });

export default mongoose.model('quiz', quizModel);  // quiz is the name of the collection in MongoDB database

// quizQuestions : [6550df1fda40e0c6e2836966, 6550df90da40e0c6e2836969, 6550bfa68570659f7dee4fe9, 6550bfa68570659f7dee4fe9 ]
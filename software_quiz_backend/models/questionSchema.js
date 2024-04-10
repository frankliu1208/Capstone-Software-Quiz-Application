

import mongoose from "mongoose";
const { Schema } = mongoose;

const questionModel = new Schema({
    quizId: { type: String },  // this property is needed as we need to know this question shall belong to which quiz
    questionContent: { type: String },
    type: { type: String },
    answersItem: { type: Array, default: [] },
    correctAnswer: { type: Array, default: [] },
});

// a pre-save hook in a Mongoose model in a Node.js application. It is executed before saving a document of the specified model type (questionModel).
// This hook is designed to validate certain properties of the document before it is saved to the database.
questionModel.pre('save', function(next) {
    // Validate correctAnswer based on the question type
    switch (this.type.toLowerCase()) {
        case 'tf':
            if (this.correctAnswer.length !== 1) {
                throw new Error('For True/False questions, correctAnswer should have exactly 1 element.');
            }
            break;
        case 'mc':
            if (this.correctAnswer.length !== 1) {
                throw new Error('For Multiple Choice questions, correctAnswer should have exactly 1 element.');
            }
            break;
        case 'cata':
            if (this.answersItem.length < 1) {
                throw new Error('For Check All That Apply questions, there should be at least 1 answer.');
            }
            // No validation needed for the number of correct answers
            break;
        case 'ff':
            // No validation needed for free-form questions
            break;
        default:
            throw new Error('Invalid question type.');
    }
    next();
});

export default mongoose.model('question', questionModel);


// currently this function is not so robust, which means for the free-form typed questions, the correct answer should
// only 1 element in the array. For example,  for question "Please write down which year Python was invented",
// the correct answer shall only be ["1989"].  and the user answer shall also be exactly ["1989"].  If user enters "year 1989", this function will judge as wrong answer
export function automaticEvaluateScore(userAnswersArray, correctAnswersArray) {
    if( userAnswersArray.length !== correctAnswersArray.length) {
        throw new Error("Something wrong,  the length of number of user answers is not aligned with the length of number of correct answers")
    }
    let score = 0
    let totalQuestions = correctAnswersArray.length

    for (let i = 0; i < totalQuestions; i++) {
        const userAnswers = userAnswersArray[i];
        const correctAnswers = correctAnswersArray[i];

        const isCorrect = checkAnswer(userAnswers, correctAnswers);
        // Update the score
        score += isCorrect ? 1 : 0;
    }

    // Calculate the percentage score
    const percentageScore = (score / totalQuestions) * 100;
    return percentageScore;

}


function checkAnswer(userAnswers, correctAnswers) {

    // Convert arrays to sets, because The use of Set in this context is to handle scenarios where the order of the elements in the
    // userAnswers and correctAnswers arrays does not matter, and duplicates are not relevant for the comparison.
    const userAnswerSet = new Set(userAnswers);
    const correctAnswerSet = new Set(correctAnswers);

    // Check if the user's answers match the correct answers
    return arraysEqual([...userAnswerSet], [...correctAnswerSet]);
}


// check if two arrays are equal
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}



// ------------------------------ below is just reference  -------------------------------

/*
        const userAnswers = ["A", "B", "A"];
        const correctAnswers = ["A", "B"];

        const userAnswerSet = new Set(userAnswers);
        const correctAnswerSet = new Set(correctAnswers);

        console.log(userAnswerSet);      // Set { 'A', 'B' }
        console.log(correctAnswerSet);   // Set { 'A', 'B' }

        console.log([...userAnswerSet]);      // ['A', 'B']
        console.log([...correctAnswerSet]);   // ['A', 'B']
*/

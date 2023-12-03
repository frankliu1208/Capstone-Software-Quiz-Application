import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import Quiz from '../models/quizSchema.js';
import Question from '../models/questionSchema.js';
import ResultsOverview from '../models/resultOverviewSchema.js';
import CandidateQuizResultSchema from "../models/candidateQuizResultSchema.js";
import data from "../database/data.js";
import {sendEmailToCandidate, sendEmailToEmployer} from "../utils/email.js";
import {automaticEvaluateScore} from "../utils/automaticEvaluateScore.js";

const router = Router();



// After successfully logged-in,  user will come to the application Main page.
// TODO: 1. user cannot directly come to this main page by entering the URL "/main";
router.get('/main', (req, res) => {
    console.log("redirected to the main page")
    // res.render('main');
    res.send({
        message: "Rerouting to Main Page"
    })
})


// User management section home page, the employer can get all users' information from the database, these info will be displayed
// as users list in user management section home page
router.get('/user_management_page', async (req, res) =>{
    console.log("Now you are redirected to the main page")
    try {
        const allUserInfo = await User.find({}).lean().exec()
        res.status(200).json(allUserInfo)
    } catch (error) {
        console.log(error)
    }

})


//new user register functionality:  after  successful verification, store the user info into database "user" collection
router.post('/register', async (req, res) => {
    let userName = req.body.userName;
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;
    //Hash password for security purposes
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);
    //Handle cases where user email is already in use
    const record = await User.findOne({ userEmail: userEmail })
    if (record) {
        return res.status(400).send({
            message: "Email is already in use. Please try again with a different email"
        })
    } else {
        const user = new User({
            userName: userName,
            userEmail: userEmail,
            userPassword: hashedPassword
        })
        const result = await user.save()
        // JWT Token
        const { _id } = await result.toJSON();
        const token = jwt.sign({ _id: _id }, "secret")
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000  //for one day
        })
        res.send({
            user: result,
            message: "Account Created Succesfully"
        })
    }
})


//login functionality, after successfully login, it will redirect to the application Main page
router.post('/login', async (req, res) => {
    const user = await User.findOne({userEmail:req.body.userEmail})
    //user email not found
    if(!user){
        return res.status(404).send({
            message: "User with this Email was not found"
        })
    }
    //compare password user used with stored hashed version of password
    if(!(await bcrypt.compare(req.body.userPassword, user.userPassword))){
        return res.status(400).send({
            message:"Password is incorrect"
        })
    }
    const token = jwt.sign({_id:user._id}, "secret");
    res.cookie("jwt", token, {
        httpOnly:true,
        maxAge: 24*60*60*1000 // for 1 day
    })

    // Attention:  res.send() and res.redirect() can not be used at the same time, if uncomment below res.send(),  redirect() does not work
    // res.send({
    //     message: "Login success"
    // })
    console.log("login successful")
    //  as we have defined the unified prefix "/api", so when do redirecting, don't forget to add "/api"
    res.redirect('/api/main')
})

//log the current user out

router.post('/logout', (req, res) => {
    res.cookie("jwt", "", {maxAge:0})

    res.send({
        message: "Success: User Logged out"
    })
})

// Display of current logged-in-user info (only return 1 user,  not all users)
router.get('/user', async (req, res) => {
    try {
        //get the users cookie from browser if present
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, "secret");
        //handle incorrect token or cookie not present
        if (!claims) {
            return res.status(401).send({
                message: "unauthenticated"
            })
        }
        
        const user = await User.findOne({ _id: claims._id });
        const { userPassword, ...data } = await user.toJSON();
        res.send(data);
    } catch (err) {
        return res.status(401).send({
            message: "Unauthenticated"
        })
    }
})


// find out the single user info according to the user _id, this functionality relates to User management section
// this function is used when the employer wants to edit the info of a specific user in the User Management Page.
// when employer clicks the "edit" button in the users table, frontend shall send request to this endpoint with user _id
// then this function will return that specific user info to the frontend, this info can be disployed in the edit-user-modal which is popped out after clicking "edit-user" button
// Then employer can enter renewed user info and then click "submit" button, then it will go to '/update_user' endpoint and trigger that route handling function
router.post('/find_single_user', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body._id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { userPassword, ...data } = await user.toJSON();
        res.send(data);
    } catch (err) {
        return res.status(401).send({
            message: "Unauthenticated"
        })
    }
})


// Add new user by  employer,  this functionality relates to User management section
// please remember:  change the psd into hash format;  verify that user is not existed in database
router.post('/add_new_user',  async (req,res)=> {
    if(!req.body){
        res.status(400).send({ message : "Content is empty!"})
    }

    let userName = req.body.userName
    let userEmail = req.body.userEmail
    let userPassword = req.body.userPassword

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userPassword, salt)
    const record = await User.findOne({ userEmail: userEmail })
    if (record) {
        return res.status(400).send({
            message: "Email is already in use. Please add the user with a different email"
        })
    } else {
        const user = new User({
            userName: userName,
            userEmail: userEmail,
            userPassword: hashedPassword,
        })

        user.save(user)
            .then(data => {
                res.redirect('/api/user_management_page')
            })
            .catch(err =>{
                res.status(500).send({
                    message : err.message || "Error happened during adding user process"
                });
            });
    }
} )


// Update the user info, this functionality relates to User management section
// dynamic url:  "/:id" aims to tell the below function which user needs to be updated.  Updated contents from the user input at the frontend
// will be transfered to below function through req.body
router.put('/update_user/:id', async (req, res) => {

    let userPassword = req.body.userPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    User.findByIdAndUpdate(req.params.id,
        {
            $set : {
                userName: req.body.userName,
                userEmail: req.body.userEmail,
                userPassword: hashedPassword,
            }
        }, {new: true}).then(data =>{
            if(!data){
                res.status(404).send({
                    message: "cannot update the user information"
                })
            }else {
                res.status(200).send(data);
            }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating the user information"
        })
    })
})


// Delete the user info according to that user's _id,  this functionality relates to User management section
// "/:id" is the dynamic url,  the frontend need to provide the user id (in mongodb it is the unique _id of that user) to the below function
// so that the below function knows which user should be deleted
router.delete('/delete_user/:id', async (req, res) => {

    const id = req.params.id;

    User.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete user with id=${id}!`
                });
            } else {
                res.send({
                    message: "The user was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Errors, could not delete User with id=" + id
            });
        });
})

// -------------------------------- Quiz management section below ------------------------------


// Quiz management section home page, the employer can get all quiz's basic information from the database, these info will be displayed
// as a list in quiz management section home page
// property "_id" of every quiz will be sent to the frontend. This property is very useful for the edit-quiz, delete-quiz functionality
router.get('/quiz_management_page', async (req, res) =>{
    console.log("Now you are at quiz management section home page")
    try {
        const allQuizInfo = await Quiz.find({}).lean().exec()
        res.status(200).json(allQuizInfo)
    } catch (error) {
        console.log(error)
    }
})

// in quiz management section home page, the employer can click the "eye icon" button of every quiz item in the quiz dispalying list, then
// the function below will be triggered. (frontend need to provide quizId when making request)
router.get('/view_quiz_details/:quizId', async (req, res) => {
    console.log("Now the employer just clicked eye-shaped button to view the quiz details")
    console.log(`quiz id:  ${req.params.quizId}`)
    try {
        const allQuestions = await Question.find({  quizId: req.params.quizId }).lean().exec()
        const basicQuizInfo = await Quiz.find({_id: req.params.quizId}).lean().exec()
        console.log(allQuestions)
        console.log(basicQuizInfo)
        // combine the 2 infos together
        const detailedQuizInfo = [...basicQuizInfo, ...allQuestions ]
        res.status(200).json(detailedQuizInfo) // send back to frontend. in the detailedQuizInfo array, first element is the basic quiz info from quiz collection, elements later are questions info
    } catch (error) {
        console.log(error)
    }

})


// after clicking the "Create Quiz" button in quiz managemnet section home page, a modal is popped to let user enter quiz basic information
// then user clicks "Save Quiz" button, it will trigger below route function to save quiz basic info into database "quiz" collection
router.post('/create_new_quiz',  async (req,res)=> {
    if(!req.body){
        res.status(400).send({ message : "Create new quiz functionality: Content in request body is empty!"})
    }

    let quizName = req.body.quizName
    let quizTime = req.body.quizTime
    let questionNumber = req.body.questionNumber
    let createTime = Date.now()

    const quiz = new Quiz({
        quizName: quizName,
        quizTime: quizTime,
        questionNumber: questionNumber,
        createTime: createTime,
    })

    quiz.save(quiz)
        .then(data => {
            res.redirect('/api/quiz_management_page')
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Error happened during creating quiz process"
            });
        });
} )


// User can click "Edit Quiz" button, a modal will be popped out to let user edit the basic information of quiz, after clicking "submit" button,
// the updated contents will be saved in "quiz" collection in database,  and user will return back to quiz management home page
router.put('/update_quiz/:quizId', async (req, res) => {
    // 3rd parameter: {new: true} means that the returned data will get the updated content
    Quiz.findByIdAndUpdate(req.params.quizId,
        {
            $set : {
                quizName: req.body.quizName,
                quizTime: req.body.quizTime,
                questionNumber: req.body.questionNumber,
            }
        }, {new: true}).then(data =>{
        if(!data){
            res.status(404).send({
                message: "cannot update the quiz information"
            })
        }else {
            res.status(200).send(data); // the updated content will send to the frontend, so that the quiz list in quiz management home page can be updated
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating the quiz information"
        })
    })
})


// Delete the quiz basic info according to that quiz's _id,  this functionality relates to Quiz management section
// "/:quizId" is the dynamic url,  the frontend need to provide the quiz id (in mongodb it is the unique _id of that quiz) to the below function
// so that the below function knows which quiz should be deleted
// TODO: questions related to that deleted quiz shall also be deleted
router.delete('/delete_quiz/:quizId', async (req, res) => {

    const quizId = req.params.quizId;

    Question.deleteMany({quizId: quizId})
        .then(data => {
            if (!data) {
                console.log(`Cannot delete related questions with quizId=${quizId}!`)
            } else {
                console.log("The questions related to the quiz was deleted successfully!")
            }
        })
        .catch(err => {
            console.log("Errors, could not delete the related questions")
        });

    Quiz.findByIdAndRemove(quizId)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete quiz with quizId=${quizId}!`
                });
            } else {
                res.send({
                    message: "The quiz was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Errors, could not delete the quiz with id=" + quizId
            });
        });
})


// Quiz management section home page, the user can click "view questions" button of a specific quiz,  then a "view question modal"
// will be opened, already-added-questions will be displayed here,  there will be add questions, edit question, delete question buttons
router.get('/open_view_questions_modal/:quizId', async (req, res) =>{
    console.log("Now you are at view questions modal")
    console.log(`this modal belongs to the quiz id ${req.params.quizId}`)
    try {
        const allQuestions = await Question.find({  quizId: req.params.quizId }).lean().exec()
        res.status(200).json(allQuestions)
    } catch (error) {
        console.log(error)
    }
})



// in quiz management home page, the user can click "view question" button of a specific quiz to open "view question modal", In this modal,
// the questions list will be displayed.  The user can click "add question" button in this modal to open another modal, which let user enter
// question type, question answers item,  correct answer etc...  then user can click "submit" button,  the below function will be triggered to save
// contents to database. The user will come back to "view question modal", newly added question will be displayed in the questions list
router.post('/add_questions/:quizId',  async (req,res)=> {
    if(!req.body){
        res.status(400).send({ message : "Add new question functionality: Content in request body is empty!"})
    }
    let quizId = req.params.quizId
    let questionContent = req.body.questionContent
    let type = req.body.type    // 4 different types: single choice, multiple choice, T/F, free form
    let answersItem = req.body.answersItem
    let correctAnswer = req.body.correctAnswer

    const question = new Question({
        quizId: quizId,
        questionContent: questionContent,
        type: type,
        answersItem: answersItem,
        correctAnswer: correctAnswer,
    })

    question.save(question)
        .then(data => {
            res.redirect(`/api/open_view_questions_modal/${quizId}`)
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Error happened during adding questions process"
            });
        });
} )



// "/:quizId": the frontend need to provide the quiz id (in mongodb it is the unique _id of that quiz) to the below function
// "/:questionId":  in mongodb this is the unique _id of the question in question collection.  frontend also need to provide such info to the below function
// in "view question modal", the questions list will be displayed.  The user can click "edit question" button of a specific question in this modal to open another modal,
// after editing, user can click "submit" button,  the below function will be triggered to save contents to database.
// The user will come back to "view question modal", edited-question will be displayed in the questions list
router.put('/update_questions/:quizId/:questionId', async (req, res) => {
    // 3rd parameter: {new: true} means that the data will get the updated content
    let quizId = req.params.quizId
    Question.findByIdAndUpdate(req.params.questionId,
        {
            $set : {
                questionContent: req.body.questionContent,
                type: req.body.type,
                answersItem: req.body.answersItem,
                correctAnswer: req.body.correctAnswer
            }
        }, {new: true}).then(data =>{
        if(!data){
            res.status(404).send({
                message: "cannot update the question"
            })
        }else {
            res.redirect(`/api/open_view_questions_modal/${quizId}`)
            // res.status(200).send(data); // the updated content will send to the frontend, so that the edited questions can be displayed in the question list in "view question modal"
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating the question "
        })
    })
})



// Delete the question according to that question's _id,  this functionality relates to Quiz management section
// "/:questionId" is the dynamic url,  the frontend need to provide question id (in mongodb it is the unique _id of that question) to the below function
// so that the below function knows which question should be deleted. After the deleting operation, The user will come back to "view question modal"
router.delete('/delete_questions/:quizId/:questionId', async (req, res) => {

    const questionId = req.params.questionId
    let quizId = req.params.quizId

    Question.findByIdAndRemove(questionId)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete question with questionId=${questionId}!`
                });
            } else {
                res.redirect(`/api/open_view_questions_modal/${quizId}`)

            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Errors, could not delete the question with id=" + questionId
            });
        });
})

// -------------------------------- Review results section below ------------------------------

// Review results section home page, the employer can get all already-finished quiz's basic information from the database, these info will be displayed as a list.
router.get('/review_results_home_page', async (req, res) =>{
    console.log("Now you are at reveiw results section home page")
    try {
        const allFinishedQuizInfo = await ResultsOverview.find({}).lean().exec()
        res.status(200).json(allFinishedQuizInfo)
    } catch (error) {
        console.log(error)
    }
})

// in Review Result section home page, the employer can click the "eye icon" button of every quiz item in the quiz dispalying list, then
// the function below will be triggered. (frontend need to provide quizId when making request)
router.get('/view_already_finished_quiz_details/:resultOverviewId', async (req, res) => {
    console.log("Now the employer just clicked eye-shaped button to view the already-finished quiz details")
    console.log(`Employer wants to see the detailed info of an already-finished quiz with quiz id:  ${req.params.quizId}`)
    try {
        const basicFinishedQuizInfo = await ResultsOverview.find({ _id : req.params.resultOverviewId}).lean().exec()
        const allFinishedQuestions = await CandidateQuizResultSchema.find({ resultOverviewId: req.params.resultOverviewId }).lean().exec()
        console.log(basicFinishedQuizInfo)
        console.log(allFinishedQuestions)
        // combine the 2 infos together
        const detailedFinishedQuizInfo = [...basicFinishedQuizInfo, ...allFinishedQuestions ]
        res.status(200).json(detailedFinishedQuizInfo) // send back to frontend. in the detailedQuizInfo array, first element is the basic quiz info from quiz collection, elements later are questions info
    } catch (error) {
        console.log(error)
    }
})


// -------------------------------- Send quiz to candidate section below ------------------------------


// "Send-quiz-to-candidate" section home page, after the employer clicks "Administer Quiz" in the application landing home page,
// below functions will be triggered,   quiz list will be fetched from database and send to frontend, so that:
// employer can go to send-quiz-to-candidate section home page, he/she can enter the candidate's email address and choose the quiz from a drop-down-list
router.get('/send_quiz_to_candidate_home_page', async (req, res) =>{
    console.log("Now you are at send quiz to candidate section home page, you can enter candidate's email address and choose a quiz")
    try {
        const allQuizInformation = await Quiz.find({}).lean().exec()
        res.status(200).json(allQuizInformation)
    } catch (error) {
        console.log(error)
    }
})


// after employer enters candidate's email and chooses the quiz, he/she clicks "Send Test" button, below functions will be triggered
// frontend need to provide candidate email address, quizId and quiz name in the request body
router.post('/send_mail_to_candidate', async (req, res) => {
    if(!req.body){
        res.status(400).send({ message : "Send email to candidate functionality: Content in request body is empty!"})
    }
    // frontend should provide below 2 parameters to this route function
    let candidateEmailAddress = req.body.candidateEmailAddress
    let quizId = req.body.quizId
    let quizName = req.body.quizName

    // below function is to implement sending email to candidate using nodemailer library
    await sendEmailToCandidate(candidateEmailAddress, quizId, quizName)
    res.status(200).send({ message : "Send email to candidate successfully"})
})

// the candidate opens the email which is sent by employer, and clicks the link. then below function is triggered: the quiz name will be displayed, some sentences to tell the candidate that he/she is about to take the quiz of "quizName"
// a "Start the Quiz" button will be put in this page
// a new frontend page needs to be designed for the candidates to take the quiz.
// (Three pages needed: 1. home page displaying the basic info of the quiz that the candidate is about to take;
// 2. taking quiz page which all questions are displayed and candidates can choose/enter the answer, a count-down timer is also needed;
// 3. closing page: when candidates submit the quiz, a message displaying "you have finished the quiz", the score might be also displayed here because after submitting the quiz, our application should calculate the score automatically)
router.get('/candidate_take_quiz/:quizId', async (req, res) => {
    console.log("The candidate has clicked the link in the email")
    console.log(`the quiz id getting from the sendEmailToCandiate function is :  ${req.params.quizId}`)
    try {
        const basicQuizInfo = await Quiz.find({_id: req.params.quizId}).lean().exec()
        console.log(basicQuizInfo)
        // send back to frontend.  these information can be displayed at "candidate quiz starting page"
        res.status(200).json(basicQuizInfo)
    } catch (error) {
        console.log(error)
    }
})


// the candidate clicks "begin quiz" button at candidate quiz starting page, frontend need to send quizId and candidateEmail when making request
// backend will return quiz info and all questions related to that quiz.  frontend can render these info into 1 page or several pages so candidate can enter answers
// additionally, save candidateEmail, quizId, testDate into result-overview collection,  other column just put the default value to "-1". Because we need the _id of the saved item and it will be used later
router.get('/quiz_started_for_candidate/:candidateEmail/:quizId', async (req, res) => {

    console.log(`Now candidate has clicked begin-quiz button, backend will send all related questions to frontend,  quiz id from frontend is:  ${req.params.quizId}`)
    try {
        let quizId = req.params.quizId
        let candidateEmail = req.params.candidateEmail
        let testDate = Date.now()

        const resultsOverview = new ResultsOverview({
            candidateEmail: candidateEmail,
            quizId: quizId,
            testDate: testDate,
        })

        let resultOverviewSheetData
        resultsOverview.save(resultsOverview)
            .then(data => {
                console.log("Save some data into result overview collection")
                resultOverviewSheetData = data
            })
            .catch(err =>{
                res.status(500).send({
                    message : err.message || "Error happened during candidate begining quiz process"
                });
            });

        const allQuestions = await Question.find({  quizId: req.params.quizId }).lean().exec()
        const basicQuizInfo = await Quiz.find({_id: req.params.quizId}).lean().exec()

        console.log(resultOverviewSheetData)  // later in below '/candidat_submit_quiz' route function, we need the value of "_id" in the object "resultOverviewSheetData", this is the reason we integrate into detailedQuizInfo array

        // combine result overview sheet info,  quizinfo, all questions together
        const detailedQuizInfo = [ resultOverviewSheetData, ...basicQuizInfo, ...allQuestions ]


        // send back to frontend.  some infos from detailedQuizInfo array are needed later when candidate submit the quiz
        // for example: later backend need the value of "_id" in the object "resultOverviewSheetData", in below route function,  backend need "_id" from "let resultOverviewId = req.body.resultOverviewId"  (_id and resultOverviewId is the same thing)
        // therefore,  when frontend get these data from here,  need to store these data in some form.  (like "_id" is useful for backend but does not have any sence for common user,  then one possible way is to put it into a hidden item within the form)
        res.status(200).json(detailedQuizInfo)

    } catch (error) {
        console.log(error)
    }
})



// after clicking "submit" button, or time is running out,  the frontend will send post request, the answers entered by candidate will be sent
// to below handling function. The handling function below will save (actually is updating because we only update the score, for other columns they already have data) the related results into result overview collection,
// and return the score back to frontend. so the candidate can directly see the result of the submitted test
router.post('/candidat_submit_quiz', async (req, res) =>{
    if(!req.body){
        res.status(400).send({ message : "Candidate submits the quiz: Content in request body is empty!"})
    }

    // frontend should provide below parameters to this route function
    let resultOverviewId = req.body.resultOverviewId   // later we have to update score and timeTaken into existing item in result overview sheet, therefore, here we need resultOverviewId
    let timeTaken = req.body.timeTaken
    let candidateEmail = req.body.candidateEmail  // later backend will send email to the employer with candidate email info

    /* structure like:   (json-format) (please take care of the type of property "userAnswers", please go to our MongoDB database, questions collection, take a look at "correctAnswer" in each item.  userAnswer shall be the same type with correctAnswer under every question type)
        candidateAnswersArray = [
            {
            "questionId": "...1...",
            "userAnswer": ["A"]
            },
            {
            "questionId": ".....2....",
            "userAnswer": ["A","B","C"]
            },
            {
            "questionId": "....3.....",
            "userAnswer": ["T"]
            },
            {
            "questionId": "......4.....",
            "userAnswer": ["this is free form answer"]
            }
        ]
    */
    let candidateAnswersArray = req.body.candidateAnswersArray


    // below get all user answers from above structure and keep them into a two-dimensional array, structure will be like:
    //  [
    //     ["A"],
    //     ["A", "B", "C"],
    //     ["T"],
    //     ["this is free form answer"]
    //  ]
    const allUserAnswers = candidateAnswersArray.map(answer => answer.userAnswer)


    // allQuestionIds will be the structure: ["...1...", ".....2....", "....3.....", "......4....."]
    const allQuestionIds = candidateAnswersArray.map(answer => answer.questionId)

    // according to question id,  use findById() to get the correctAnswer of each question
    try {
        // correctAnswerArray is two-demensional array
        let correctAnswerArray = []
        for (let i=0; i < allQuestionIds.length; i++) {
            const questionId = allQuestionIds[i]
            const questionInfo = await Question.findById(questionId).lean().exec()
            if (questionInfo && questionInfo.correctAnswer) {
                const correctAnswer = questionInfo.correctAnswer
                correctAnswerArray.push(correctAnswer)
            } else {
                console.error(`Question not found for ID: ${questionId}`)
            }
        }

        // call the automaticEvaluateScore() to get the score,  here get the percentage score
        const percentageScore = automaticEvaluateScore( allUserAnswers, correctAnswerArray )


        // save data into result overview collection
        ResultsOverview.findByIdAndUpdate(resultOverviewId,
            {
                $set : {
                    score: percentageScore,
                    timeTaken: timeTaken,
                }
            }, {new: true}).then(data =>{
            if(!data){
                res.status(404).send({
                    message: "cannot update the quiz overview sheet"
                })
            }else {
                console.log(`sucessfully update the result overview sheet: ${data}`)
            }
        }).catch(err => {
            res.status(500).send({
                message: "Error updating the quiz overview sheet"
            })
        })

        await sendEmailToEmployer(candidateEmail)
        // send the score back to frontend so the score can be displayed after candidate submits the quiz
        res.status(200).json(percentageScore)

    } catch (error) {
        console.log(error)
    }
})


export default router;
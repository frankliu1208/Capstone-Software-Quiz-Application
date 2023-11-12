import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import Quiz from '../models/quizSchema.js';
import Question from '../models/questionSchema.js';
import data from "../database/data.js";

const router = Router();



// After successfully logged-in,  suer will come to the application Main page.
// TODO: 1. user cannot directly come to this main page by entering the URL "/main";
router.get('/main', (req, res) => {
    console.log("redirected to the main page")
    // res.render('main');
    res.send({
        message: "Main Page"
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
    // 3rd parameter: {new: true} means that the data will get the updated content
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
router.delete('/delete_quiz/:quizId', async (req, res) => {

    const quizId = req.params.quizId;

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


// in the create-quiz-modal, the user can click "add question" button to open "add question modal", then user can enter question content, answer items, correct answer etc
// in the modal,  after clicking "submit" button,  the below function will be triggered.
router.post('/add_questions',  async (req,res)=> {
    if(!req.body){
        res.status(400).send({ message : "Add new question functionality: Content in request body is empty!"})
    }
    let quizId       // TODO: how to get quizId
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
            res.redirect('/api/open_create_quiz_modal')
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Error happened during adding questions process"
            });
        });
} )









export default router;
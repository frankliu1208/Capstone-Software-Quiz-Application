import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import data from "../database/data.js";

const router = Router();



// After successfully logged-in,  come to this main page.
// TODO: 1. user cannot directly come to this main page by entering the URL "/main";
//  2. in the future, employer and candidates shall have different main page
router.get('/main', (req, res) => {
    console.log("redirected to the main page")
    // res.render('main');
    res.send({
        message: "Main Page"
    })
})


// User management page, TODO: get all users' information from the database
router.get('/user_management_page', async (req, res) =>{
    console.log("Now you are redirected to the main page")
    try {
        const allUserInfo = await User.find({}).lean().exec()
        res.status(200).json(allUserInfo)
    } catch (error) {
        console.log(error)
    }

})



//new user register functionality:  after the sucessful verification, store the user info into user collection
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



//login functionality, after sucessfully login, it will redirect to the main page
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




// returns user information concerning the currently logged in user (only return 1 user,  not all users)
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



// return the single user info according to the user _id
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



// add new user by the employer in User Management Section
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



// Update the user info, this is related to User Management Section
router.put('/update_user', async (req, res) => {

    let userPassword = req.body.userPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    User.findByIdAndUpdate(req.body._id,
        {
            $set : {
                userName: req.body.userName,
                userEmail: req.body.userEmail,
                userPassword: hashedPassword
            }
        }).then(data =>{
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




export default router;
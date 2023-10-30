import { Router } from "express";
import * as controller from '../controllers/controller.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/userSchema.js';
import data from "../database/data.js";

const router = Router();

// This line specifies a base URL path of "/questions" for the routes defined within this router.
// All routes chained after this line will be relative to "/questions."
router.route('/questions')
    .get(controller.getQuestions)  // when a "GET" request is made to "/questions," the getQuestions function will handle it.
    .post(controller.insertQuestions)
    .delete(controller.dropQuestions)

router.route('/result')
    .get(controller.getResult)   // When a GET request is made to the "/result" endpoint, the getResult function from the controller module will be called to handle the request.
    .post(controller.storeResult)
    .delete(controller.dropResult)


//handles registration of a new user
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
    }

    else {
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
            message: "Success"
        })
    }
})

//login to a users profile
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

    res.send({
        message: "success"
    })
})


// returns all the data of the currently logged in user
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



export default router;
// Attention!
// this file is temporarily invalid, all the route handling functions are defined in route.js

import Questions from "../models/questionSchema.js"
import Results from "../models/resultOverviewSchema.js"
import questions, { answers } from '../database/data.js'

//
// export async function getQuestions(req, res){
//     try {
//         const q = await Questions.find();
//         res.json(q)
//     } catch (error) {
//         res.json({ error })
//     }
// }
//
//
// /** insert all questinos */
// export async function insertQuestions(req, res){
//     try {
//         await Questions.insertMany({questions: questions, answers: answers}).then(function (err, data) {
//             res.json({msg: "Data Saved Successfully...!"})
//         })
//     } catch (error) {
//         res.json({ error })
//     }
// }
//
// /** Delete all Questions */
// export async function dropQuestions(req, res){
//     try {
//         await Questions.deleteMany();
//         res.json({ msg: "Questions Deleted Successfully...!"});
//     } catch (error) {
//         res.json({ error })
//     }
// }

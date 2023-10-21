import Questions from "../models/questionSchema.js"
import Results from "../models/resultSchema.js"

export async function getQuestons(req, res){
    try {
        const q = await Questions.find()
        res.json(q)
    } catch (error) {
        res.json({ error })
    }
}

export async function insertQuestions(req, res){
    res.json("questions api post request")
}
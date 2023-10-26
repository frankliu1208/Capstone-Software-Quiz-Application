
import mongoose from "mongoose";
const { Schema } = mongoose;


/** below define the rules  */
const resultModel = new Schema({
    username : { type : String },
    result : { type : Array, default : []},
    attempts : { type : Number, default : 0},
    points : { type : Number, default : 0},
    achived : { type : String, default : ''},
    createdAt : { type : Date, default : Date.now()}
})

export default mongoose.model('result', resultModel);  // result is the name of the collection in MongoDB database
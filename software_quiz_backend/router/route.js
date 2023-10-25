import { Router } from "express";
import * as controller from '../controllers/controller.js'

const router = Router();


router.route('/questions')
    .get(controller.getQuestions)
    .post(controller.insertQuestions)
    .delete(controller.dropQuestions)

router.route('/result')
    .get(controller.getResult)   // When a GET request is made to the "/result" endpoint, the getResult function from the controller module will be called to handle the request.
    .post(controller.storeResult)
    .delete(controller.dropResult)


export default router;
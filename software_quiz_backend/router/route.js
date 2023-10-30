import { Router } from "express";
import * as controller from '../controllers/controller.js'

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


export default router;
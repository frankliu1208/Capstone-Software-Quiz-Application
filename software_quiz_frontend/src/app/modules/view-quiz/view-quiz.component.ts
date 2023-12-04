import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.scss']
})
export class ViewQuizComponent implements OnInit {
  quizId: string | null;
  quizQuestions: any[] = []; 
  questionContent: string;
  type : string;
  answerItem : any[] = [];
  correctAnswer: any[] = [];
  



  // quizInfo : any[] = [];

  constructor(private route: ActivatedRoute) {}

  addQuestionForm: any = {
    quizId: '',
    questionContent: '',
    type: '',
    answersItem: [],
    correctAnswer: [],
    
 
    // Add other form fields for options, correct answer, etc.
  };

  addQuestion(): void {
    // Make an API call to add the question using this.addQuestionForm
    // After a successful response, update the UI with the new question

    //Options for True-False
    if (this.addQuestionForm.type === 'tf') {
      this.addQuestionForm.answersItem = [{'label': 'T', 'content':'T'}, {'label': 'F', 'content':'F'}];
  }
  
  //add question to quizQuestions array

  //Create Question
  // axios.post(`http://localhost:5000/api/add_questions/${this.quizId}`, this.addQuestionForm)
    
  }
  ngOnInit(): void {
    // Subscribe to changes in the route parameters
    this.route.paramMap.subscribe(async params => {
      // Retrieve the quizId from the paramMap
      this.quizId = params.get('id');

      // Check if quizId is not null before using it
      if (this.quizId !== null) {
        // retrieve all the questions
        this.quizQuestions = await this.getQuestions(this.quizId);
        // console.log('Quiz Questions:', this.quizQuestions);
      }
    });
  }

  async getQuestions(quizId: string): Promise<any[]> {
    try {
        // Make an API call or perform any asynchronous operation to get quiz info
        const response = await axios.get(`http://localhost:5000/api/view_quiz_details/${quizId}`);
        const questionIdsArray = response.data[0].quizQuestions
        console.log(questionIdsArray);
        const questionDetailsPromises = questionIdsArray.map(async (questionId: string) =>{
          const response = await axios.get(`http://localhost:5000/api/view_question/${questionId}`)
          return response.data;
        });

        const allQuestions = await Promise.all(questionDetailsPromises);
        console.log(allQuestions);
        return allQuestions;
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching questions:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

}
// 6550df1fda40e0c6e2836966     6550df90da40e0c6e2836969    6550e069da40e0c6e283696c
//  6550e0c3da40e0c6e283696f
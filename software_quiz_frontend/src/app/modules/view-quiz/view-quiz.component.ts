import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import Swal from 'sweetalert2';

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
  quizName :string ;
  quizTime: number;

  



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

  updateQuiz(): void {
    // Call your API or perform necessary logic for updating quiz
    axios.put(`http://localhost:5000/api/update_quiz/${this.quizId}`, {
     quizName : this.quizName,
     quizTime : this.quizTime
   });
   Swal.fire({
    icon: 'success',
    title: 'Success',
    text: `Quiz Info updated`,
  })
  }
  deleteQuestion(questionId:string): void{
    

     // Make an API call or perform any asynchronous operation to get quiz info
 axios.get(`http://localhost:5000/api/view_quiz_details/${this.quizId}`)
 .then(async (response) => {
   const questionIdsArray = response.data[0].quizQuestions;

  
  //  console.log("old array", questionIdsArray)
   const newQuestionsIdsArray = questionIdsArray.filter((id: string)=> id !== questionId)
  //  console.log("new array", newQuestionsIdsArray)

   // Example: add new question object to quizQuestions array
   await axios.put(`http://localhost:5000/api/update_quiz/${this.quizId}`, {
     quizQuestions: newQuestionsIdsArray,
   });
   
 axios.delete(`http://localhost:5000/api/delete_questions/${questionId}`)

 Swal.fire({
  icon: 'success',
  title: 'Success',
  text: `Question Deleted`,
}).then(()=> { window.location.href = `/view-quiz/${this.quizId}`;})
  
 })
 .catch(error => {
   console.error('Error getting quiz details:', error.response.data.message);
 });

    

  }

  addQuestion(): void {
    // Make an API call to add the question using this.addQuestionForm
    // After a successful response, update the UI with the new question

    //Options for True-False
    if (this.addQuestionForm.type === 'tf') {
      this.addQuestionForm.answersItem = [{'label': 'T', 'content':'T'}, {'label': 'F', 'content':'F'}];
  }

    if(this.addQuestionForm.type === 'mc'){

      // this.addQuestionForm = {
      //   quizId: '',
      //   questionContent: '',
      //   type: '',
      //   answersItem: [],
      //   correctAnswer: []
      // }

      this.addQuestionForm.answersItem =
      [
        {
          'label' : 'A',
          'content': `${this.addQuestionForm.answersItem[0]}`
        },
        {
          'label' : 'B',
          'content': `${this.addQuestionForm.answersItem[1]}`
        },
        {
          'label' : 'C',
          'content': `${this.addQuestionForm.answersItem[2]}`
        },
        {
          'label' : 'D',
          'content': `${this.addQuestionForm.answersItem[3]}`
        },

      ]
    }


    if(this.addQuestionForm.type === 'cata'){

      // this.addQuestionForm = {
      //   quizId: '',
      //   questionContent: '',
      //   type: '',
      //   answersItem: [],
      //   correctAnswer: []
      // }

      this.addQuestionForm.answersItem =
      [
        {
          'label' : 'A',
          'content': `${this.addQuestionForm.answersItem[0]}`
        },
        {
          'label' : 'B',
          'content': `${this.addQuestionForm.answersItem[1]}`
        },
        {
          'label' : 'C',
          'content': `${this.addQuestionForm.answersItem[2]}`
        },
        {
          'label' : 'D',
          'content': `${this.addQuestionForm.answersItem[3]}`
        },

      ]
    }

  let newQuestionId = '';

   // Create Question
   axios.post(`http://localhost:5000/api/add_questions/${this.quizId}`, this.addQuestionForm)
   .then(response => {
     newQuestionId = response.data.id;
   })
   .catch(error => {
     console.error('Error adding question:', error.response.data.message);
   });

 // Make an API call or perform any asynchronous operation to get quiz info
 axios.get(`http://localhost:5000/api/view_quiz_details/${this.quizId}`)
   .then(async (response) => {
     const questionIdsArray = response.data[0].quizQuestions;
    
     // Example: add new question object to quizQuestions array
     await axios.put(`http://localhost:5000/api/update_quiz/${this.quizId}`, {
       quizQuestions: [newQuestionId, ...questionIdsArray],
     });
     // Reset addQuestionsForm to its default values
     this.addQuestionForm = {
      quizId: '',
      questionContent: '',
      type: '',
      answersItem: [],
      correctAnswer: [],
      // Add other form fields for options, correct answer, etc.
  };
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: `Question Added`,
  }).then(()=> { window.location.href = `/view-quiz/${this.quizId}`;})
    
   })
   .catch(error => {
     console.error('Error getting quiz details:', error.response.data.message);
   });

  };

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

        //store quiz info for showing/updating it from the view/modify screen
        this.quizName = response.data[0].quizName
        this.quizTime = response.data[0].quizTime


        // console.log('array of questions is',questionIdsArray);
        const questionDetailsPromises = questionIdsArray.map(async (questionId: string) =>{
          const response = await axios.get(`http://localhost:5000/api/view_question/${questionId}`)
          return response.data;
        });

        const allQuestions = await Promise.all(questionDetailsPromises);
        // console.log(allQuestions);
        return allQuestions;
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching questions:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-candidate-quiz-started',
  templateUrl: './candidate-quiz-started.component.html',
  styleUrls: ['./candidate-quiz-started.component.scss']
})
export class CandidateQuizStartedComponent {

  quizId: string;
  candidateEmail: string; 
  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.quizId = params['id']; // 'id' should match the parameter name in your route
      this.candidateEmail = params['email']
      console.log('Quiz', this.quizId);
      console.log('email', this.candidateEmail)
    
    });
  }

// take quiz gets the quiz
  // async takeQuiz(quizId: string) {
  //   try {
  //     // Get candidate's email
  //     const checkEmail = await axios.get(`http://localhost:5000/api/current_candidate_email`);
  //     console.log(checkEmail.data);
  //     const candidateEmail = checkEmail.data;
  
  //     // Start Quiz data for after rerouted from start
  //     axios.get(`http://localhost:5000/api/quiz_started_for_candidate/${candidateEmail}/${quizId}`)
  //       .then(response => {
  //         // Handle the response if needed
  //         console.log(response.data);
  //       })
  //       .catch(error => {
  //         // Handle errors
  //         console.error('Error starting quiz:', error);
  //       });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

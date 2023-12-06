import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({

  
  selector: 'app-candidate-take-quiz',
  templateUrl: './candidate-take-quiz.component.html',
  styleUrls: ['./candidate-take-quiz.component.scss']
})
export class CandidateTakeQuizComponent {

  quizId: string;
  quizDetails: any; 


  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.quizId = params['id']; // 'id' should match the parameter name in your route
      // console.log(this.quizId);
      try {
        this.quizDetails = await this.getQuizDetails(this.quizId);
        // console.log(this.quizDetails);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    });
  }

  async getQuizDetails(quizId: string): Promise<any> {
    try {
      const response = await axios.get(`http://localhost:5000/api/view_quiz_details/${quizId}`);
      return response.data[0];
    } catch (error) {
      throw error;
    }
  }

  async takeQuiz(quizId: string) {
    try {
      // Get candidate's email
      const checkEmail = await axios.get(`http://localhost:5000/api/current_candidate_email`);
      // console.log(checkEmail.data);
      const email = checkEmail.data.email;

      // console.log('email is:', email);
      // console.log(quizId);

      window.location.href = `/candidate-quiz-started/${email}/${quizId};`
      // this.router.navigate(['/candidate-quiz-started', email, quizId]);
    } catch (error) {
      throw error;
    }
  }
  
  
}

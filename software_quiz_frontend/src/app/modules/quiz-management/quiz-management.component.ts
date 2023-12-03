import { Component, ChangeDetectorRef } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-quiz-management',
  templateUrl: './quiz-management.component.html',
  styleUrls: ['./quiz-management.component.scss']
})
export class QuizManagementComponent {
  data: any[] = [];

  constructor(private cdr: ChangeDetectorRef){};
  ngOnInit(): void {
    this.loadData();
  }



  async loadData(): Promise<void> {
    try {
      const quizDetails = await this.getQuizDetailsForUserQuizes();
      // console.log('Quiz Details:', quizDetails);
  
      // Assuming quizDetails is an array of objects with properties matching your MongoDB schema
      this.data = quizDetails.map((quiz) => ({
        quizName: quiz[0].quizName,
        time: quiz[0].quizTime,
        questions: quiz[0].questionNumber,
        createDate: quiz[0].createTime,
        quizId:quiz[0]._id, // quiz id's from userQuizes array
      }));
  
      this.cdr.detectChanges(); // Trigger change detection
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      // Handle errors if needed
    }
  }
  
  

  async getQuizDetailsForUserQuizes(): Promise<any[]> {
    try {
      
      const currentUser = await axios.get('http://localhost:5000/api/user',{withCredentials:true});
      const userQuizes = currentUser.data.userQuizes;
  
      const quizDetailsPromises = userQuizes.map(async (quizId: string) => {

        const response = await axios.get(`http://localhost:5000/api/view_quiz_details/${quizId}`);
        return response.data;
      });
  
      const quizDetails = await Promise.all(quizDetailsPromises);
      return quizDetails;
    } catch (error) {
      throw error;
    }
  }

  
}

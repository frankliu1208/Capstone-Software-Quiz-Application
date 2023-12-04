import { Component } from '@angular/core';
import axios from 'axios';

interface Quiz {
  _id: string;
  quizName: string;
  quizTime: number;
  createTime: string;
  quizQuestions: string[];
  __v: number;
}

@Component({
  selector: 'app-administer-quiz',
  templateUrl: './administer-quiz.component.html',
  styleUrls: ['./administer-quiz.component.scss']
})
export class AdministerQuizComponent {

  currentUserQuizes: Quiz[] = [];

  formData = {
    email: '',
    confirmEmail: '',
    selectedQuiz: ''
  };

  async ngOnInit(): Promise<void> {
    await this.getCurrentUsersQuizes();
    console.log(this.currentUserQuizes);
  }

  sendQuizToUser(): void {
    // Add your logic here to handle form submission
    
  }

  async getCurrentUsersQuizes() {
    const currentUserData = await axios.get(`http://localhost:5000/api/user`, { withCredentials: true });

    // array of quiz id's that were made by the current user
    const ownedQuizes = currentUserData.data.userQuizes;

    try {
      const quizData = await axios.get(`http://localhost:5000/api/send_quiz_to_candidate_home_page`);
      this.currentUserQuizes = quizData.data.filter((quiz: any) => ownedQuizes.includes(String(quiz._id)));
      
    } catch (error) {
      console.error('Error getting quiz data:', error);
    }
  }
}

import { Component } from '@angular/core';
import axios from 'axios';
import Swal from 'sweetalert2';


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
    selectedQuiz: {_id: '', quizName: ''}
  };

  
  async ngOnInit(): Promise<void> {
    await this.getCurrentUsersQuizes();
    // console.log(this.currentUserQuizes);
  }

  sendQuizToUser(): void {
  
  //confirm email is valid
  if (!this.validateEmail(this.formData.email)){
    // Swal.fire("Invalid Email","Please enter a valid email address(eg: myemail@domain,      example@gmail.com")
    Swal.fire({
      icon: 'error',
      title: 'Invalid Email',
      text: `Please enter a valid email address(eg: myemail@domain,      example@gmail.com)`,
    })
  }

  else{
      // Logic here to handle form submission
  axios.post('http://localhost:5000/api/send_mail_to_candidate', {
    'candidateEmailAddress': this.formData.email,
    'quizId' : this.formData.selectedQuiz._id,
    'quizName' : this.formData.selectedQuiz.quizName
  })
  .then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Quiz Successfully sent to ${this.formData.email}`,
    }).then(() => {
      window.location.href = '/administer-quiz';
    });
  })
  .catch((error) => {
    // Handle errors, show an error message, etc.
    console.error('Error sending mail:', error);
  });

  }

  

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


  validateEmail(email:string){
    //regex expression for email check 
    var validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return validRegex.test(email);
  }
}

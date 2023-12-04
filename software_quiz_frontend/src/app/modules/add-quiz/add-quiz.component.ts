import { Component } from '@angular/core';
import axios
 from 'axios';
 import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent {

  quizName: string = '';
  quizTime: string = '';


  async addQuizSubmitForm() {

    const quizFormData = {
      quizName: this.quizName,
      quizTime: this.quizTime
    }

    try {
      
      //grab current user data
      const currentUser = await axios.get('http://localhost:5000/api/user',{withCredentials:true});
      //grab array holding all quizes for current user
      const userData = currentUser.data;
      
      //Process the addition of new quiz with basic info
      const response = await axios.post('http://localhost:5000/api/create_new_quiz',quizFormData, {withCredentials:true});

      const newQuizId = (await response).data._id;
      // userQuizes.push(newId);
      // console.log(userQuizes);

      //update the users quiz list to include the newly created quiz
      const updateUserData = {
        // userName : userData.userName,
        // userEmail : userData.userEmail,
        // userPassword : userData.userPassword,
        userQuizes : [...userData.userQuizes, newQuizId]
      }
      await axios.put(`http://localhost:5000/api/update_user/${userData._id}`, updateUserData, {withCredentials:true})
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Quiz Created`,
      }).then(() => { window.location.href = '/quiz-management'; });

    } catch (error) {
      throw error;
    }

  }



  // ["654f9bb97f6825effeeabd6b","6550bfa68570659f7dee4fe9"]
}

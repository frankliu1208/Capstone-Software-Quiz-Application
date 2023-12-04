import { Component } from '@angular/core';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.scss']
})
export class UserManagmentComponent {
  userId : string;
  userName: string;
  userEmail: string;

  userPassword: string;
  //load user data


ngOnInit(): void{
  const userData = this.getUserData();
}

updateUser(): void {
  // Call your API or perform necessary logic for updating user
  axios.put(`http://localhost:5000/api/update_user/${this.userId}`, {
    userName: this.userName,
    userEmail: this.userEmail,
    userPassword: this.userPassword
  })
  .then(response => {
    // Handle succes
    Swal.fire({
      icon: 'success',
      title: 'User Updated',
      text: 'User information has been updated successfully!',
    });
  })
  .catch(error => {
    console.error('Error updating user:', error.response.data.message);
  });
}


getUserData(): void {
  axios.get('http://localhost:5000/api/user', { withCredentials: true })
    .then(response => {
      const userData = response.data;
      this.userId = userData._id;
      this.userName = userData.userName;
      this.userEmail = userData.userEmail;
      // console.log(userData)
    })
    .catch(error => {
      console.error('Error getting user data:', error.response.data.message);
    });
  }

}

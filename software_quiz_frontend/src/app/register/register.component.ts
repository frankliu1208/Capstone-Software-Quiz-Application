import { Component } from '@angular/core';
import Swal from 'sweetalert2';

import { Injectable } from '@angular/core';
import axios from 'axios';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class RegisterComponent {
  userName: string = '';
  email: string = '';
  password: string = '';

  submitForm() {
    // Handle form submission here (e.g., send data to the server)
    const data = {
      userName: this.userName,
      userEmail: this.email,
      userPassword: this.password
    }

    // Validate that the user filled in all the fields
    if (data.userName == "" || data.userPassword == "" || data.userEmail == ""){
      Swal.fire("error","Incomplete form, try again")
    }

    else if (!this.validateEmail(this.email)){
      Swal.fire("error","Please enter a valid email address")

    }

    else{
      // all details are correct, make post request
      
      axios.post('http://localhost:5000/api/register', data)
        .then( (response) => {
          // console.log('Request successful:', response);
              Swal.fire("success", response.data.message)

         

        })
        .catch( (error) => {
          // console.error('Request failed:', error.response.data.message);
      Swal.fire("error", error.response.data.message)

        });
      
    }


  }


  validateEmail(email:any){
    //regex expression for email check 
    var validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return validRegex.test(email);
  }
}

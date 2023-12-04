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
      // Swal.fire("Missing Form sections","Incomplete form, try again")
      Swal.fire({
        icon: 'error',
        title: 'Missing Form sections',
        text: "Incomplete form, try again",
      })

    }

    else if (!this.validateEmail(this.email)){
      // Swal.fire("Invalid Email","Please enter a valid email address(eg: myemail@domain,      example@gmail.com")
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: `Please enter a valid email address(eg: myemail@domain,      example@gmail.com)`,
      })
    }
    else if (!this.validatePassword(this.password)) {
      // Swal.fire("Invalid Password", "Must contain at least 1 number,uppercase character, lowercase character, and special character ('!@#$%^&*')");
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: `Must contain at least 1 number,uppercase character, lowercase character, and special character ('!@#$%^&*')`,
      })
    }

    else{
      // all details are correct, make post request
      
      axios.post('http://localhost:5000/api/register', data ,{withCredentials:true})
        .then( (response) => {
          // console.log('Request successful:', response);
              // Swal.fire("success", response.data.message)
              Swal.fire({
                icon: 'success',
                title: 'User Registered',
                text: `${response.data.message}`,
              })

              .then( ()=>
              window.location.href = '/home'

            )

        })
        
        .catch( (error) => {
      // console.error('Request failed:', error.response.data.message);
      // Swal.fire("error", error.response.data.message)
      
              Swal.fire({
                icon: 'error',
                title: 'error',
                text: `${error.response.data.message}`,
              })

        });
      
    }


  }


  validateEmail(email:string){
    //regex expression for email check 
    var validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return validRegex.test(email);
  }

  validatePassword(password:string) {
    // Password should be at least 6 characters long
    // Should contain at least 1 uppercase letter
    // Should contain at least 1 lowercase letter
    // Should contain at least 1 number
    // Should contain at least 1 special character from @$!%*#?&
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  }
}

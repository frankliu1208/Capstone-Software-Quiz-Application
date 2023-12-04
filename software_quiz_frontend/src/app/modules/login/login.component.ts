import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  submitForm() {
    // Handle form submission here (e.g., send data to the server)

    const data = {
    
      userEmail: this.email,
      userPassword: this.password
    }

    // Validate that the user filled in all the fields
    if (data.userPassword == "" || data.userEmail == ""){
      Swal.fire("Missing Form sections","Incomplete form, try again")
    }

    else{
      axios.post('http://localhost:5000/api/login', data ,{withCredentials:true})
      .then( (response) => {
        // console.log('Request successful:', response);
            // Swal.fire("success", response.data.message)

            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: `${response.data.message}`,
            })
            

            .then( ()=>
            // window.location.href = '/'
            // window.location.href = '/home'
            window.location.href = '/landing'


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

}

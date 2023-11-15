import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message: " "

  constructor (private http: HttpClient){
    
  }

  ngOnInit(): void{
    // this.http.get('http://localhost:5000/api/user', {
    //   // withCredentials:true
    // })
    // .subscribe((res:any) => {
    //   this.message = `Hi ${res.userName}`;
    // })

    axios.get('http://localhost:5000/api/user')
    .then((response) => {
      // Handle the successful response here
      console.log('GET request successful:', response.data);
    })
    .catch((error) => {
      // Handle errors here
      console.error('GET request failed:', error);
    });
    
  }
}

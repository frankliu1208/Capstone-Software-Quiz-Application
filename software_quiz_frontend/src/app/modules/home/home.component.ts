import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Emitters } from 'src/app/emmiters/emitter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message: string = " ";

  constructor (private http: HttpClient){
    
  }

  ngOnInit(): void{
    // this.http.get('http://localhost:5000/api/user', {
    //   // withCredentials:true
    // })
    // .subscribe((res:any) => {
    //   this.message = `Hi ${res.userName}`;
    // })

    axios.get('http://localhost:5000/api/user', {withCredentials:true})
    .then((response) => {
      // Handle the successful response here
      this.message = `The following user is logged in : ${response.data.userName}`;
      Emitters.authEmitter.emit(true); //user is authenticated
      // console.log('GET request successful:', response.data);
    })
    .catch((error) => {
      // Handle errors here
      this.message = `You are not currently logged in`;
      Emitters.authEmitter.emit(false); // user is not authenticated

      // console.error('GET request failed:', error);
    });
    
  }
}

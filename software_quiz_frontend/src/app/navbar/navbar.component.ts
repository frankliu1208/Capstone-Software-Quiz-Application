import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Emitters } from '../emmiters/emitter';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  authenticated = false;

  constructor(private http:HttpClient){}

  ngOnInit(): void{
    Emitters.authEmitter.subscribe((auth:boolean) => {
      this.authenticated = auth;
    })
  }

  logout(){
    this.http.post('http://localhost:5000/api/logout',{},{
      withCredentials:true
    })
    .subscribe(() => {
      this.authenticated = false;
      window.location.reload;
    })
     

  
    
  }
}

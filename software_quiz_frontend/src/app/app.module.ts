import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './register/register.component';

import { AdminLoginComponent } from './modules/admin-login/admin-login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from './core/header/header.component';
import { AdminLandingComponent } from './modules/admin-landing/admin-landing.component';
import { QuizComponent } from './modules/quiz/quiz.component';
import { QuizManagementComponent } from './modules/quiz-management/quiz-management.component';

import { HomeComponent } from './modules/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { AddQuizComponent } from './modules/add-quiz/add-quiz.component';
import { ViewQuizComponent } from './modules/view-quiz/view-quiz.component';
import { UserManagmentComponent } from './modules/user-managment/user-managment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,

    AdminLoginComponent,
    HeaderComponent,
    AdminLandingComponent,
    QuizComponent,
    QuizManagementComponent,

    NavbarComponent,
      AddQuizComponent,
      ViewQuizComponent,
      UserManagmentComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    MatFormFieldModule,
    MatCardModule,

    ReactiveFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

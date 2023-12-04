import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { RegisterComponent } from './register/register.component';
// import { AdminLoginComponent } from './modules/admin-login/admin-login.component';
import { AdminLandingComponent } from './modules/admin-landing/admin-landing.component';
import { QuizManagementComponent } from './modules/quiz-management/quiz-management.component';
import { AddQuizComponent } from './modules/add-quiz/add-quiz.component';
import { ViewQuizComponent } from './modules/view-quiz/view-quiz.component';
import { UserManagmentComponent } from './modules/user-managment/user-managment.component';
import { AdministerQuizComponent } from './modules/administer-quiz/administer-quiz.component';
import { ReviewResultsComponent } from './modules/review-results/review-results.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: HomeComponent

  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'landing',
    component: AdminLandingComponent
  },
  {
    path: 'quiz-management',
    component: QuizManagementComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'add-quiz',
    component: AddQuizComponent},
  {
    path: 'view-quiz/:id',
    component: ViewQuizComponent
  },

  {
    path: 'user-management',
    component: UserManagmentComponent
  },

  {
    path: 'administer-quiz',
    component: AdministerQuizComponent
  },
  {
    path: 'review-results',
    component: ReviewResultsComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { RegisterComponent } from './register/register.component';
import { AdminLoginComponent } from './modules/admin-login/admin-login.component';
import { AdminLandingComponent } from './modules/admin-landing/admin-landing.component';
import { QuizManagementComponent } from './modules/quiz-management/quiz-management.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLoginComponent
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

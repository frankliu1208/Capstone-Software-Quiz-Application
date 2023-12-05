// quiz-data.service.ts

import { Injectable } from '@angular/core';
import { QuizContent, QuizQuestion, AnswerItem } from './quiz.interface';

@Injectable({
  providedIn: 'root',
})
export class QuizDataService {
  quizData: QuizContent[] = [
    // Your quiz content array here
  ];
  
  updateQuizData(data: QuizContent[]): void {
    this.quizData = data;
  }
  
}
export { QuizContent, QuizQuestion, AnswerItem };


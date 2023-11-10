import { Component } from '@angular/core';
import { Question, QuestionType } from './question.model';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {
  questionTypes = QuestionType;
  questions: Question[] = [];
  newQuestion: Question = {
    type: QuestionType.MultipleChoice,
    text: '',
    options: ['Option 1', 'Option 2'],
    correctAnswers: [0]
  };

  addQuestion() {
    this.questions.push({ ...this.newQuestion });
    this.resetNewQuestion();
  }

  resetNewQuestion() {
    this.newQuestion = {
      type: QuestionType.MultipleChoice,
      text: '',
      options: ['Option 1', 'Option 2'],
      correctAnswers: [0]
    };
  }
}
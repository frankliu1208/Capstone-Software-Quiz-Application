// candidate-quiz-started.component.ts

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizDataService, QuizContent, QuizQuestion } from './quiz-data.service';
import axios from 'axios';

@Component({
  selector: 'app-candidate-quiz-started',
  templateUrl: './candidate-quiz-started.component.html',
  styleUrls: ['./candidate-quiz-started.component.scss']
})
export class CandidateQuizStartedComponent {

  quizId: string;
  candidateEmail: string;
  // quizData: QuizContent[] = [];
  quizData: QuizQuestion[] = [];

  constructor(
    private route: ActivatedRoute,
    private quizDataService: QuizDataService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.quizId = params['id'];
      this.candidateEmail = params['email'];

      try {
        // Fetch quiz data from the server
        const response = await axios.get(`http://localhost:5000/api/view_quiz_details/${this.quizId}`);
        const fetchedQuizData: QuizContent[] = response.data;

// Map question IDs to actual questions
const questionsMap = new Map<string, QuizContent>();
fetchedQuizData.forEach(item => {
  if (item.quizQuestions && item.quizQuestions.length > 0) {
    item.quizQuestions.forEach(questionId => {
      let actualQuestionId: string;

      // Check if the questionId is an object and extract the _id property
      if (typeof questionId === 'object' && questionId._id) {
        actualQuestionId = questionId._id;
      } else {
        // Assume questionId is already a string
        actualQuestionId = questionId as string;
      }

      const question = fetchedQuizData.find(q => q._id === actualQuestionId);
      if (question) {
        questionsMap.set(actualQuestionId, question);
      }
    });
  }
});

// Update quizData in QuizDataService
this.quizDataService.updateQuizData(Array.from(questionsMap.values()));

// Now, you can access updated quizData from QuizDataService
this.quizData = this.quizDataService.quizData;


        // Rest of your logic...
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    });
  }

  submitAnswers(): void {
    // Implement the logic to submit answers using this.quizData
  }
}

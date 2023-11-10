export enum QuestionType {
    MultipleChoice = 'multiple-choice',
    TrueFalse = 'true-false',
    MultipleAnswers = 'multiple-answers',
    FreeText = 'free-text',
  }
  
  export interface Question {
    type: QuestionType;
    text: string;
    options: string[];
    correctAnswers: number[]; 
  }
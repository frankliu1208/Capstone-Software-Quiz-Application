// quiz.interface.ts

export interface QuizContent {
    candidateEmail?: string;
    quizId?: string;
    testDate?: string;
    score?: number;
    timeTaken?: number;
    _id?: string;
    quizName?: string;
    quizTime?: number;
    createTime?: string;
    quizQuestions?: QuizQuestion[];
    __v?: number;
  }
  
  export interface QuizQuestion {
    _id?: string;
    quizId?: string;
    questionContent?: string;
    type?: string;
    answersItem?: AnswerItem[];
    correctAnswer?: string[];
    __v?: number;
  }
  
  export interface AnswerItem {
    label?: string;
    content?: string;
  }
  
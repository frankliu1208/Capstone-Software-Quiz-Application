import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateQuizStartedComponent } from './candidate-quiz-started.component';

describe('CandidateQuizStartedComponent', () => {
  let component: CandidateQuizStartedComponent;
  let fixture: ComponentFixture<CandidateQuizStartedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateQuizStartedComponent]
    });
    fixture = TestBed.createComponent(CandidateQuizStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTakeQuizComponent } from './candidate-take-quiz.component';

describe('CandidateTakeQuizComponent', () => {
  let component: CandidateTakeQuizComponent;
  let fixture: ComponentFixture<CandidateTakeQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateTakeQuizComponent]
    });
    fixture = TestBed.createComponent(CandidateTakeQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

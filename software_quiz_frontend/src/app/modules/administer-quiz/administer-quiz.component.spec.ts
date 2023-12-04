import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministerQuizComponent } from './administer-quiz.component';

describe('AdministerQuizComponent', () => {
  let component: AdministerQuizComponent;
  let fixture: ComponentFixture<AdministerQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministerQuizComponent]
    });
    fixture = TestBed.createComponent(AdministerQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

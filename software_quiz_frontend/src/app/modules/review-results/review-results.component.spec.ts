import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewResultsComponent } from './review-results.component';

describe('ReviewResultsComponent', () => {
  let component: ReviewResultsComponent;
  let fixture: ComponentFixture<ReviewResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewResultsComponent]
    });
    fixture = TestBed.createComponent(ReviewResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentToggleComponent } from './comment-toggle.component';

describe('CommentToggleComponent', () => {
  let component: CommentToggleComponent;
  let fixture: ComponentFixture<CommentToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

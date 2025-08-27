import { Directive, OnInit, Self } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

@Directive({
  selector: '[appCommentValidation]',
  standalone: true,
})
export class CommentValidationDirective implements OnInit {
  constructor(@Self() private ngControl: NgControl) {}

  ngOnInit(): void {
    const checkbox = this.formControlByName('addComment');
    if (!checkbox) return;

    checkbox.valueChanges.subscribe((checked: boolean) => {
      const control = this.ngControl.control;
      if (!control) return;

      if (checked) {
        control.setValidators([Validators.required, Validators.maxLength(100)]);
        control.enable();
      } else {
        control.clearValidators();
        control.disable();
        control.setValue('');
      }

      control.updateValueAndValidity();
    });
  }

  private formControlByName(name: string) {
    return (this.ngControl.control?.parent as any)?.get(name);
  }
}

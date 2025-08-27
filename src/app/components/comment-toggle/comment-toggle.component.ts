import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label tuiLabel class="toggle-label">
      <input
        type="checkbox"
        class="toggle-input"
        [checked]="value"
        (change)="handleChange($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
      />
      <span class="toggle-text">Добавить комментарий</span>
    </label>
  `,
  styles: [
    `
      .toggle-label {
        margin: 1.5rem 0;
        display: block;
        cursor: pointer;
      }
      .toggle-text {
        margin-left: 0.5rem;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommentToggleComponent),
      multi: true,
    },
  ],
})
export class CommentToggleComponent implements ControlValueAccessor {
  value = false;
  disabled = false;

  onChange: (value: boolean) => void = () => {
    /* Intentionally empty */
  };
  onTouched: () => void = () => {
    /* Intentionally empty */
  };
  handleChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.value = checked;
    this.onChange(checked);
  }

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { TuiDay, TuiPortalModule } from '@taiga-ui/cdk';
import { TuiAlertService } from '@taiga-ui/core';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiAlertModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxBlockModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { CommentToggleComponent } from '../comment-toggle/comment-toggle.component';
import { Subscription } from 'rxjs';
import { Transaction } from 'src/app/models/transaction';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiInputDateModule,
    TuiSelectModule,
    TuiDataListModule,
    CommentToggleComponent,
    TuiAlertModule,
    TuiCheckboxBlockModule,
    TuiPortalModule,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.less'],
})
export class TransactionFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  readonly maxDate = TuiDay.currentLocal();
  private editSubscription!: Subscription;
  isEditMode = false;

  readonly typeOptions: ('income' | 'expense')[] = ['income', 'expense'];
  incomeCategories = ['Зарплата', 'Подработка', 'Дивиденды', 'Пособие'];
  expenseCategories = [
    'Еда',
    'Транспорт',
    'Развлечения',
    'Коммунальные',
    'Одежда',
    'Медицина',
  ];
  categories: string[] = [];

  typeControls: { [key in 'income' | 'expense']: FormControl<boolean | null> } =
    {
      income: new FormControl(false),
      expense: new FormControl(false),
    };

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private alertService: TuiAlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupEditListener();
  }

  ngOnDestroy(): void {
    this.editSubscription?.unsubscribe();
  }

  private initForm(): void {
    this.form = this.fb.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      amount: [
        null,
        [Validators.required, Validators.min(0), Validators.max(10_000_000)],
      ],
      date: [null, [Validators.required, this.pastDateValidator()]],
      addComment: [false],
      comment: [''],
    });
  }

  private setupEditListener(): void {
    this.editSubscription = this.transactionService.editIndex$.subscribe(
      (index) => {
        if (index !== null) {
          this.isEditMode = true;
          const transaction = this.transactionService.transactions[index];
          this.loadTransactionIntoForm(transaction);
        } else {
          this.isEditMode = false;
          this.resetForm();
        }
      }
    );
  }

  private loadTransactionIntoForm(transaction: Transaction): void {
    this.form.patchValue({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: TuiDay.fromLocalNativeDate(new Date(transaction.date)),
      comment: transaction.comment || '',
      addComment: !!transaction.comment,
    });
    this.selectType(transaction.type);
  }

  selectType(type: 'income' | 'expense'): void {
    this.typeControls.income.setValue(false);
    this.typeControls.expense.setValue(false);
    this.typeControls[type].setValue(true);
    this.form.get('type')?.setValue(type);
    this.categories =
      type === 'income' ? this.incomeCategories : this.expenseCategories;
    this.form.get('category')?.setValue('');
  }

  private pastDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const date: TuiDay | null = control.value;
      if (!date) return null;
      return date.daySameOrBefore(TuiDay.currentLocal())
        ? null
        : { futureDate: true };
    };
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.invalid) return '';

    if (control.hasError('required')) {
      switch (field) {
        case 'type':
          return 'Выберите тип транзакции';
        case 'category':
          return 'Выберите категорию';
        case 'amount':
          return 'Введите сумму';
        case 'date':
          return 'Выберите дату';
        case 'comment':
          return 'Заполните комментарий';
      }
    }
    if (control.hasError('min')) return 'Сумма не может быть отрицательной';
    if (control.hasError('max')) return 'Сумма не может превышать 10 000 000';
    if (control.hasError('maxlength'))
      return 'Комментарий не более 100 символов';
    if (control.hasError('futureDate')) return 'Дата не может быть из будущего';
    return 'Ошибка в поле';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const transaction = this.prepareTransaction();

    const index = this.transactionService.editIndex;

    if (this.isEditMode && index !== null) {
      this.transactionService.updateTransaction(index, transaction);
    } else {
      this.transactionService.addTransaction(transaction);
    }

    this.showSuccessAlert();
    this.resetForm();
  }

  private prepareTransaction(): Transaction {
    const rawDate = this.form.get('date')?.value as TuiDay;
    const jsDate = new Date(rawDate.year, rawDate.month, rawDate.day);

    return {
      type: this.form.get('type')?.value,
      category: this.form.get('category')?.value,
      amount: this.form.get('amount')?.value,
      date: jsDate.toISOString().split('T')[0],
      comment: this.form.get('comment')?.value || null,
    };
  }

  private showSuccessAlert(): void {
    const message = this.isEditMode
      ? '✅ Транзакция успешно обновлена!'
      : '✅ Транзакция успешно сохранена!';

    this.alertService.open(message, { status: 'success' }).subscribe();
  }

  private resetForm(): void {
    const addCommentState = this.form.get('addComment')?.value;
    this.form.reset({ addComment: addCommentState });
    this.typeControls.income.setValue(false);
    this.typeControls.expense.setValue(false);
    this.categories = [];
  }

  cancelEdit(): void {
    this.transactionService.clearEdit();
  }
}

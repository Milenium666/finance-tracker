import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { TransactionAmountPipe } from '../../pipes/transaction-amount/transaction-amount.pipe';
import { CommonModule } from '@angular/common';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { fadeInOut } from '../../animation/animation';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule,
    TransactionAmountPipe,
    TuiScrollbarModule,
    TuiIslandModule,
    TuiButtonModule,
    TuiHintModule,
  ],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.less'],
  animations: [fadeInOut],
})
export class TransactionHistoryComponent {
  protected readonly transactions$;
  protected readonly editIndex$;

  constructor(private transactionService: TransactionService) {
    this.transactions$ = this.transactionService.transactions$.pipe(
      map((transactions) =>
        [...transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      )
    );
    this.editIndex$ = this.transactionService.editIndex$;
  }

  editTransaction(index: number): void {
    this.transactionService.setEditMode(index);
  }

  deleteTransaction(index: number): void {
    this.transactionService.deleteTransaction(index);
  }
}

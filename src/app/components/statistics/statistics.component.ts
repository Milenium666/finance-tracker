import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { TuiRingChartModule } from '@taiga-ui/addon-charts';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, TuiRingChartModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less'],
})
export class StatisticsComponent {
  constructor(public transactionService: TransactionService) {}

  get incomeValues(): readonly number[] {
    return this.getTransactionValues('income');
  }

  get expenseValues(): readonly number[] {
    return this.getTransactionValues('expense');
  }

  get incomeLabels(): string[] {
    return this.getTransactionLabels('income');
  }

  get expenseLabels(): string[] {
    return this.getTransactionLabels('expense');
  }

  private getTransactionValues(type: 'income' | 'expense'): number[] {
    const transactions = this.transactionService.transactions.filter(
      (t) => t.type === type
    );

    const categoryMap = new Map<string, number>();

    transactions.forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    return Array.from(categoryMap.values());
  }

  private getTransactionLabels(type: 'income' | 'expense'): string[] {
    const transactions = this.transactionService.transactions.filter(
      (t) => t.type === type
    );

    const categoryMap = new Map<string, number>();

    transactions.forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    return Array.from(categoryMap.entries()).map(
      ([name, value]) => `${name}: ${value.toLocaleString('ru-RU')} ₽`
    );
  }
}

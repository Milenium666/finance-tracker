import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionAmount',
  standalone: true,
})
export class TransactionAmountPipe implements PipeTransform {
  transform(value: number, type: 'income' | 'expense'): string {
    if (value === undefined || value === null) return '';

    const sign = type === 'income' ? '+' : '-';
    const formattedValue = value.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${sign} ${formattedValue} ₽`;
  }
}

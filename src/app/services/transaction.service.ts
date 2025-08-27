import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$: Observable<Transaction[]> =
    this.transactionsSubject.asObservable();

  private editIndexSource = new BehaviorSubject<number | null>(null);
  public editIndex$ = this.editIndexSource.asObservable();

  get editIndex(): number | null {
    return this.editIndexSource.value;
  }

  private readonly STORAGE_KEY = 'finance-tracker-transactions';

  constructor() {
    this.loadFromStorage();
  }

  get transactions(): Transaction[] {
    return this.transactionsSubject.value;
  }

  addTransaction(transaction: Transaction): void {
    const current = this.transactions;
    this.transactionsSubject.next([...current, transaction]);
    this.saveToStorage();
  }

  updateTransaction(index: number, transaction: Transaction): void {
    const updated = this.transactions.map((t, i) =>
      i === index ? transaction : t
    );
    this.transactionsSubject.next(updated);
    this.saveToStorage();
    this.clearEdit();
  }

  deleteTransaction(index: number): void {
    const updated = this.transactions.filter((_, i) => i !== index);
    this.transactionsSubject.next(updated);
    this.saveToStorage();
    this.clearEdit();
  }

  setEditMode(index: number): void {
    this.editIndexSource.next(index);
  }

  clearEdit(): void {
    this.editIndexSource.next(null);
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.transactionsSubject.next(JSON.parse(saved));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.transactions));
  }
}

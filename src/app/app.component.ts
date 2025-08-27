import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import {
  TuiRootModule,
  TuiThemeNightModule,
  TuiModeModule,
} from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TransactionFormComponent,
    TransactionHistoryComponent,
    StatisticsComponent,
    TuiRootModule,
    TuiThemeNightModule,
    TuiModeModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'finance-tracker';
}

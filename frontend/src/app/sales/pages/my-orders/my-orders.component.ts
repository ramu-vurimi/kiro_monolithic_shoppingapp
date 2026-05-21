import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { ApiService, SaleResponse } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <div class="container">
      <h1>My Orders</h1>
      <p class="subtitle">{{ orders.length }} order{{ orders.length !== 1 ? 's' : '' }} placed</p>

      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div *ngIf="!loading && error" class="error-state">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <p>Failed to load orders. Please try again.</p>
      </div>

      <div *ngIf="!loading && !error && orders.length === 0" class="empty-state">
        <mat-icon class="empty-icon">receipt_long</mat-icon>
        <p>No orders placed yet.</p>
        <p class="empty-hint">Head to the shop and place your first order!</p>
      </div>

      <mat-accordion *ngIf="!loading && !error && orders.length > 0" multi="false">
        <mat-expansion-panel *ngFor="let order of orders; let i = index" class="order-panel">

          <!-- Panel header: serial number, date, item summary, total -->
          <mat-expansion-panel-header>
            <mat-panel-title class="panel-title">
              <span class="order-number">#{{ i + 1 }}</span>
              <span class="order-date">{{ order.soldAt | date:'dd MMM yyyy, h:mm a' }}</span>
            </mat-panel-title>
            <mat-panel-description class="panel-desc">
              <span class="item-summary">{{ getItemSummary(order) }}</span>
              <span class="order-total">{{ order.totalAmount | currency:'INR':'symbol':'1.2-2' }}</span>
            </mat-panel-description>
          </mat-expansion-panel-header>

          <!-- Expanded: full item breakdown -->
          <div class="order-items">
            <div *ngFor="let item of order.items; let last = last" class="order-item">
              <div class="item-name">
                <mat-icon class="item-icon">shopping_bag</mat-icon>
                {{ item.productName }}
              </div>
              <div class="item-details">
                <span class="item-qty">Qty: {{ item.quantity }}</span>
                <span class="item-unit-price">{{ item.unitPrice | currency:'INR':'symbol':'1.2-2' }} each</span>
                <span class="item-line-total">{{ item.lineTotal | currency:'INR':'symbol':'1.2-2' }}</span>
              </div>
              <mat-divider *ngIf="!last"></mat-divider>
            </div>

            <div class="order-footer">
              <span class="footer-label">Order Total</span>
              <span class="footer-total">{{ order.totalAmount | currency:'INR':'symbol':'1.2-2' }}</span>
            </div>
          </div>

        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 20px;
    }

    h1 { margin-bottom: 4px; color: #333; }

    .subtitle {
      color: #888;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .loading { display: flex; justify-content: center; padding: 60px; }

    .error-state, .empty-state {
      display: flex; flex-direction: column; align-items: center;
      padding: 60px 20px; color: #888; text-align: center;
    }
    .error-state { color: #d32f2f; }
    .error-icon, .empty-icon {
      font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px;
    }
    .error-icon { color: #d32f2f; }
    .empty-icon { color: #bdbdbd; }
    .error-state p, .empty-state p { font-size: 16px; margin: 0; }
    .empty-hint { font-size: 13px; color: #bbb; margin-top: 8px !important; }

    /* ── Accordion ── */
    mat-accordion { display: block; }

    .order-panel {
      margin-bottom: 10px;
      border-radius: 8px !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08) !important;
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .order-number {
      font-weight: 700;
      font-size: 15px;
      color: #1976d2;
      min-width: 36px;
    }

    .order-date {
      font-size: 13px;
      color: #555;
    }

    .panel-desc {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex: 1;
    }

    .item-summary {
      font-size: 13px;
      color: #777;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 260px;
    }

    .order-total {
      font-weight: 600;
      font-size: 15px;
      color: #333;
      white-space: nowrap;
    }

    /* ── Expanded items ── */
    .order-items {
      padding: 4px 0 8px;
    }

    .order-item {
      padding: 10px 0;
    }

    .item-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      font-size: 14px;
      color: #333;
      margin-bottom: 6px;
    }

    .item-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #1976d2;
    }

    .item-details {
      display: flex;
      gap: 20px;
      font-size: 13px;
      color: #666;
      padding-left: 26px;
    }

    .item-line-total {
      font-weight: 600;
      color: #333;
      margin-left: auto;
    }

    mat-divider { margin: 10px 0 0; }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 2px solid #e0e0e0;
      font-size: 16px;
    }

    .footer-label { color: #555; font-weight: 500; }

    .footer-total {
      font-size: 18px;
      font-weight: 700;
      color: #1976d2;
    }
  `]
})
export class MyOrdersComponent implements OnInit {
  orders: SaleResponse[] = [];
  loading = false;
  error = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = false;
    this.apiService.getMyOrders().subscribe({
      next: (orders) => { this.orders = orders; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  /** Returns a short comma-separated list of item names for the collapsed header */
  getItemSummary(order: SaleResponse): string {
    const names = order.items.map(i => i.productName);
    if (names.length <= 2) return names.join(', ');
    return `${names[0]}, ${names[1]} +${names.length - 2} more`;
  }
}

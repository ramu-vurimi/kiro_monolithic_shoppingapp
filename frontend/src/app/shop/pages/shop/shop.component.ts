import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService, ProductDTO, SaleRequest, SaleResponse } from '../../../core/services/api.service';
import { CartService, CartItem } from '../../../shared/services/cart.service';

// ─── Keyword → Unsplash image mapping ────────────────────────────────────────
// Maps product name/SKU keywords to a relevant Unsplash photo ID.
// Falls back to a deterministic Picsum image using the product id.
const IMAGE_KEYWORD_MAP: { keywords: string[]; url: string }[] = [
  { keywords: ['laptop', 'notebook', 'computer', 'pc'],
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=280&fit=crop' },
  { keywords: ['phone', 'mobile', 'smartphone', 'iphone', 'android'],
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=280&fit=crop' },
  { keywords: ['tablet', 'ipad'],
    url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=280&fit=crop' },
  { keywords: ['headphone', 'earphone', 'earbud', 'audio', 'speaker'],
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=280&fit=crop' },
  { keywords: ['watch', 'smartwatch', 'clock'],
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=280&fit=crop' },
  { keywords: ['camera', 'lens', 'dslr', 'photo'],
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=280&fit=crop' },
  { keywords: ['keyboard', 'mouse', 'peripheral'],
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=280&fit=crop' },
  { keywords: ['monitor', 'screen', 'display', 'tv', 'television'],
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=280&fit=crop' },
  { keywords: ['shirt', 'tshirt', 't-shirt', 'top', 'blouse'],
    url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=280&fit=crop' },
  { keywords: ['pant', 'trouser', 'jeans', 'denim'],
    url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=280&fit=crop' },
  { keywords: ['shoe', 'sneaker', 'boot', 'footwear', 'sandal'],
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=280&fit=crop' },
  { keywords: ['bag', 'backpack', 'handbag', 'purse', 'wallet'],
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=280&fit=crop' },
  { keywords: ['book', 'novel', 'textbook', 'magazine'],
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=280&fit=crop' },
  { keywords: ['pen', 'pencil', 'stationery', 'notebook', 'diary'],
    url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=280&fit=crop' },
  { keywords: ['chair', 'sofa', 'furniture', 'table', 'desk'],
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=280&fit=crop' },
  { keywords: ['lamp', 'light', 'bulb', 'led'],
    url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=280&fit=crop' },
  { keywords: ['bottle', 'water', 'drink', 'juice', 'beverage'],
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=280&fit=crop' },
  { keywords: ['food', 'snack', 'biscuit', 'chocolate', 'candy', 'cookie'],
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=280&fit=crop' },
  { keywords: ['toy', 'game', 'puzzle', 'lego', 'doll'],
    url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=280&fit=crop' },
  { keywords: ['plant', 'flower', 'garden', 'pot', 'seed'],
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop' },
  { keywords: ['medicine', 'tablet', 'capsule', 'vitamin', 'supplement', 'health'],
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=280&fit=crop' },
  { keywords: ['soap', 'shampoo', 'lotion', 'cream', 'cosmetic', 'beauty'],
    url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=280&fit=crop' },
  { keywords: ['tool', 'hammer', 'drill', 'screwdriver', 'wrench'],
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=280&fit=crop' },
  { keywords: ['cycle', 'bike', 'bicycle', 'scooter'],
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=280&fit=crop' },
  { keywords: ['sport', 'ball', 'cricket', 'football', 'tennis', 'gym', 'fitness'],
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=280&fit=crop' },
];

// ─── Sale Success Dialog ──────────────────────────────────────────────────────

@Component({
  selector: 'app-shop-order-success-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatDividerModule, MatIconModule, CurrencyPipe, DatePipe],
  template: `
    <div class="success-header">
      <mat-icon class="success-icon">check_circle</mat-icon>
      <h2 mat-dialog-title>Order Placed!</h2>
    </div>
    <mat-dialog-content>
      <div class="receipt">
        <div class="receipt-row"><span class="label">Order ID:</span><span>#{{ sale.saleId }}</span></div>
        <div class="receipt-row"><span class="label">Date:</span><span>{{ sale.soldAt | date:'medium' }}</span></div>
        <mat-divider></mat-divider>
        <table class="receipt-table">
          <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
          <tbody>
            <tr *ngFor="let item of sale.items">
              <td>Product #{{ item.productId }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.unitPrice | currency:'INR':'symbol':'1.2-2' }}</td>
              <td>{{ item.lineTotal | currency:'INR':'symbol':'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
        <mat-divider></mat-divider>
        <div class="grand-total-row">
          <span>Grand Total:</span>
          <span class="grand-total-amount">{{ sale.totalAmount | currency:'INR':'symbol':'1.2-2' }}</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>
        <mat-icon>done</mat-icon> Done
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .success-header { display:flex; align-items:center; gap:12px; padding:16px 24px 0; }
    .success-icon { font-size:36px; width:36px; height:36px; color:#388e3c; }
    h2[mat-dialog-title] { margin:0; color:#388e3c; }
    .receipt { min-width:420px; padding-top:8px; }
    .receipt-row { display:flex; justify-content:space-between; padding:6px 0; font-size:14px; }
    .label { color:#666; }
    mat-divider { margin:12px 0; }
    .receipt-table { width:100%; border-collapse:collapse; font-size:13px; margin-bottom:8px; }
    .receipt-table th { text-align:left; padding:6px 8px; background:#f5f5f5; border-bottom:1px solid #ddd; }
    .receipt-table td { padding:6px 8px; border-bottom:1px solid #eee; }
    .grand-total-row { display:flex; justify-content:space-between; font-size:18px; font-weight:bold; padding:8px 0; }
    .grand-total-amount { color:#1976d2; }
  `]
})
export class ShopOrderSuccessDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public sale: SaleResponse,
    private dialogRef: MatDialogRef<ShopOrderSuccessDialogComponent>
  ) {}
}

// ─── Shop Component ───────────────────────────────────────────────────────────

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatBadgeModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    CurrencyPipe
  ],
  template: `
    <div class="shop-container">
      <div class="shop-layout">

        <!-- Left: Product Catalog -->
        <div class="catalog-section">
          <div class="catalog-header">
            <h1>Browse Products</h1>
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search products...</mat-label>
              <mat-icon matPrefix>search</mat-icon>
              <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Search by name or SKU">
              <button *ngIf="searchQuery" matSuffix mat-icon-button (click)="clearSearch()">
                <mat-icon>close</mat-icon>
              </button>
            </mat-form-field>
          </div>

          <div *ngIf="loading" class="loading">
            <mat-spinner diameter="50"></mat-spinner>
          </div>

          <div *ngIf="!loading && filteredProducts.length === 0" class="empty-state">
            <mat-icon class="empty-icon">search_off</mat-icon>
            <p>No products found{{ searchQuery ? ' for "' + searchQuery + '"' : '' }}.</p>
          </div>

          <div *ngIf="!loading" class="product-grid">
            <mat-card *ngFor="let product of filteredProducts" class="product-card"
                      [class.out-of-stock]="product.stockQuantity === 0">

              <!-- Product Image -->
              <div class="product-image-wrapper">
                <img [src]="getProductImage(product)"
                     [alt]="product.name"
                     class="product-image"
                     (error)="onImageError($event, product)">
                <div class="out-of-stock-overlay" *ngIf="product.stockQuantity === 0">
                  <span>Out of Stock</span>
                </div>
              </div>

              <mat-card-header>
                <mat-card-title>{{ product.name }}</mat-card-title>
                <mat-card-subtitle>SKU: {{ product.sku }}</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <p class="product-description" *ngIf="product.description">{{ product.description }}</p>
                <div class="product-meta">
                  <span class="price">{{ product.unitPrice | currency:'INR':'symbol':'1.2-2' }}</span>
                  <span class="stock-badge"
                        [class.low-stock]="product.stockQuantity > 0 && product.stockQuantity <= 5"
                        [class.in-stock]="product.stockQuantity > 5">
                    <mat-icon class="stock-icon">inventory</mat-icon>
                    {{ product.stockQuantity === 0 ? 'Out of Stock'
                       : product.stockQuantity <= 5 ? 'Only ' + product.stockQuantity + ' left'
                       : product.stockQuantity + ' in stock' }}
                  </span>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-raised-button color="primary"
                        [disabled]="product.stockQuantity === 0"
                        (click)="addToCart(product)">
                  <mat-icon>add_shopping_cart</mat-icon>
                  {{ isInCart(product) ? 'Add More' : 'Add to Cart' }}
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>

        <!-- Right: Cart -->
        <div class="cart-section">
          <mat-card class="cart-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>shopping_cart</mat-icon>
                Your Cart
                <span class="cart-count" *ngIf="cartItems.length > 0">({{ cartItems.length }})</span>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>
              <div *ngIf="cartItems.length === 0" class="empty-cart">
                <mat-icon class="empty-cart-icon">shopping_cart</mat-icon>
                <p>Your cart is empty</p>
                <p class="empty-cart-hint">Browse products and add items to get started.</p>
              </div>

              <div *ngIf="cartItems.length > 0" class="cart-items">
                <div *ngFor="let item of cartItems" class="cart-item">
                  <img [src]="getProductImage(item.product)"
                       [alt]="item.product.name"
                       class="cart-item-img"
                       (error)="onImageError($event, item.product)">
                  <div class="cart-item-info">
                    <span class="cart-item-name">{{ item.product.name }}</span>
                    <span class="cart-item-price">{{ item.unitPrice | currency:'INR':'symbol':'1.2-2' }} each</span>
                  </div>
                  <div class="cart-item-controls">
                    <button mat-icon-button class="qty-btn" (click)="decreaseQty(item)" [disabled]="item.quantity <= 1">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <span class="qty-display">{{ item.quantity }}</span>
                    <button mat-icon-button class="qty-btn" (click)="increaseQty(item)"
                            [disabled]="item.quantity >= item.product.stockQuantity">
                      <mat-icon>add</mat-icon>
                    </button>
                    <button mat-icon-button class="remove-btn" (click)="removeFromCart(item.product.id!)">
                      <mat-icon>delete_outline</mat-icon>
                    </button>
                  </div>
                  <div class="cart-item-total">
                    {{ item.lineTotal | currency:'INR':'symbol':'1.2-2' }}
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="cart-total">
                  <span>Total</span>
                  <span class="total-amount">{{ getCartTotal() | currency:'INR':'symbol':'1.2-2' }}</span>
                </div>
              </div>
            </mat-card-content>

            <mat-card-actions *ngIf="cartItems.length > 0">
              <button mat-button (click)="clearCart()" class="clear-btn">
                <mat-icon>clear_all</mat-icon>
                Clear Cart
              </button>
              <button mat-raised-button color="primary" (click)="placeOrder()" [disabled]="placing" class="checkout-btn">
                <mat-icon>check_circle</mat-icon>
                {{ placing ? 'Placing Order...' : 'Place Order' }}
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .shop-container { max-width:1400px; margin:0 auto; padding:20px; }

    .shop-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
      align-items: start;
    }

    /* ── Catalog header ── */
    .catalog-header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .catalog-header h1 { margin:0; color:#333; white-space:nowrap; }
    .search-field { flex:1; min-width:240px; }

    .loading { display:flex; justify-content:center; padding:60px; }

    .empty-state {
      display:flex; flex-direction:column; align-items:center;
      padding:60px 20px; color:#888; text-align:center;
    }
    .empty-icon { font-size:64px; width:64px; height:64px; color:#bdbdbd; margin-bottom:16px; }

    /* ── Product grid ── */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }

    .product-card {
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.2s, transform 0.2s;
      overflow: hidden;
    }
    .product-card:hover {
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }
    .product-card.out-of-stock { opacity:0.7; }

    /* ── Product image ── */
    .product-image-wrapper {
      position: relative;
      width: 100%;
      height: 180px;
      overflow: hidden;
      background: #f5f5f5;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .product-card:hover .product-image { transform: scale(1.05); }

    .out-of-stock-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .out-of-stock-overlay span {
      color: #fff;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.5px;
      background: rgba(211,47,47,0.85);
      padding: 6px 14px;
      border-radius: 4px;
    }

    .product-description { font-size:13px; color:#666; margin:6px 0; min-height:32px; }

    .product-meta {
      display:flex; justify-content:space-between; align-items:center;
      margin-top:8px; flex-wrap:wrap; gap:6px;
    }
    .price { font-size:18px; font-weight:600; color:#1976d2; }

    .stock-badge { display:flex; align-items:center; gap:4px; font-size:12px; }
    .stock-badge.in-stock { color:#388e3c; }
    .stock-badge.low-stock { color:#f57c00; }
    .stock-icon { font-size:14px; width:14px; height:14px; }

    mat-card-actions { padding:8px 16px 16px; }
    mat-card-actions button { width:100%; }

    /* ── Cart ── */
    .cart-section { position:sticky; top:80px; }

    .cart-card mat-card-title {
      display:flex; align-items:center; gap:8px; font-size:18px;
    }
    .cart-count { font-size:14px; color:#1976d2; }

    .empty-cart { text-align:center; padding:32px 16px; color:#aaa; }
    .empty-cart-icon { font-size:56px; width:56px; height:56px; color:#ddd; }
    .empty-cart p { margin:8px 0 0; font-size:15px; }
    .empty-cart-hint { font-size:13px !important; color:#bbb; }

    .cart-items { display:flex; flex-direction:column; gap:12px; }

    .cart-item {
      display: grid;
      grid-template-columns: 44px 1fr auto auto;
      align-items: center;
      gap: 8px;
    }
    .cart-item-img {
      width: 44px;
      height: 44px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid #eee;
    }
    .cart-item-info { display:flex; flex-direction:column; overflow:hidden; }
    .cart-item-name { font-weight:500; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .cart-item-price { font-size:11px; color:#888; }

    .cart-item-controls { display:flex; align-items:center; gap:2px; }
    .qty-btn { width:28px; height:28px; line-height:28px; }
    .qty-btn mat-icon { font-size:16px; width:16px; height:16px; }
    .qty-display { min-width:22px; text-align:center; font-weight:500; font-size:14px; }
    .remove-btn mat-icon { color:#d32f2f; }

    .cart-item-total { font-weight:500; font-size:13px; text-align:right; min-width:72px; }

    mat-divider { margin:12px 0; }

    .cart-total { display:flex; justify-content:space-between; font-size:18px; font-weight:bold; padding:4px 0; }
    .total-amount { color:#1976d2; }

    mat-card-actions {
      display:flex; flex-direction:column; gap:8px; padding:8px 16px 16px;
    }
    .clear-btn { width:100%; color:#888; }
    .checkout-btn { width:100%; }

    @media (max-width:900px) {
      .shop-layout { grid-template-columns:1fr; }
      .cart-section { position:static; order:-1; }
    }
  `]
})
export class ShopComponent implements OnInit {
  allProducts: ProductDTO[] = [];
  filteredProducts: ProductDTO[] = [];
  cartItems: CartItem[] = [];
  searchQuery = '';
  loading = false;
  placing = false;

  // Cache resolved image URLs so we don't recompute on every change detection cycle
  private imageCache = new Map<number, string>();

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.cartService.getCart().subscribe(items => { this.cartItems = items; });
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts(undefined, true).subscribe({
      next: (products) => {
        this.allProducts = products;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load products. Please try again.', 'Close', { duration: 4000 });
      }
    });
  }

  onSearch(): void { this.applyFilter(); }

  clearSearch(): void { this.searchQuery = ''; this.applyFilter(); }

  private applyFilter(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredProducts = !query
      ? [...this.allProducts]
      : this.allProducts.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          (p.description?.toLowerCase().includes(query) ?? false)
        );
  }

  /**
   * Resolves a product image URL by matching the product name/SKU against
   * the keyword map. Falls back to a deterministic Picsum photo using the
   * product id so every product always has a unique, consistent image.
   */
  getProductImage(product: ProductDTO): string {
    const id = product.id ?? 0;
    if (this.imageCache.has(id)) {
      return this.imageCache.get(id)!;
    }
    const haystack = `${product.name} ${product.sku} ${product.description ?? ''}`.toLowerCase();
    const match = IMAGE_KEYWORD_MAP.find(entry =>
      entry.keywords.some(kw => haystack.includes(kw))
    );
    // Picsum gives a stable image per seed (product id), 400×280
    const url = match?.url ?? `https://picsum.photos/seed/${id}/400/280`;
    this.imageCache.set(id, url);
    return url;
  }

  /** On image load error, fall back to a Picsum placeholder */
  onImageError(event: Event, product: ProductDTO): void {
    const id = product.id ?? 0;
    const fallback = `https://picsum.photos/seed/${id + 100}/400/280`;
    this.imageCache.set(id, fallback);
    (event.target as HTMLImageElement).src = fallback;
  }

  isInCart(product: ProductDTO): boolean {
    return this.cartItems.some(item => item.product.id === product.id);
  }

  addToCart(product: ProductDTO): void {
    try {
      this.cartService.addToCart(product, 1, product.unitPrice);
      this.snackBar.open(`"${product.name}" added to cart`, 'Close', { duration: 2000 });
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Could not add to cart', 'Close', { duration: 3000 });
    }
  }

  increaseQty(item: CartItem): void {
    try {
      this.cartService.updateCartItem(item.product.id!, item.quantity + 1, item.unitPrice);
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Cannot increase quantity', 'Close', { duration: 3000 });
    }
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateCartItem(item.product.id!, item.quantity - 1, item.unitPrice);
    }
  }

  removeFromCart(productId: number): void { this.cartService.removeFromCart(productId); }
  clearCart(): void { this.cartService.clearCart(); }
  getCartTotal(): number { return this.cartService.getCartTotal(); }

  placeOrder(): void {
    if (this.cartItems.length === 0) return;
    const request: SaleRequest = {
      items: this.cartItems.map(item => ({
        productId: item.product.id!,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };
    this.placing = true;
    this.apiService.createSale(request).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        this.placing = false;
        const dialogRef = this.dialog.open(ShopOrderSuccessDialogComponent, {
          width: '500px',
          disableClose: true,
          data: response
        });
        dialogRef.afterClosed().subscribe(() => this.loadProducts());
      },
      error: (error) => {
        this.placing = false;
        this.snackBar.open(
          error?.error?.message || 'Failed to place order. Please try again.',
          'Close',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductsService } from '../../services/products/products.service';

import { Product } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../../components/product/product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  public products: Product[];
  public selectedProduct: Product | undefined;

  private readonly pagination = {
    limit: 10,
    offset: 0,
  };
  public status: 'loading' | 'success' | 'error' | 'no-more-products';

  constructor(private readonly productsService: ProductsService) {
    this.products = [];
    this.status = 'loading';
  }

  ngOnInit(): void {
    this.pagination.offset -= this.pagination.limit;
    this.getPaginatedProducts();
  }

  public getPaginatedProducts(): void {
    if(this.status === 'no-more-products') return;

    this.status = 'loading';

    this.productsService.getAll(
      this.pagination.limit,
      this.pagination.offset + this.pagination.limit
    ).subscribe({
      next: (products) => {
        if(products.length === 0) {
          this.status = 'no-more-products';
          return;
        }

        this.status = 'success';
        this.products.push(...products);
        this.pagination.offset += this.pagination.limit;
      },
      error: () => {
        setTimeout(() => {
          this.status = 'error';
        }, 3000);
      },
    });
  }

  public onSelectedProduct(product: Product): void {
    this.selectedProduct = product;
  }
}

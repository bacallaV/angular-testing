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
  public products: Product[] = [];
  public selectedProduct: Product | undefined;

  constructor(private readonly productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getAll(10, 0)
      .subscribe(products => this.products = products);
  }

  public onSelectedProduct(product: Product): void {
    this.selectedProduct = product;
  }
}

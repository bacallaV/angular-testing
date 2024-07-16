import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  @Input({ required: true })
  public product!: Product;

  @Output()
  public onselected = new EventEmitter<Product>();

  public onSelected(): void {
    this.onselected.emit(this.product);
  }
}

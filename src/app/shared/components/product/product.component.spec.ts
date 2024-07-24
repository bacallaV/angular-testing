import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

import { first } from 'rxjs';

import * as Testing from '@testing/index';
import * as ProductMock from '@testing/mock';

import { ProductComponent } from './product.component';

import { Product } from '@shared/interfaces';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let testProduct: Product;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;

    testProduct = ProductMock.generateOneProduct();
    component.product = testProduct;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have stored the same Product', () => {
    expect(component.product).toEqual(testProduct);
  });

  it('should have an image', () => {
    const img: HTMLElement = Testing.queryByCSS(fixture, 'img').nativeElement;
    expect(img).toBeTruthy();
  });

  it('should have a figcaption with "{title} - {price}"', () => {
    const figcaptionDescription = `${testProduct.title} - ${testProduct.price}`;
    const figcaptionText = Testing.getTextByCSSQuery(fixture, 'figcaption');

    expect(figcaptionText).toEqual(figcaptionDescription);
  });

  it('should emit #onselected when button is clicked', () => {
    const button = Testing.queryByCSS(fixture, 'button');

    component.onselected.pipe(first()).subscribe({
      next: (product: Product) => {
        expect(product).toEqual(testProduct);
      },
    });

    button.triggerEventHandler('click', null);
  });
});

/**
 * Tests with father TestHostComponent
*/
@Component({
  standalone: true,
  imports: [ProductComponent],
  template: '<app-product [product]="product" (onselected)="onSelectedProduct($event)"></app-product>',
})
class TestHostComponent {
  public product: Product = ProductMock.generateOneProduct();
  public selectedProduct: Product | undefined;

  public onSelectedProduct(product: Product): void {
    this.selectedProduct = product;
  }
}

describe('TestHostComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;

    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(debugElement).toBeTruthy();
  });

  it('should receive Product after click', () => {
    Testing.clickEvent(fixture, 'button');

    expect(component.selectedProduct).toEqual(component.product);
  });
});

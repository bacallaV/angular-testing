import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import * as Testing from '../../../testing';

import { ProductsComponent } from './products.component';
import { ProductsService } from '../../services/products/products.service';
import { generateManyProducts } from '../../interfaces/product.mock';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;

  beforeEach(() => {
    productsService = jasmine.createSpyObj('ProductsService', ['getAll']);
    const mockProducts = generateManyProducts(10);
    productsService.getAll.and.returnValue( Testing.mockObservable(mockProducts) );

    TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductsService, useValue: productsService },
      ]
    });

    fixture = TestBed.createComponent(ProductsComponent);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a Product list on #onInit', async () => {
    await fixture.whenStable(); // OnInit is called

    expect(component.products.length).toEqual(10);
  });

  describe('#getPaginatedProducts()', () => {
    it('should should change status from "loading" to "success"', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productsService.getAll.and.returnValue(
        Testing.deferredResolve(productsMock)
      );

      // Act
      component.getPaginatedProducts();

      expect(component.status).toEqual('loading');
      expect(component.products.length).toEqual(10);

      tick();

      // Assert
      expect(component.status).toEqual('success');
      expect(component.products.length).toEqual(20);
    }));

    it('should should change status from "loading" to "no-more-products"', fakeAsync(() => {
      // Arrange
      productsService.getAll.and.returnValue(
        Testing.deferredResolve([])
      );

      // Act
      component.getPaginatedProducts();

      expect(component.status).toEqual('loading');

      tick();

      // Assert
      expect(component.status).toEqual('no-more-products');
    }));

    it('should should change status from "loading" to "error"', fakeAsync(() => {
      // Arrange
      productsService.getAll.and.returnValue(
        Testing.deferredReject('Error')
      );

      // Act
      component.getPaginatedProducts();

      expect(component.status).toEqual('loading');

      tick(3000);

      // Assert
      expect(component.status).toEqual('error');
    }));

    it('should should change status from "loading" to "success" with button click', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productsService.getAll.and.returnValue(
        Testing.deferredResolve(productsMock)
      );

      // Act
      Testing.clickEvent(fixture, '.btn-primary');

      expect(component.status).toEqual('loading');

      tick();
      fixture.detectChanges();

      // Assert
      expect(component.status).toEqual('success');

      const productEls = Testing.queryAllByCSS(fixture, 'app-product');
      expect(productEls.length).toEqual(component.products.length);
    }));
  });
});

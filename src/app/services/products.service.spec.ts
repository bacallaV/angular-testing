import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProductsService } from './products.service';

import { Product } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { generateManyProducts } from '../interfaces/product.mock';

fdescribe('ProductsService', () => {
  let service: ProductsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should return a product list', async () => {
      // Arrange
      const mockData: Product[] = generateManyProducts(3);
      const product$ = service.getAll();
      const productPromise = firstValueFrom(product$);

      const req = httpTesting
        .expectOne(`${environment.API_URL}/products`, 'Request to get all products');

      // Assert: se pueden hacer varias aserciones del método.
      expect(req.request.method).toBe('GET');

      // Las últimas dos líneas de código pueden ser resumidas así
      // const req = httpTesting
      //   .expectOne({
      //     method: 'GET',
      //     url: `${environment.API_URL}/products`
      //   }, 'Request to get all products');

      // Esto provoca que la consulta sea completada, devolviendo el resultado.
      req.flush(mockData);

      const products = await productPromise;
      expect(products).toEqual(mockData);
      expect(products).toHaveSize(mockData.length);

      httpTesting.verify();
    });
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });
});

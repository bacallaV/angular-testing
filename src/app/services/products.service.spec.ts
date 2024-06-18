import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { ProductsService } from './products.service';

import { CreateProductDTO, Product, UpdateProductDTO } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { generateManyProducts, generateOneProduct } from '../interfaces/product.mock';
import { tokenInterceptor } from '../interceptors/token/token.interceptor';
import { TokenService } from './token/token.service';

fdescribe('ProductsService', () => {
  let service: ProductsService;
  let httpTesting: HttpTestingController;
  let tokenService: TokenService;

  const API_URL = `${environment.API_URL}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            tokenInterceptor,
          ])
        ),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductsService);
    httpTesting = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
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
        .expectOne(API_URL, 'Request to get all products');

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
    });

    it('should return taxes equals to 0', async () => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 0,
        },
        {
          ...generateOneProduct(),
          price: -100,
        },
      ];
      const product$ = service.getAll();
      const productPromise = firstValueFrom(product$);

      // Assert:
      const req = httpTesting
        .expectOne({
          method: 'GET',
          url: API_URL
        }, 'Request to get all products');

      // Esto provoca que la consulta sea completada, devolviendo el resultado.
      req.flush(mockData);

      const products = await productPromise;
      expect(products).toHaveSize(mockData.length);

      expect(products[0].taxes).toEqual(0);
      expect(products[1].taxes).toEqual(0);
    });

    it('should add query parameters', async () => {
      // Arrange
      const mockData: Product[] = generateManyProducts(2);
      const limit = 10;
      const offset = 0;

      const productPromise = firstValueFrom(
        service.getAll(limit, offset)
      );

      // Assert
      const req = httpTesting.expectOne({
        method: 'GET',
        url: `${API_URL}?limit=${limit}&offset=${offset}`,
      });

      req.flush(mockData);
      await productPromise;

      const params = req.request.params;
      expect(params.get('limit')).toEqual(limit.toString());
      expect(params.get('offset')).toEqual(offset.toString());
    });
  });

  describe('getOne()', () => {
    it('should return a product', async () => {
      // Arrange
      const mockData = generateOneProduct();
      const productId = mockData.id;

      // Act
      const servicePromise = firstValueFrom(
        service.getOne(productId)
      );
      const req = httpTesting.expectOne({
        method: 'GET',
        url: `${API_URL}/${productId}`,
      });

      req.flush(mockData);
      const serviceResponse = await servicePromise;

      // Assert
      expect(serviceResponse).toEqual(mockData);
    });

    it('should have bearer token', async () => {
      // Arrange
      const mockData = generateOneProduct();
      const productId = mockData.id;
      const mockToken = '123';
      spyOn(tokenService, 'getToken').and.returnValue(mockToken);

      // Act
      const servicePromise = firstValueFrom(
        service.getOne(productId)
      );
      const req = httpTesting.expectOne({
        method: 'GET',
        url: `${API_URL}/${productId}`,
      });

      req.flush(mockData);
      const serviceResponse = await servicePromise;

      // Assert
      expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${mockToken}`);
      expect(serviceResponse).toEqual(mockData);
    });

    it('should return error message for status code 404', (doneFn: DoneFn) => {
      // Arrange
      const productId = '1';
      const errorMsg = 'El producto no existe';
      const mockError = {
        status: 404,
        statusText: errorMsg,
      };

      // Act
      service.getOne(productId).subscribe({
        error: (err: string) => {
          // Assert
          expect(err).toEqual(errorMsg);
          doneFn();
        },
      });

      const req = httpTesting.expectOne({
        method: 'GET',
        url: `${API_URL}/${productId}`,
      });

      req.flush(errorMsg, mockError);
    });
  });

  describe('create()', () => {
    it('should create a product', async () => {
      // Arrange
      const mockData = generateOneProduct();
      const productDto: CreateProductDTO = {
        title: mockData.title,
        price: mockData.price,
        images: mockData.images,
        description: mockData.description,
        categoryId: 1,
        taxes: mockData.taxes,
      };

      // Act
      const productPromise = firstValueFrom(
        service.create({...productDto})
      );
      const req = httpTesting.expectOne({
        method: 'POST',
        url: API_URL,
      });

      req.flush(mockData);
      const serviceResponse = await productPromise;

      // Assert
      expect(serviceResponse).toEqual(mockData);
      expect(req.request.body).toEqual(productDto);
    });
  });

  describe('update()', () => {
    it('should update a product', async () => {
      // Arrange
      const mockData = generateOneProduct();
      const productToUpdate: UpdateProductDTO = {
        title: '',
        price: 45,
      };

      // Act
      const servicePromise = firstValueFrom(
        service.update(
          mockData.id,
          {...productToUpdate}
        )
      );
      const req = httpTesting.expectOne({
        method: 'PUT',
        url: `${API_URL}/${mockData.id}`,
      });

      req.flush({
        ...mockData,
        ...productToUpdate,
      });
      const serviceResponse = await servicePromise;

      // Assert
      expect(req.request.body).toEqual(productToUpdate);
      expect(serviceResponse).toEqual({
        ...mockData,
        ...productToUpdate,
      });
    });

    it('should not to update a product', async () => {
      // Arrange
      const mockData = generateOneProduct();
      const productToUpdate: UpdateProductDTO = {};

      // Act
      const servicePromise = firstValueFrom(
        service.update(
          mockData.id,
          {...productToUpdate}
        )
      );
      const req = httpTesting.expectOne({
        method: 'PUT',
        url: `${API_URL}/${mockData.id}`,
      });

      req.flush({
        ...mockData,
        ...productToUpdate,
      });
      const serviceResponse = await servicePromise;

      // Assert
      expect(req.request.body).toEqual(productToUpdate);
      expect(serviceResponse).toEqual(mockData);
    });
  });

  describe('delete()', () => {
    it('should delete a product', async () => {
      // Arrange
      const productId = generateOneProduct().id;

      // Act
      const servicePromise = firstValueFrom(
        service.delete(productId)
      );
      const req = httpTesting.expectOne({
        method: 'DELETE',
        url: `${API_URL}/${productId}`,
      });

      req.flush(true);
      const serviceResponse = await servicePromise;

      // Assert
      expect(serviceResponse).toBeTrue();
    });
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });
});

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { Observable, throwError, zip } from 'rxjs';

import { Product, CreateProductDTO, UpdateProductDTO } from '../../interfaces/product.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly apiUrl = `${environment.API_URL}/products`;

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  public getAll(limit?: number, offset?: number): Observable<Product[]> {
    let params = new HttpParams();

    if (limit != null && limit != undefined && offset != null && offset != undefined) {
      params = params.append('limit', limit);
      params = params.append('offset', offset);
    }

    return this.httpClient.get<Product[]>(this.apiUrl, { params })
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: item.price > 0 ? .19 * item.price : 0,
        };
      }))
    );
  }

  public fetchReadAndUpdate(id: string, dto: UpdateProductDTO): Observable<[Product, Product]> {
    return zip(
      this.getOne(id),
      this.update(id, dto)
    );
  }

  public getOne(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) return throwError(
          () => 'Algo esta fallando en el server'
        );
        if (error.status === HttpStatusCode.NotFound) return throwError(
          () => 'El producto no existe'
        );
        if (error.status === HttpStatusCode.Unauthorized) return throwError(
          () => 'No estas permitido'
        );

        return throwError(() => 'Ups algo salio mal');
      })
    );
  }

  public create(dto: CreateProductDTO): Observable<Product> {
    return this.httpClient.post<Product>(this.apiUrl, dto);
  }

  public update(id: string, dto: UpdateProductDTO): Observable<Product> {
    return this.httpClient.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  public delete(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}

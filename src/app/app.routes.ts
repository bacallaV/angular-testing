import { Routes } from '@angular/router';
/* Components */
import { HomeComponent } from './pages/home/home.component';
import { PicoPreviewComponent } from './pages/pico-preview/pico-preview.component';
import { ProductsComponent } from './pages/products/products.component';
import { HighlightComponent } from './pages/highlight/highlight.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'pico-preview',
    component: PicoPreviewComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'highlight-directive',
    component: HighlightComponent,
  },
];

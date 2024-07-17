import { ComponentFixture } from '@angular/core/testing';
import { queryByCSS } from './finders';

export function clickEvent<T>(fixture: ComponentFixture<T>, selector: string): void {
  const element = queryByCSS(fixture, selector);

  element.triggerEventHandler('click');
}

export function clickElement<T>(fixture: ComponentFixture<T>, selector: string): void {
  const element: HTMLElement = queryByCSS(fixture, selector).nativeElement;

  element.click();
}

export function inputData<T>(fixture: ComponentFixture<T>, selector: string, value: string): void {
  const input: HTMLInputElement = queryByCSS(fixture, selector).nativeElement;

  input.value = value;
  input.dispatchEvent(new Event('input'));
}

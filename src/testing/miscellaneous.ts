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

export function inputData<T>(fixture: ComponentFixture<T>, selector: string, value: string): void;
export function inputData<T>(fixture: ComponentFixture<T>, selector: string, value: boolean): void;
export function inputData<T>(fixture: ComponentFixture<T>, selector: string, value: string | boolean): void {
  const inputDe = queryByCSS(fixture, selector);

  if(!inputDe) throw new Error(`inputData(): ${selector} input element not found`);

  if (typeof value === 'string')
    (inputDe.nativeElement as HTMLInputElement).value = value;
  else if (typeof value === 'boolean')
    (inputDe.nativeElement as HTMLInputElement).checked = true;

  (inputDe.nativeElement as HTMLInputElement).dispatchEvent(new Event('input'));
}

export function dispatchEvent<T>(fixture: ComponentFixture<T>, selector: string, eventName: string): void {
  const debugElement = queryByCSS(fixture, selector);

  if(!debugElement) throw new Error(`dispatchEvent(): ${selector} not found`);

  (debugElement.nativeElement as HTMLElement).dispatchEvent(new Event(eventName));
}

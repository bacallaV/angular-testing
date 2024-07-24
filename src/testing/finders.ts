import { DebugElement, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function queryByCSS<T>(fixture: ComponentFixture<T>, selector: string): DebugElement {
  const debugElement = fixture.debugElement.query(By.css(selector));

  return debugElement;
}

export function queryAllByCSS<T>(fixture: ComponentFixture<T>, selector: string): DebugElement[] {
  const debugElement = fixture.debugElement.queryAll(By.css(selector));

  return debugElement;
}

export function queryByDirective<T, D>(fixture: ComponentFixture<T>, directive: Type<D>): DebugElement {
  const debugElement = fixture.debugElement.query(By.directive(directive));

  return debugElement;
}

export function queryAllByDirective<T, D>(fixture: ComponentFixture<T>, directive: Type<D>): DebugElement[] {
  const debugElement = fixture.debugElement.queryAll(By.directive(directive));

  return debugElement;
}

export function getTextByCSSQuery<T>(fixture: ComponentFixture<T>, selector: string): string | null {
  const debugElement = fixture.debugElement.query(By.css(selector));

  if(!debugElement) throw new Error(`getTextByCSSQuery(): ${selector} not found}`);

  return (debugElement.nativeElement as HTMLElement).textContent;
}

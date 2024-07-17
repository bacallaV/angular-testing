import { DebugElement, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function queryByCSS<T>(fixture: ComponentFixture<T>, selector: string): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}

export function queryAllByCSS<T>(fixture: ComponentFixture<T>, selector: string): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}

export function queryByDirective<T, D>(fixture: ComponentFixture<T>, directive: Type<D>): DebugElement {
  return fixture.debugElement.query(By.directive(directive));
}

export function queryAllByDirective<T, D>(fixture: ComponentFixture<T>, directive: Type<D>): DebugElement[] {
  return fixture.debugElement.queryAll(By.directive(directive));
}

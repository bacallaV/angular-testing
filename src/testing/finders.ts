import { DebugElement, Predicate, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

function query<T>(fixture: ComponentFixture<T>, predicate: Predicate<DebugElement>): DebugElement {
  const debugElement = fixture.debugElement.query(predicate);

  if(!debugElement) throw new Error(`${predicate} not found`);

  return debugElement;
}

function queryAll<T>(fixture: ComponentFixture<T>, predicate: Predicate<DebugElement>): DebugElement[] {
  const debugElement = fixture.debugElement.queryAll(predicate);

  if(!debugElement) throw new Error(`${predicate} not found`);

  return debugElement;
}

export function queryByCSS<T>(fixture: ComponentFixture<T>, selector: string): DebugElement {
  return query(fixture, By.css(selector));
}

export function queryAllByCSS<T>(fixture: ComponentFixture<T>, selector: string): DebugElement[] {
  return queryAll(fixture, By.css(selector));
}

export function queryByDirective<T, D>(fixture: ComponentFixture<T>, directive: Type<D>): DebugElement {
  return query(fixture, By.directive(directive));
}

export function queryAllByDirective<T, D>(fixture: ComponentFixture<T>, directive: Type<D>): DebugElement[] {
  return queryAll(fixture, By.directive(directive));
}

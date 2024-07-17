import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';

import * as Testing from '../../testing';

import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  const pipe = new ReversePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "amor" to "roma"', () => {
    const transformedString = pipe.transform('amor');

    expect(transformedString).toEqual('roma');
  });
});

@Component({
  standalone: true,
  imports: [FormsModule, ReversePipe],
  template: `
    <h5>{{'valorsito' | reverse}}</h5>
		<input [(ngModel)]="text"/>
		<p>{{text | reverse}}</p>
  `,
})
class TestHostComponent {
  public text: string = '';
}

describe('ReversePipe in TestHostComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;

    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should transform <h5>', () => {
    const h5: HTMLElement = Testing.queryByCSS(fixture, 'h5').nativeElement;

    expect(h5.textContent).toEqual('otisrolav');
  });

  it('should transform reactively with <input>', () => {
    const input: HTMLInputElement = Testing.queryByCSS(fixture, 'input').nativeElement;
    const p: HTMLElement = Testing.queryByCSS(fixture, 'p').nativeElement;

    expect(p.textContent).withContext('initial value').toEqual('');

    input.value = 'valorsito';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(p.textContent).withContext('new value due to input').toEqual('otisrolav');
  });
});

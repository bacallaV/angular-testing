import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

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
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should transform <h5>', () => {
    const h5: HTMLElement = debugElement.query(By.css('h5')).nativeElement;

    expect(h5.textContent).toEqual('otisrolav');
  });

  it('should transform reactively with <input>', () => {
    const input: HTMLInputElement = debugElement.query(By.css('input')).nativeElement;
    const p: HTMLElement = debugElement.query(By.css('p')).nativeElement;

    expect(p.textContent).withContext('initial value').toEqual('');

    input.value = 'valorsito';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(p.textContent).withContext('new value due to input').toEqual('otisrolav');
  });
});

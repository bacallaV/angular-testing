import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as Testing from '@testing/index';

import { HighlightDirective } from './highlight.directive';

/**
 * Tests with father TestHostComponent
*/
@Component({
  standalone: true,
  imports: [FormsModule, HighlightDirective],
  template: `
    <p appHighlight>
			Highlight default
		</p>

		<p appHighlight="yellow">
			Highlight yellow
		</p>

		<p appHighlight="pink">
			Highlight pink
		</p>

		<p>
			Otro párrafo
		</p>

		<input
      [(ngModel)]="color"
      [appHighlight]="color" />
  `,
})
class TestHostComponent {
  public color: string = 'purple';
}

describe('HighlightDirective', () => {
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

  it('should have 4 elements with #HighlightDirective', () => {
    // Arrange
    // Opt 1 to get elements with #HighlightDirective
    // const highlightElements = fixture.debugElement.queryAll(By.css('*[appHighlight]'));

    // Opt 2 to get elements with #HighlightDirective ✅
    const highlightElements = Testing.queryAllByDirective(fixture, HighlightDirective);
    const notHighlightElements = Testing.queryAllByCSS(fixture, '*:not([appHighlight])');

    expect(highlightElements.length).toEqual(4);
    expect(notHighlightElements.length).toEqual(2);
  });

  it('should have the first element with #HighlightDirective with default color', () => {
    const firstElWithDirective = Testing.queryAllByDirective(fixture, HighlightDirective)[0];
    // Getting the Directive from DebugElement
    const directive = firstElWithDirective.injector.get(HighlightDirective);

    expect(firstElWithDirective.styles['backgroundColor']).toEqual(directive.DEFAULT_COLOR);
  });

  it('should bind <input> and change color', () => {
    const inputElement: HTMLInputElement = Testing.queryByCSS(fixture, 'input').nativeElement;
    const newColor = 'pink';

    expect(inputElement.style['backgroundColor']).toEqual(component.color);

    // Sending event to the input element
    inputElement.value = newColor;
    inputElement.dispatchEvent(new Event('input'));
    // fixture.detectChanges();

    expect(inputElement.style['backgroundColor']).toEqual(newColor);
  });
});

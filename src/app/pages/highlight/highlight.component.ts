import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-highlight',
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
export class HighlightComponent {
  public color: string = 'purple';
}

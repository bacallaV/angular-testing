import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighlightDirective } from '@core/directives/highlight.directive';
import { ReversePipe } from '@core/pipes/reverse.pipe';

@Component({
  selector: 'app-highlight',
  standalone: true,
  imports: [FormsModule, HighlightDirective, ReversePipe],
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
			{{color | reverse}}
		</p>

		<input
      [(ngModel)]="color"
      [appHighlight]="color" />
  `,
})
export class HighlightComponent {
  public color: string = 'purple';
}

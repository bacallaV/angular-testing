import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnChanges {
	@Input()
	public appHighlight: string = '';

	public readonly DEFAULT_COLOR = 'yellow';

	constructor(private readonly element: ElementRef) {
		this.element.nativeElement.style.backgroundColor = this.DEFAULT_COLOR;
	}

	ngOnChanges(): void {
		this.element.nativeElement.style.backgroundColor =
      this.appHighlight || this.DEFAULT_COLOR;
	}
}

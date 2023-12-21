import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[appToggleMenu]'
})
export class ToggleMenuDirective {

	menuToggle: ElementRef;
	contenedor: ElementRef;
	isOpen:boolean = true;
	
	constructor(private el:ElementRef,
					private render: Renderer2) {	}

	@HostListener('click') click(){
		this.toggleMenu();
	}

	private toggleMenu(){
		this.menuToggle = this.el.nativeElement.parentNode.parentNode.nextSibling.firstChild.firstChild.firstChild; // aside
		this.contenedor = this.el.nativeElement.parentNode.parentNode.nextSibling.firstChild.firstChild.children[1]; // div

		if(this.isOpen){
			this.render.setStyle(this.menuToggle, 'display', 'none');
			this.render.removeClass(this.contenedor, 'col-10');
			this.render.addClass(this.contenedor, 'col-12');
			this.isOpen = false;
			localStorage.setItem("toggleMenu", "close");
		}
		else{
			this.render.setStyle(this.menuToggle, 'display', 'initial');
			this.render.removeClass(this.contenedor, 'col-12');
			this.render.addClass(this.contenedor, 'col-10');
			this.isOpen = true;
			localStorage.setItem("toggleMenu", "open");
		}
	}

}

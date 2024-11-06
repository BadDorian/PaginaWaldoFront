import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating-button',
  standalone: true,
  imports: [],
  templateUrl: './floating-button.component.html',
  styleUrl: './floating-button.component.scss'
})
export class FloatingButtonComponent {
  @Input() targetDivId!: string;
  constructor(private router: Router) {}

  scrollToDiv() {
    const element = document.getElementById(this.targetDivId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

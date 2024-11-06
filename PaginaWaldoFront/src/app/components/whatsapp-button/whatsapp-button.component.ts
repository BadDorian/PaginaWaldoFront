import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [],
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.scss'
})
export class WhatsappButtonComponent {
  @Input() imgSrcWsp!: string;
  whatsappLink: string = '';
  constructor() {}
}




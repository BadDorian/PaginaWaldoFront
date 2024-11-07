import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, 
    MatButtonModule,
    MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() images: { url: string }[] = [];
  currentIndex: number = 0;
  intervalId: any;  // Guardar el ID del intervalo

  // Configura el cambio automático de imágenes al iniciar el componente
  ngOnInit(): void {
    this.startAutoSlide();
  }

  // Detiene el cambio automático de imágenes cuando el componente se destruye
  ngOnDestroy(): void {
    clearInterval(this.intervalId);  // Limpia el intervalo para evitar fugas de memoria
  }

  // Método para iniciar el cambio automático de imágenes
  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();  // Cambia a la siguiente imagen cada vez que se ejecuta
    }, 5000); // Cambiar imagen cada 5 segundos
  }

  // Cambiar a la imagen anterior
  prevSlide(): void {
    this.currentIndex = (this.currentIndex === 0) ? this.images.length - 1 : this.currentIndex - 1;
  }

  // Cambiar a la imagen siguiente
  nextSlide(): void {
    this.currentIndex = (this.currentIndex === this.images.length - 1) ? 0 : this.currentIndex + 1;
  }

  // Cambiar a una imagen específica por índice
  setSlide(index: number): void {
    this.currentIndex = index;
  }

  // Determinar si la imagen actual es la activa
  isActive(index: number): boolean {
    return this.currentIndex === index;
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieProductsComponent } from './categorie-products.component';

describe('CategorieProductsComponent', () => {
  let component: CategorieProductsComponent;
  let fixture: ComponentFixture<CategorieProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriesProductsComponent } from './sub-categories-products.component';

describe('SubCategoriesProductsComponent', () => {
  let component: SubCategoriesProductsComponent;
  let fixture: ComponentFixture<SubCategoriesProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategoriesProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubCategoriesProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CartShoppingService } from './cart-shopping.service';

describe('CartShoppingService', () => {
  let service: CartShoppingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartShoppingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

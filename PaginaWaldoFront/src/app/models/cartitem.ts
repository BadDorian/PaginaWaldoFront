import { Product } from "./product";

export interface CartItem {
    producto:  Product;  // Utiliza la misma estructura que definiste
    cantidad: number;
    
  }
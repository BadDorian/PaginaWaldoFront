import { Product } from "./product";

export interface SubCategoria {
    id: number;
    descripcion: string;
    tipoProductoId: number;
    productos: Product[];
  }
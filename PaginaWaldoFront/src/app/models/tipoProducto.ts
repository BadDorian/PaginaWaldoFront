import { SubCategoria } from "./subCategoria";

export interface TipoProducto {
    id: number;
    descripcion: string;
    subCategorias: SubCategoria[];
  }
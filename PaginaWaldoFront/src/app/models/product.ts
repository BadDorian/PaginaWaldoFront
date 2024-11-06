export interface Product {

    codigo: number,
    descripcion: string,
    id: number,
    imgProduct: string,
    nombre: string,
    precio: number,
    stock: number,
    subCategoriaId: number,
    subCategoriaProducto?:any,
    tipoProductoDescripcion? : string,
    subTipoProductoDescripcion? : string
  }
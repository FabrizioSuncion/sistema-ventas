import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../models/producto.model';
import { ProductoForm } from '../producto-form/producto-form';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ProductoForm],
  templateUrl: './productos.html'
})
export class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);

  productos = signal<Producto[]>([]);

  @ViewChild(ProductoForm) formularioProducto!: ProductoForm;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos()
      .subscribe({
        next: productos => {
          console.log('Datos recibidos:', productos);
          this.productos.set(productos);
        },
        error: error => console.error(error)
      });
  }

  seleccionarParaEditar(producto: Producto): void {
    if (this.formularioProducto) {
      this.formularioProducto.editarProducto(producto);
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar producto?')) {
      return;
    }

    this.productoService.eliminarProducto(id)
      .subscribe({
        next: () => this.cargarProductos(),
        error: error => console.error(error)
      });
  }
}
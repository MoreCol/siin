import { useEffect, useState } from "react";

const FORM_VACIO = {
  codigo: "",
  nombre: "",
  categoria: "Papelería",
  precio: "",
  stock: "",
  estado: "Activo",
};

export default function ProductoModal({ editingProduct, onGuardar, onClose }) {
  const [formData, setFormData] = useState(FORM_VACIO);

  // Si editas: carga datos. Si es nuevo: limpia.
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        codigo: editingProduct.codigo ?? "",
        nombre: editingProduct.nombre ?? "",
        categoria: editingProduct.categoria ?? "Papelería",
        precio: editingProduct.precio ?? "",
        stock: editingProduct.stock ?? "",
        estado: editingProduct.estado ?? "Activo",
      });
    } else {
      setFormData(FORM_VACIO);
    }
  }, [editingProduct]); // se ejecuta cuando cambia el producto a editar 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onGuardar({
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      categoria: formData.categoria,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      estado: formData.estado,
    });
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <h2>{editingProduct ? "Editar" : "Nuevo"} Producto</h2>
        <h4 className="subtitle">Ingresar Campos</h4>

        <form onSubmit={handleSubmit}>
          <input
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Código"
            required
          />

          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />

          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="Papelería">Papelería</option>
          </select>

          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Precio"
            required
          />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            required
          />

          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="Activo">Activo</option>
            <option value="Bajo">Bajo</option>
            <option value="Agotado">Agotado</option>
          </select>

          <div className="modal-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

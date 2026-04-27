import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  FaBox, FaSave, FaTrash, FaSyncAlt, FaPlus, FaTimes, FaInfoCircle, FaExclamationTriangle 
} from "react-icons/fa";

export default function ProductoForm() {
  const { id } = useParams(); // Si hay ID, estamos editando
  const navigate = useNavigate();

  // Estados del Formulario de Producto
  const [producto, setProducto] = useState({
    nombre: "",
    categoria_id: "",
    precio: 0,
    stock: 0,
    stock_minimo: 5,
    descripcion: "",
    imagen_url: ""
  });

  // Estados para Categorías
  const [categorias, setCategorias] = useState([]);
  const [nuevaCatNombre, setNuevaCatNombre] = useState("");

  useEffect(() => {
    cargarCategorias();
    if (id) cargarProducto();
  }, [id]);

  const cargarCategorias = async () => {
    const res = await api.get("/categorias");
    setCategorias(res.data);
  };

  const cargarProducto = async () => {
    const res = await api.get(`/productos/${id}`);
    setProducto(res.data);
  };

  const handleInputChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/productos/${id}`, producto);
        alert("Producto actualizado con éxito");
      } else {
        await api.post("/productos", producto);
        alert("Producto creado con éxito");
      }
      navigate("/productos"); // Volver a la lista
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto");
    }
  };

  const eliminarProducto = async () => {
    if (window.confirm("¿Estás seguro de desactivar este producto?")) {
      await api.delete(`/productos/${id}`);
      navigate("/productos");
    }
  };

  const crearCategoria = async () => {
    if (!nuevaCatNombre) return;
    try {
      // Nota: No pasaste la ruta POST de categorias, 
      // pero asumo que es similar a productos
      await api.post("/categorias", { nombre: nuevaCatNombre });
      setNuevaCatNombre("");
      cargarCategorias();
      alert("Categoría creada");
    } catch (error) {
      alert("Error al crear categoría");
    }
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Breadcrumb simulado */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">Inicio</li>
          <li className="breadcrumb-item">Productos</li>
          <li className="breadcrumb-item active text-danger fw-bold">
            {id ? "Editar Producto" : "Agregar Producto"}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Lado Izquierdo: Formulario Principal */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-danger p-3 rounded-circle text-white me-3">
                <FaBox size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">Información del Producto</h4>
                <p className="text-muted small mb-0">Completa los datos para el inventario</p>
              </div>
            </div>

            <form onSubmit={guardarProducto}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre del Producto*</label>
                <input 
                  name="nombre" value={producto.nombre} onChange={handleInputChange}
                  className="form-control form-control-lg rounded-3" placeholder="Ej. Balón de Fútbol" required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Categoría del Producto*</label>
                <select 
                  name="categoria_id" value={producto.categoria_id} onChange={handleInputChange}
                  className="form-select form-select-lg rounded-3" required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Precio*</label>
                  <input 
                    name="precio" type="number" value={producto.precio} onChange={handleInputChange}
                    className="form-control form-control-lg rounded-3" placeholder="S/ 0.00" required 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Stock*</label>
                  <input 
                    name="stock" type="number" value={producto.stock} onChange={handleInputChange}
                    className="form-control form-control-lg rounded-3" placeholder="0" required 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Descripción (Opcional)</label>
                <textarea 
                  name="descripcion" value={producto.descripcion} onChange={handleInputChange}
                  className="form-control rounded-3" rows="4" placeholder="Ej. Balón oficial..."
                />
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-danger btn-lg px-5 rounded-3 fw-bold">
                  <FaSave className="me-2" /> {id ? "Actualizar Producto" : "Guardar Producto"}
                </button>
                <button type="button" onClick={() => navigate("/productos")} className="btn btn-outline-secondary btn-lg px-5 rounded-3 fw-bold">
                  <FaSyncAlt className="me-2" /> Limpiar
                </button>
              </div>
            </form>
          </div>

          {/* Banner de Ayuda inferior */}
          <div className="alert alert-danger border-0 rounded-4 p-3 d-flex align-items-center shadow-sm">
            <FaInfoCircle className="me-3 fs-4" />
            <div>
              <p className="mb-0 fw-bold small text-dark">¿Editando un producto?</p>
              <p className="mb-0 x-small text-muted" style={{fontSize: '0.8rem'}}>
                Realiza los cambios necesarios y haz clic en "Actualizar Producto" para guardar.
              </p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Acciones y Nueva Categoria */}
        <div className="col-lg-4">
          {/* Acciones */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">Acciones</h5>
            <p className="text-muted small">Gestiona el producto desde aquí.</p>
            <button className="btn btn-danger w-100 py-2 mb-3 rounded-3 fw-bold" disabled={!id}>
              <FaSyncAlt className="me-2" /> Actualizar Producto
            </button>
            <button 
              type="button" onClick={eliminarProducto} 
              className="btn btn-outline-danger w-100 py-2 rounded-3 fw-bold" disabled={!id}
            >
              <FaTrash className="me-2" /> Eliminar Producto
            </button>
            {id && (
              <div className="mt-3 p-3 bg-warning-subtle rounded-3 d-flex align-items-start">
                <FaExclamationTriangle className="text-warning me-2 mt-1" />
                <p className="mb-0 small text-dark" style={{fontSize: '0.75rem'}}>
                  Al eliminar un producto, esta acción no se puede deshacer.
                </p>
              </div>
            )}
          </div>

          {/* Nueva Categoría */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Nueva Categoría</h5>
              <FaTimes className="text-muted cursor-pointer" />
            </div>
            <p className="text-muted small mb-4">Crea una nueva categoría para organizar productos.</p>
            
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Nombre de la Categoría*</label>
              <input 
                value={nuevaCatNombre} onChange={(e) => setNuevaCatNombre(e.target.value)}
                className="form-control rounded-3" placeholder="Ej. Accesorios deportivos" 
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Descripción (opcional)</label>
              <textarea className="form-control rounded-3" rows="3" placeholder="Ej. Gorras, medias..."></textarea>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary w-50 rounded-3">Cancelar</button>
              <button onClick={crearCategoria} className="btn btn-danger w-50 rounded-3">
                <FaSave className="me-1" /> Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importamos Link para la navegación
import api from "../services/api";
import { FaSearch, FaTrash, FaFilter, FaPencilAlt, FaPlus } from "react-icons/fa";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [categoria, setCategoria] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  async function cargarCategorias() {
    try {
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al cargar categorías", error);
    }
  }

  async function cargarProductos() {
    let url = "/productos";
    const params = [];
    if (buscar) params.push(`buscar=${buscar}`);
    if (categoria) params.push(`categoria=${categoria}`);
    if (params.length) url += `?${params.join("&")}`;

    try {
      const res = await api.get(url);
      setProductos(res.data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  }

  async function eliminar(id) {
    if (window.confirm("¿Estás seguro de desactivar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        cargarProductos();
      } catch (error) {
        console.error("Error al eliminar", error);
      }
    }
  }

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-0">Productos</h1>
          <p className="text-muted">Inicio {">"} <span className="text-danger">Productos</span></p>
        </div>
        <Link to="/productos/nuevo" className="btn btn-danger rounded-3 px-4 fw-bold">
          <FaPlus className="me-2" /> Agregar Producto
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div className="card border-0 shadow-sm p-3 mb-4 rounded-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                placeholder="Buscar Producto..."
                className="form-control border-start-0 ps-0 shadow-none"
              />
            </div>
          </div>

          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaFilter className="text-muted" />
              </span>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="form-select border-start-0 ps-0 shadow-none text-muted"
              >
                <option value="">All Categories</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="col-md-2">
             <button onClick={cargarProductos} className="btn btn-dark w-100 rounded-3">Filtrar</button>
          </div>
        </div>
      </div>

      {/* Tabla de Productos Estilo Imagen */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white">
              <tr className="text-muted small text-uppercase">
                <th className="ps-4 py-3">Imagen</th>
                <th>Nombre del Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {productos.length > 0 ? (
                productos.map((p) => (
                  <tr key={p.id} className="border-bottom">
                    <td className="ps-4 py-3">
                      <img 
                        src={p.imagen_url} 
                        alt={p.nombre}
                        className="rounded-3 shadow-sm"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        // Si la URL falla, ejecuta esta función:
                        onError={(e) => {
                            e.target.onerror = null; // Previene bucles infinitos si la imagen de respaldo también falla
                            e.target.src = 'https://placehold.co/50?text=No+Image'; // Imagen de repuesto
                        }}
                    />
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{p.nombre}</div>
                      <div className="text-muted extra-small" style={{ fontSize: '0.7rem' }}>
                        ID: {p.id.toString().padStart(4, '0')}
                      </div>
                    </td>
                    <td className="text-muted">{p.categoria}</td>
                    <td className="fw-bold text-dark">${p.precio}</td>
                    <td>
                      <span className={`fw-bold ${p.stock < 10 ? 'text-danger' : 'text-success'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      {p.stock > 10 ? (
                        <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3">
                           ● In Stock
                        </span>
                      ) : (
                        <span className="badge rounded-pill bg-warning-subtle text-warning border border-warning-subtle px-3">
                           ● Low Stock
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        {/* BOTÓN EDITAR - Te manda al formulario */}
                        <button
                          onClick={() => navigate(`/productos/editar/${p.id}`)}
                          className="btn btn-light btn-sm border rounded-3 text-muted"
                          title="Editar"
                        >
                          <FaPencilAlt />
                        </button>
                        {/* BOTÓN ELIMINAR */}
                        <button
                          onClick={() => eliminar(p.id)}
                          className="btn btn-light btn-sm border rounded-3 text-danger"
                          title="Desactivar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">No se encontraron productos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  FaSearch, FaTrash, FaPencilAlt, FaPlus, FaSave, FaTimes,
  FaFutbol, FaTshirt, FaRunning, FaShoppingBag, FaTableTennis, FaBox 
} from "react-icons/fa";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar modal
  
  const [nuevaCat, setNuevaCat] = useState({ nombre: "", descripcion: "" });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al cargar categorías", error);
    }
  };

  const guardarCategoria = async (e) => {
    if (e) e.preventDefault();
    if (!nuevaCat.nombre.trim()) return alert("El nombre es obligatorio");

    try {
      await api.post("/categorias", nuevaCat);
      setNuevaCat({ nombre: "", descripcion: "" });
      setShowModal(false); // Cerramos el modal tras guardar
      cargarCategorias();
    } catch (error) {
      alert("Error al crear la categoría");
    }
  };

  const renderIcon = (nombre) => {
    const n = nombre.toLowerCase();
    const iconProps = { className: "text-danger fs-2" };
    if (n.includes("fútbol") || n.includes("futbol")) return <FaFutbol {...iconProps} />;
    if (n.includes("calzado") || n.includes("zapatilla")) return <FaRunning {...iconProps} />;
    if (n.includes("ropa")) return <FaTshirt {...iconProps} />;
    if (n.includes("accesorio")) return <FaBox {...iconProps} />;
    return <FaBox {...iconProps} />;
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-0">Categorías</h1>
          <p className="text-muted">Inicio {">"} <span className="text-danger">Categorías</span></p>
        </div>
        {/* ÚNICO BOTÓN DE ACCIÓN */}
        <button 
          onClick={() => setShowModal(true)} 
          className="btn btn-danger rounded-3 px-4 fw-bold shadow-sm"
        >
          <FaPlus className="me-2" /> Agregar Categoría
        </button>
      </div>

      {/* Buscador y Tabla a pantalla completa */}
      <div className="card border-0 shadow-sm p-3 mb-4 rounded-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
            <input
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar Categoría..."
              className="form-control border-start-0 ps-0 shadow-none"
            />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white">
              <tr className="text-muted small text-uppercase">
                <th className="ps-4">Icono</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="text-center">Productos</th>
                <th>Estado</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {categorias.filter(c => c.nombre.toLowerCase().includes(buscar.toLowerCase())).map((cat) => (
                <tr key={cat.id} className="border-bottom">
                  <td className="ps-4 py-3">
                    <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
                      {renderIcon(cat.nombre)}
                    </div>
                  </td>
                  <td><span className="fw-bold">{cat.nombre}</span></td>
                  <td className="text-muted small">{cat.descripcion}</td>
                  <td className="text-center fw-bold">{cat.total_productos}</td>
                  <td>
                    <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3">● Active</span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-light btn-sm border me-2"><FaPencilAlt /></button>
                    <button className="btn btn-light btn-sm border text-danger"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL EMERGENTE --- */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pt-4 px-4">
                <h5 className="modal-title fw-bold">Nueva Categoría</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body px-4">
                <p className="text-muted small mb-4">Crea una nueva categoría para organizar los productos.</p>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Nombre de la Categoría*</label>
                  <input 
                    value={nuevaCat.nombre}
                    onChange={(e) => setNuevaCat({...nuevaCat, nombre: e.target.value})}
                    className="form-control rounded-3" 
                    placeholder="Ej. Accesorios deportivos" 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Descripción (opcional)</label>
                  <textarea 
                    value={nuevaCat.descripcion}
                    onChange={(e) => setNuevaCat({...nuevaCat, descripcion: e.target.value})}
                    className="form-control rounded-3" 
                    rows="3" 
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0 pb-4 px-4 pt-0 d-flex gap-2">
                <button 
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline-secondary w-50 rounded-3 fw-bold"
                >
                  Cancelar
                </button>
                <button 
                  onClick={guardarCategoria}
                  className="btn btn-danger w-50 rounded-3 fw-bold shadow-sm"
                >
                  <FaSave className="me-2" /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
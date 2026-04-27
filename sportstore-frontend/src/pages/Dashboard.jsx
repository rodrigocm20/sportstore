import { useEffect, useState } from "react";
import api from "../services/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { 
  FaBox, FaArrowDown, FaCheckCircle, FaMoneyBillWave, 
  FaPlus, FaTags, FaFileAlt, FaUsers 
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [stockBajo, setStockBajo] = useState([]);
  const [categoriasData, setCategoriasData] = useState([]);

  useEffect(() => {
    cargarDashboard();
  }, []);

  async function cargarDashboard() {
    try {
      // 1. Obtener estadísticas generales
      const statsRes = await api.get("/productos/estadisticas/dashboard");
      setStats(statsRes.data);

      // 2. Obtener productos con stock bajo
      const stockRes = await api.get("/productos/stock-bajo");
      setStockBajo(stockRes.data);

      // 3. Lógica para el gráfico de Categorías
      // Obtenemos todas las categorías y productos para cruzar la información
      const [catRes, prodRes] = await Promise.all([
        api.get("/categorias"),
        api.get("/productos")
      ]);

      const categoriasSimples = catRes.data;
      const todosLosProductos = prodRes.data;

      // Mapeamos las categorías y contamos cuántos productos tiene cada una
      const dataProcesada = categoriasSimples.map(cat => {
        const cantidad = todosLosProductos.filter(p => 
          p.categoria_id === cat.id || p.categoria?.id === cat.id
        ).length;

        return {
          name: cat.nombre,
          value: cantidad // Valor real: cantidad de productos
        };
      }).filter(item => item.value > 0); // Opcional: solo mostrar categorías con productos

      setCategoriasData(dataProcesada);

    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    }
  }

  // Colores modernos (Rojo Sport, Negro, Gris, Verde, etc.)
  const COLORS = ["#dc3545", "#212529", "#198754", "#ffc107", "#0dcaf0", "#6610f2"];

  return (
    <div className="container-fluid p-4 bg-light" style={{ minHeight: '100vh' }}>
      {/* Encabezado */}
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-1">Inicio</h1>
        <p className="text-muted">Bienvenido, <span className="text-danger fw-bold">Administrador</span></p>
      </div>

      {/* Cards de Estadísticas (Fiel a la imagen de referencia) */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard 
            label="Total de productos" 
            value={stats.total_productos} 
            subLabel="Todos los productos"
            icon={<FaBox />} color="danger"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            label="Stock bajo" 
            value={stats.productos_stock_bajo} 
            subLabel="Productos"
            icon={<FaArrowDown />} color="warning"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            label="Productos en stock" 
            value={(stats.total_productos || 0) - (stats.productos_stock_bajo || 0)} 
            subLabel="Disponible"
            icon={<FaCheckCircle />} color="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            label="Valor total inventario" 
            value={stats.valor_inventario} 
            subLabel="Valor en soles"
            icon={<FaMoneyBillWave />} color="info" isMoney={true}
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Tabla de Stock Bajo */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Productos con stock bajo</h5>
              <div className="table-responsive">
                <table className="table table-borderless align-middle">
                  <thead className="text-muted small text-uppercase">
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Stock</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockBajo.length > 0 ? stockBajo.slice(0, 5).map((p) => (
                      <tr key={p.id} className="border-top">
                        <td className="py-3 fw-medium">{p.nombre}</td>
                        <td className="text-muted">{p.categoria?.nombre || 'General'}</td>
                        <td className="text-danger fw-bold">{p.stock}</td>
                        <td>
                          <span className={`badge rounded-pill ${p.stock <= 5 ? 'bg-danger' : 'bg-warning'} px-3`}>
                            {p.stock <= 5 ? 'Crítico' : 'Bajo'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="text-center py-4 text-muted">No hay productos con stock bajo</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Productos por Categoría (DINÁMICO) */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 text-center">
              <h5 className="fw-bold mb-4 text-start">Productos por categoría</h5>
              
              {categoriasData.length > 0 ? (
                <>
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={categoriasData}
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoriasData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Leyenda con valores reales */}
                  <div className="mt-4 text-start">
                    {categoriasData.map((cat, i) => (
                      <div key={i} className="d-flex justify-content-between align-items-center mb-2 small">
                        <span>
                          <span className="me-2" style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }}></span>
                          {cat.name}
                        </span>
                        <span className="fw-bold">{cat.value} pzas.</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-5 text-muted">No hay datos de categorías para mostrar</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <h5 className="fw-bold mb-3">Accesos rápidos</h5>
      <div className="row g-3">
        <QuickAccessCard to="/productos/nuevo" label="Nuevo Producto" subLabel="Agregar producto" icon={<FaPlus />} color="danger" />
        <QuickAccessCard to="/categorias" label="Nueva categoría" subLabel="Organizar productos" icon={<FaTags />} color="dark" />
        <QuickAccessCard to="/reportes" label="Ver reportes" subLabel="Estadísticas" icon={<FaFileAlt />} color="success" />
        <QuickAccessCard to="/usuario" label="Usuarios" subLabel="Gestionar equipo" icon={<FaUsers />} color="info" />
      </div>
    </div>
  );
}

// Sub-componentes
function StatCard({ label, value, subLabel, icon, color, isMoney }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-3">
          <div className={`bg-${color}-subtle text-${color} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
            {icon}
          </div>
          <div>
            <p className="text-muted mb-0 small fw-medium">{label}</p>
            <h3 className="fw-bold mb-0">{isMoney ? `S/ ${(value || 0).toLocaleString()}` : (value || 0)}</h3>
            <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>{subLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAccessCard({ to, label, subLabel, icon, color }) {
  return (
    <div className="col-md-3">
      <Link to={to} className="text-decoration-none card border-0 shadow-sm rounded-4 p-2 transition-all hover-shadow">
        <div className="card-body d-flex align-items-center gap-3">
          <div className={`bg-${color} text-white rounded-3 p-2 fs-5 d-flex`}>{icon}</div>
          <div>
            <p className="mb-0 fw-bold text-dark small">{label}</p>
            <p className="mb-0 text-muted extra-small" style={{ fontSize: '0.7rem' }}>{subLabel}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
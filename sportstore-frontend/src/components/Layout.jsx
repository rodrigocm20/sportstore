import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  FaHome, FaBox, FaTags, FaUsers, FaChartBar, FaShoppingCart, 
  FaCog, FaSignOutAlt, FaUserCircle 
} from "react-icons/fa";

const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`nav-link px-4 py-3 d-flex align-items-center gap-3 transition-all ${
        isActive ? "bg-danger text-white active" : "text-white"
      }`}
      style={{ 
        borderRadius: isActive ? '0 25px 25px 0' : '0', 
        marginRight: '15px', 
        textDecoration: 'none',
        backgroundColor: isActive ? '#dc3545' : 'transparent'
      }}
    >
      <span style={{ color: 'white' }}>{icon}</span>
      <span className="fw-medium"> {label}</span>
    </Link>
  );
};

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      {/* --- SIDEBAR IZQUIERDO ESTÁTICO --- */}
      <aside className="sidebar-raw-container shadow-lg">
        <nav className="d-flex flex-column flex-grow-1 overflow-auto custom-scrollbar" 
             style={{ zIndex: 10, paddingTop: '120px' }}>
          <NavItem to="/" icon={<FaHome />} label="Inicio" />
          <NavItem to="/productos" icon={<FaBox />} label="Productos" />
          <NavItem to="/categorias" icon={<FaTags />} label="Categorías" />
          <NavItem to="/proveedores" icon={<FaUsers />} label="Proveedores" />
          <NavItem to="/ventas" icon={<FaShoppingCart />} label="Ventas" />
          <NavItem to="/reportes" icon={<FaChartBar />} label="Reportes" />
          <NavItem to="/usuario" icon={<FaUserCircle />} label="Usuario" />
          <NavItem to="/config" icon={<FaCog />} label="Configuración" />
        </nav>

        <div className="p-4 mt-auto" style={{ zIndex: 10 }}>
          <button 
            onClick={handleLogout}
            className="btn btn-logout-solid w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- ÁREA DE CONTENIDO --- */}
      <main className="flex-grow-1 d-flex flex-column h-100 overflow-auto bg-light">
        <header className="bg-white p-3 d-flex justify-content-end align-items-center shadow-sm px-4 sticky-top" style={{ zIndex: 1000 }}>
          <div className="d-flex align-items-center gap-2">
            <span className="small fw-bold text-dark">Admin Sport</span>
            <img src="https://ui-avatars.com/api/?name=Admin+Sport&bg=dc3545&color=fff" className="rounded-circle" width="35" alt="user" />
          </div>
        </header>

        <div className="p-4">
          <Outlet /> {/* Aquí se renderizan las páginas (Dashboard, Productos, etc.) */}
        </div>
      </main>

      <style>{`
        .sidebar-raw-container {
          width: 260px; min-width: 260px; height: 100vh;
          position: sticky; top: 0; left: 0;
          display: flex; flex-direction: column;
          background-image: url('/bannerinventario.png');
          background-size: cover; background-position: top center;
          background-repeat: no-repeat; background-color: #000;
          z-index: 1100;
        }
        .btn-logout-solid {
          background-color: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
          color: white; border: 1px solid rgba(255,255,255,0.2); transition: 0.3s;
        }
        .btn-logout-solid:hover { background-color: #dc3545; border-color: #dc3545; }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
}
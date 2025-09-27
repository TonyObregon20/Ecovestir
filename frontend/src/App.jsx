// App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/Productos";
import ProductosPage from "./pages/ProductosPage";
import Footer from "./components/Footer";
import AuthForm from "./components/auth/AuthForm";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from './hooks/useAuth';
import "./index.css";

// Componente para proteger rutas de admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (con navbar y footer) */}
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
            <Productos />
            <Footer />
          </>
        } />
        <Route path="/productos" element={
          <>
            <Navbar />
            <ProductosPage />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <AuthForm />
          </>
        } />

        {/* Ruta de admin (sin navbar ni footer) */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/Productos";
import ProductosPage from "./pages/ProductosPage";
import Footer from "./components/Footer";
import "./index.css";

// Admin
import AdminPage from "./pages/Admin/AdminPage";
import Dashboard from "./pages/Admin/Dashboard";
import Products from "./pages/Admin/Products";
import UsersPage from "./pages/Admin/UsersPage"; // 👈 Importado

// Login
import Login from "./pages/Login";

// Componente para proteger rutas (solo uno es suficiente)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Rutas públicas ===== */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Productos />
              <Footer />
            </>
          }
        />
        <Route
          path="/productos"
          element={
            <>
              <Navbar />
              <ProductosPage />
              <Footer />
            </>
          }
        />

        {/* ===== Login ===== */}
        <Route path="/login" element={<Login />} />

        {/* ===== Rutas protegidas de Admin ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<UsersPage />} /> {/* 👈 ¡Añadida! */}
          <Route path="orders" element={<div>Órdenes (próximamente)</div>} />
          <Route path="reports" element={<div>Reportes (próximamente)</div>} />
        </Route>

        {/* ===== Redirección por defecto ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
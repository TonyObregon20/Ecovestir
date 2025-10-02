// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // 👈 Nuevo
import ProductosPage from "./pages/ProductosPage";
import Footer from "./components/Footer";
import "./index.css";

// Admin
import AdminPage from "./pages/Admin/AdminPage";
import Dashboard from "./pages/Admin/Dashboard";
import Products from "./pages/Admin/Products";
import Login from "./pages/Login"; // 👈 Nuevo

// Componente para proteger rutas
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
        {/* Ruta principal */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
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

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas de admin */}
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
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from 'react'; // 👈 Añadimos useState
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer"; // 👈 Importamos el carrito
import Home from "./pages/Home";
import ProductosPage from "./pages/ProductosPage";
import Footer from "./components/Footer";
import "./index.css";

// Admin
import AdminPage from "./pages/Admin/AdminPage";
import Dashboard from "./pages/Admin/Dashboard";
import Products from "./pages/Admin/Products";
import UsersPage from "./pages/Admin/UsersPage";

// Login
import Login from "./pages/Login";

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false); // 👈 Estado global del carrito

  return (
    <BrowserRouter>
      {/* 👇 El CartDrawer está fuera de las rutas, al nivel superior */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      <Routes>
        {/* ===== Rutas públicas ===== */}
        <Route
          path="/"
          element={
            <>
              <Navbar onCartClick={() => setIsCartOpen(true)} />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/productos"
          element={
            <>
              <Navbar onCartClick={() => setIsCartOpen(true)} />
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
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<div>Órdenes (próximamente)</div>} />
          <Route path="reports" element={<div>Reportes (próximamente)</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
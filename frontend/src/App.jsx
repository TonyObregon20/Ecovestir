// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from 'react';
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import ProductosPage from "./pages/ProductosPage";
import Footer from "./components/Footer";
import "./index.css";

// 👇 Importamos el CartProvider
import { CartProvider } from "./Context/CartContext";

// Admin y Login (igual que antes)
import AdminPage from "./pages/Admin/AdminPage";
import Dashboard from "./pages/Admin/Dashboard";
import Products from "./pages/Admin/Products";
import UsersPage from "./pages/Admin/UsersPage";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider> {/* 👈 Envuelve toda la app */}
      <BrowserRouter>
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />

        <Routes>
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

          <Route path="/login" element={<Login />} />

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
    </CartProvider>
  );
}

export default App;
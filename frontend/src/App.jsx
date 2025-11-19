// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import ProductosPage from "./pages/ProductosPage";
import AboutPage from "./pages/About" // 👈 Ya importado
import Contacto from "./pages/Contacto";
import Blog from "./pages/Blog";
import Footer from "./components/Footer";
import "./index.css";

// usamos context desde el provider en main.jsx
import { useCart } from "./Context/useCart";

// Admin y Login
import AdminPage from "./pages/Admin/AdminPage";
import Dashboard from "./pages/Admin/Dashboard";
import Products from "./pages/Admin/Products";
import UsersPage from "./pages/Admin/UsersPage";
import CategoryManagement from "./pages/Admin/CategoryManagement";
import Login from "./pages/Login"; // 👈 Nuevo
import CategoryPage from "./pages/categories/CategoryPage"; // Página de categorías
import ProductDetail from "./pages/ProductDetail"; // Detalle de producto
import Checkout from "./pages/Checkout"; // Checkout / Pasarela de pago

// ✅ ProtectedRoute mejorado: verifica token Y rol
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos, verificar que el usuario tenga uno de ellos
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCartOpen, openCart, closeCart } = useCart();

  return (
    <BrowserRouter>
      <CartDrawer isOpen={isCartOpen} onClose={() => closeCart()} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar onCartClick={() => openCart()} />
              <Home />
              <Footer />
            </>
          }
        />

          <Route
            path="/productos"
            element={
              <>
                <Navbar onCartClick={() => openCart()} />
                <ProductosPage />
                <Footer />
              </>
            }
          />

          {/* Ruta blog agregada */}
          <Route
            path="/blog"
            element={
              <>
                <Navbar onCartClick={() => openCart()} />
                <Blog />
                <Footer />
              </>
            }
          />

          {/* Ruta About agregada */}
          <Route
            path="/sobre-nosotros"
            element={
              <>
                <Navbar onCartClick={() => openCart()} />
                <AboutPage />
                <Footer />
              </>
            }
          />
          {/* Ruta contacto agregada */}
          <Route
            path="/contacto"
            element={
              <>
                <Navbar onCartClick={() => openCart()} />
                <Contacto />
                <Footer />
              </>
            }
          />
          <Route
            path="/categorias"
            element={
              <>
                <Navbar onCartClick={() => openCart()} />
                <CategoryPage />
                <Footer />
              </>
            }
          />
          {/* Producto detalle */}
          <Route
            path="/producto/:id"
            element={
              <>
                <ProductDetail />
              </>
            }
          />

          {/* Checkout - Pasarela de pago */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />

          {/* ✅ Ruta protegida por rol: solo admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<CategoryManagement />} />
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
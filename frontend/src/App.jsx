// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/Productos";
import ProductosPage from "./pages/ProductosPage";
import Footer from "./components/Footer";
import AuthForm from "./components/auth/AuthForm"; // Asegúrate de tenerlo importado
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Página principal */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Productos />
            </>
          }
        />
        {/* Página de Productos independiente */}
        <Route path="/productos" element={<ProductosPage />} />
        {/* Ruta de autenticación */}
        <Route path="/login" element={<AuthForm />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/Productos";
import ProductosPage from "./pages/ProductosPage";
import Footer from "./components/Footer";
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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

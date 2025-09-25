import { useState } from "react";
import ProductCard from "../components/Productcard";
import "../index.css"; // asegúrate de importar tu CSS

export default function ProductosPage() {
  const productos = [
    {
      id: 1,
      nombre: "Camiseta de Algodón Orgánico Premium",
      categoria: "Camisetas",
      precio: 45,
      precioAntes: 60,
      imagen: "https://images.unsplash.com/photo-1643286131725-5e0ad3b3ca02",
      reviews: 124,
    },
    {
      id: 2,
      nombre: "Pantalón de Cáñamo Ecológico",
      categoria: "Pantalones",
      precio: 86,
      precioAntes: null,
      imagen: "https://images.unsplash.com/photo-1543121032-68865adeff3f",
      reviews: 98,
    },
  ];

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategories.length === 0 || selectedCategories.includes(p.categoria))
  );

  return (
    <main className="productos-page">
      {/* Sidebar filtros */}
      <aside className="filtros-sidebar">
        <h3>Filtros</h3>

        <div className="filtro-busqueda">
          <label htmlFor="search">Buscar</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <fieldset className="filtro-categorias">
          <legend>Categorías</legend>
          {["Camisetas", "Vestidos", "Pantalones", "Camisas"].map((cat) => (
            <label key={cat} htmlFor={cat}>
              <input
                type="checkbox"
                id={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </fieldset>

        <button
          className="btn-limpiar"
          onClick={() => {
            setSearch("");
            setSelectedCategories([]);
          }}
        >
          Limpiar filtros
        </button>
      </aside>

      {/* Listado productos */}
      <section className="productos-listado">
        <header>
          <h2>Nuestra Colección Orgánica</h2>
          <p>Descubre nuestra gama de ropa sostenible fabricada con materiales 100% orgánicos.</p>
        </header>

        <div className="grid-productos">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => <ProductCard key={p.id} producto={p} />)
          ) : (
            <p className="sin-productos">No se encontraron productos.</p>
          )}
        </div>
      </section>
    </main>
  );
}

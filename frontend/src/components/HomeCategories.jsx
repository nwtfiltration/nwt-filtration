import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categories from "../data/categories.json";

const ITEMS_PER_PAGE = 10;

export default function HomeCategories() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // 🔁 Reset page on search
  useEffect(() => {
    setPage(1);
  }, [search]);

  // 🔍 Search filter
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Pagination
  const totalPages = Math.ceil(
    filteredCategories.length / ITEMS_PER_PAGE
  );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <section className="px-6 py-14">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold">
          Product Categories
        </h2>
      </div>

      
      {/* CATEGORY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {paginatedCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/products/${cat.slug}`)}
            className="cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center group-hover:scale-105 transition">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-3 font-medium text-sm group-hover:text-green-700">
              {cat.name}
            </p>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          {Array.from({ length: totalPages }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1
                    ? "bg-green-700 text-white"
                    : ""
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}

      {/* VIEW ALL */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          View All Products
        </button>
      </div>
    </section>
  );
}

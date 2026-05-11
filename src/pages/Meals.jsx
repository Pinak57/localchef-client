import { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../components/MealCard";
import { FiSearch, FiMapPin, FiX, FiSliders } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Meals = () => {
  const [meals, setMeals]            = useState([]);
  const [totalMeals, setTotal]       = useState(0);
  const [allLocations, setLocations] = useState([]); // auto from DB
  const [page, setPage]              = useState(1);
  const [search, setSearch]          = useState("");
  const [searchInput, setInput]      = useState("");
  const [sort, setSort]              = useState("");
  const [location, setLocation]      = useState("");
  const [loading, setLoading]        = useState(false);
  const limit = 12; // ✅ 12 meals per page

  // ✅ Fetch unique delivery areas automatically from DB
  useEffect(() => {
    document.title = "Meals | LocalChefBazaar";
    axios.get(`${API}/meals?limit=1000`).then((res) => {
      const areas = res.data.meals || [];
      const unique = [
        ...new Set(areas.map((m) => m.deliveryArea).filter(Boolean)),
      ].sort();
      setLocations(unique);
    });
  }, []);

  // Fetch meals on filter change
  useEffect(() => {
    const params = {
      page,
      limit,
      search,
      sort,
      ...(location && { deliveryArea: location }),
    };

    axios
      .get(`${API}/meals`, { params })
      .then((res) => {
        setMeals(res.data.meals || []);
        setTotal(res.data.totalMeals || 0);
      })
      .finally(() => setLoading(false));

    setLoading(true);
  }, [page, search, sort, location]);

  const totalPages = Math.ceil(totalMeals / limit);
  const hasFilters = search || sort || location;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleLocation = (loc) => {
    setLocation(loc === location ? "" : loc);
    setPage(1);
  };

  const handleSort = (val) => {
    setSort(val);
    setPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setInput("");
    setSort("");
    setLocation("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
            🍽️ Our Menu
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">
            All Meals
          </h1>
          <p className="text-green-100 text-base mb-8 max-w-lg mx-auto">
            {totalMeals > 0
              ? `${totalMeals} fresh homemade meals available from local chefs`
              : "Browse fresh homemade meals from local chefs near you"}
          </p>

          {/* Search bar inside hero */}
          <form
            onSubmit={handleSearch}
            className="flex max-w-2xl mx-auto gap-2"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for meals e.g. Biryani, Fish curry..."
                value={searchInput}
                onChange={(e) => setInput(e.target.value)}
                className="input w-full pl-11 rounded-xl border-none shadow-lg h-12"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setInput(""); setSearch(""); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn bg-yellow-400 hover:bg-yellow-300 text-dark border-none rounded-xl px-8 font-bold h-12 min-h-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ══════════════════════════════════════
          TOP FILTER BAR
      ══════════════════════════════════════ */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">

            {/* Sort buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-gray-500 text-sm mr-1">
                <FiSliders size={14} /> <span className="font-medium">Sort:</span>
              </div>
              {[
                { label: "Default",      value: ""     },
                { label: "Price ↑",      value: "asc"  },
                { label: "Price ↓",      value: "desc" },
                { label: "Latest",       value: "latest"},
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSort(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sort === opt.value
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-6 bg-gray-200 mx-1"></div>

            {/* Location filter */}
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <div className="flex items-center gap-1 text-gray-500 text-sm mr-1">
                <FiMapPin size={14} /> <span className="font-medium">Area:</span>
              </div>

              {/* All button */}
              <button
                onClick={() => handleLocation("")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !location
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-primary"
                }`}
              >
                All Areas
              </button>

              {/* Dynamic location buttons from DB */}
              {allLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    location === loc
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-primary"
                  }`}
                >
                  {loc}
                  {location === loc && <FiX size={10} />}
                </button>
              ))}
            </div>

            {/* Clear all */}
            {hasFilters && (
              <button
                onClick={handleClear}
                className="btn btn-outline btn-error btn-xs rounded-lg gap-1 flex-shrink-0"
              >
                <FiX size={11} /> Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Active filters + results count */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-500 text-sm">
              Showing{" "}
              <span className="font-bold text-dark">{meals.length}</span> of{" "}
              <span className="font-bold text-dark">{totalMeals}</span> meals
            </p>

            {/* Active filter tags */}
            {location && (
              <span
                onClick={() => { setLocation(""); setPage(1); }}
                className="badge badge-success text-white text-xs gap-1 cursor-pointer hover:opacity-80"
              >
                <FiMapPin size={9} /> {location} <FiX size={9} />
              </span>
            )}
            {search && (
              <span
                onClick={() => { setSearch(""); setInput(""); setPage(1); }}
                className="badge badge-primary text-white text-xs gap-1 cursor-pointer hover:opacity-80"
              >
                🔍 "{search}" <FiX size={9} />
              </span>
            )}
            {sort && (
              <span
                onClick={() => { setSort(""); setPage(1); }}
                className="badge badge-warning text-dark text-xs gap-1 cursor-pointer hover:opacity-80"
              >
                💰 {sort === "asc" ? "Low→High" : sort === "desc" ? "High→Low" : "Latest"} <FiX size={9} />
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs">
            Page {page} of {totalPages || 1}
          </p>
        </div>

        {/* ── Meals Grid ─────────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="loader"></div>
            <p className="text-gray-400 text-sm animate-pulse">Loading meals...</p>
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl shadow-sm">
            <div className="text-7xl mb-4">🍽️</div>
            <h3 className="font-display text-2xl font-bold text-dark mb-2">No meals found</h3>
            <p className="text-gray-400 text-sm mb-6">
              Try different filters or search terms
            </p>
            <button
              onClick={handleClear}
              className="btn btn-primary text-white rounded-xl gap-2"
            >
              <FiX size={14} /> Clear All Filters
            </button>
          </div>
        ) : (
          /* ✅ 12 meals per page in 4-column grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        )}

        {/* ── Pagination ─────────────────────── */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2 flex-wrap">
            <button
              className="btn btn-sm btn-outline btn-primary rounded-xl"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              « Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`btn btn-sm rounded-xl ${
                  page === i + 1
                    ? "btn-primary text-white"
                    : "btn-outline btn-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-outline btn-primary rounded-xl"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next »
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meals;

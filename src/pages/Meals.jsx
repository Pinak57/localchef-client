import { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../components/MealCard";
import {
  FiSearch, FiMapPin, FiFilter,
  FiX, FiChevronDown, FiGrid, FiList
} from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Meals = () => {
  const [meals, setMeals]             = useState([]);
  const [totalMeals, setTotal]        = useState(0);
  const [allLocations, setLocations]  = useState([]);
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort]               = useState("");
  const [location, setLocation]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const limit = 12; // ✅ 12 per page

  // Fetch unique delivery areas
  useEffect(() => {
    document.title = "Meals | LocalChefBazaar";
    axios.get(`${API}/meals?limit=1000`).then((res) => {
      const areas = res.data.meals || [];
      const unique = [...new Set(areas.map((m) => m.deliveryArea).filter(Boolean))].sort();
      setLocations(unique);
    });
  }, []);

  // Fetch meals
  useEffect(() => {
    setLoading(true);
    const params = { page, limit, search, sort };
    if (location) params.deliveryArea = location;
    axios
      .get(`${API}/meals`, { params })
      .then((res) => {
        setMeals(res.data.meals || []);
        setTotal(res.data.totalMeals || 0);
      })
      .finally(() => setLoading(false));
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
    setMobileOpen(false);
  };

  const handleSort = (val) => {
    setSort(val === sort ? "" : val);
    setPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setSearchInput("");
    setSort("");
    setLocation("");
    setPage(1);
  };

  // ✅ Sidebar JSX as variable (NOT component) — fixes typing bug
  const sidebarJSX = (
    <div className="space-y-6">

      {/* Sort */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Sort by Price</p>
        <div className="space-y-1">
          {[
            { label: "🔀 Default",      value: ""       },
            { label: "💰 Low → High",   value: "asc"    },
            { label: "💎 High → Low",   value: "desc"   },
            { label: "🆕 Latest First", value: "latest" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                sort === opt.value
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "text-gray-600 hover:bg-green-50 hover:text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Location */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
          <FiMapPin size={12} /> Delivery Area
        </p>
        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
          <button
            onClick={() => handleLocation("")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              !location
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "text-gray-600 hover:bg-green-50 hover:text-primary"
            }`}
          >
            📍 All Areas
          </button>
          {allLocations.length === 0 ? (
            <p className="text-gray-400 text-xs px-4 py-2 animate-pulse">Loading areas...</p>
          ) : (
            allLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocation(loc)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                  location === loc
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-gray-600 hover:bg-green-50 hover:text-primary"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FiMapPin size={11} /> {loc}
                </span>
                {location === loc && <FiX size={11} />}
              </button>
            ))
          )}
        </div>
      </div>

      {hasFilters && (
        <>
          <div className="border-t border-gray-100" />
          <button
            onClick={handleClear}
            className="btn btn-outline btn-error btn-sm w-full rounded-xl gap-2"
          >
            <FiX size={13} /> Clear All Filters
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            🍽️ Our Menu
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">
            All Meals
          </h1>
          <p className="text-green-100 text-base mb-8">
            {totalMeals > 0
              ? `${totalMeals} fresh homemade meals from local chefs`
              : "Browse homemade meals from talented local chefs near you"}
          </p>

          {/* ✅ Search bar on top */}
          <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto gap-2">
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search meals e.g. Biryani, Fish curry..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input w-full pl-12 rounded-xl border-none shadow-lg h-12 text-sm"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn bg-yellow-400 hover:bg-yellow-300 text-dark border-none rounded-xl px-8 font-bold h-12 min-h-0 text-sm"
            >
              Search
            </button>
          </form>

          {/* Quick search tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {["Biryani", "Fish", "Chicken", "Beef", "Vegetarian"].map((tag) => (
              <button
                key={tag}
                onClick={() => { setSearchInput(tag); setSearch(tag); setPage(1); }}
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn btn-outline btn-primary btn-sm w-full rounded-xl gap-2"
          >
            <FiFilter size={14} />
            {mobileOpen ? "Hide Filters" : "Show Filters"}
            <FiChevronDown
              size={14}
              className={`transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileOpen && (
            <div className="mt-3 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              {sidebarJSX}
            </div>
          )}
        </div>

        <div className="flex gap-8">

          {/* ══ LEFT SIDEBAR ══ */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-dark text-base flex items-center gap-2">
                  <FiFilter size={15} className="text-primary" /> Filters
                </h2>
                {hasFilters && (
                  <button
                    onClick={handleClear}
                    className="text-xs text-red-400 hover:text-red-500 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <FiX size={11} /> Clear
                  </button>
                )}
              </div>
              {sidebarJSX}
            </div>
          </aside>

          {/* ══ MAIN CONTENT ══ */}
          <div className="flex-1 min-w-0">

            {/* Results bar + active filter badges */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-gray-500 text-sm">
                  <span className="font-bold text-dark">{totalMeals}</span> meals found
                </p>
                {location && (
                  <span
                    onClick={() => { setLocation(""); setPage(1); }}
                    className="badge badge-success text-white text-xs gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <FiMapPin size={9} /> {location} <FiX size={9} />
                  </span>
                )}
                {search && (
                  <span
                    onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
                    className="badge badge-primary text-white text-xs gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    🔍 "{search}" <FiX size={9} />
                  </span>
                )}
                {sort && (
                  <span
                    onClick={() => { setSort(""); setPage(1); }}
                    className="badge badge-warning text-dark text-xs gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {sort === "asc" ? "💰 Low→High" : sort === "desc" ? "💎 High→Low" : "🆕 Latest"}
                    <FiX size={9} />
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs font-medium">
                Page {page} of {totalPages || 1}
              </p>
            </div>

            {/* ── Meals Grid ─────────────────── */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-36 gap-5">
                <div className="loader"></div>
                <p className="text-gray-400 text-sm animate-pulse">Loading delicious meals...</p>
              </div>
            ) : meals.length === 0 ? (
              <div className="text-center py-36 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-7xl mb-5">🍽️</div>
                <h3 className="font-display text-2xl font-bold text-dark mb-2">No meals found</h3>
                <p className="text-gray-400 text-sm mb-6">Try different filters or search terms</p>
                <button
                  onClick={handleClear}
                  className="btn btn-primary text-white rounded-xl gap-2 px-8"
                >
                  <FiX size={14} /> Clear All Filters
                </button>
              </div>
            ) : (
              /* ✅ 12 meals per page, 3-column grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {meals.map((meal) => (
                  <MealCard key={meal._id} meal={meal} />
                ))}
              </div>
            )}

            {/* ── Pagination ─────────────────── */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2 flex-wrap">
                <button
                  className="btn btn-sm btn-outline btn-primary rounded-xl px-5"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  « Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  // Show limited page buttons
                  if (
                    i === 0 ||
                    i === totalPages - 1 ||
                    (i >= page - 2 && i <= page + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`btn btn-sm rounded-xl w-9 ${
                          page === i + 1
                            ? "btn-primary text-white"
                            : "btn-outline btn-primary"
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  if (i === page - 3 || i === page + 2) {
                    return <span key={i} className="self-center text-gray-400 text-sm">...</span>;
                  }
                  return null;
                })}

                <button
                  className="btn btn-sm btn-outline btn-primary rounded-xl px-5"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next »
                </button>
              </div>
            )}

            {/* Meals per page info */}
            {totalMeals > 0 && (
              <p className="text-center text-gray-400 text-xs mt-4">
                Showing {Math.min((page - 1) * limit + 1, totalMeals)}–{Math.min(page * limit, totalMeals)} of {totalMeals} meals
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meals;

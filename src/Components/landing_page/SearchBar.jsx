import { Search } from "lucide-react";
import "./SearchBar.css";

export default function SearchBar({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <section className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search what you have in the fridge..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="search-button"
        >
          <Search size={16} /> Search
        </button>
      </div>
    </section>
  );
}
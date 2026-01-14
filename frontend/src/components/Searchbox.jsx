import React from "react";
import { Search } from "lucide-react";

const Searchbox = ({ search, setSearch, handleSearch }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm">
        <Search size={20} className="text-gray-500" />

        <input
          type="text"
          value={search}
          placeholder="Search gigs..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-500"
        />

        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Searchbox;


import React, { useState} from "react";

const API = "https://pokeapi.co/api/v2/pokemon?limit=151";

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInput = (e) => {
    e.preventDefault();
    const value = e.target.value.toLowerCase();
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="navbar">
      <h1 className="pokedex-title">POKEDEX</h1>
      <input
        type="text"
        value={query}
        onChange={handleInput}
        placeholder="Find Pokémon..."
      />
    </div>
  );
};

export default Navbar;

/** @format */
import React, { useEffect, useState } from "react";
import PokeBallLoader from "./component/PokeBallLoader.jsx";
import Navbar from "./component/Navbar.jsx";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = "https://pokeapi.co/api/v2/pokemon?limit=151";

  // Fetch Pokémon data (detailed)
  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const pokemonDetailedData = data.results.map(async (currentPokemon) => {
        const res = await fetch(currentPokemon.url);
        const data = await res.json();
        return data;
      });

      const detailedResponse = await Promise.all(pokemonDetailedData);
      setPokemons(detailedResponse);
      setFilteredPokemon(detailedResponse);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  if (loading) {
    return <PokeBallLoader />;
  }

  const handleSearch = (query) => {
    if (!query) {
      setFilteredPokemon(pokemons);
      return;
    }
    const filtered = pokemons.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPokemon(filtered);
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />

      <ul className="pokemon-list">
        {filteredPokemon.map((pokemon) => (
          <li key={pokemon.id} className="pokemon-card">
            <Link to={`/detail/${pokemon.id}`}>
              <div className="image-container">
                <img
                  className="pokemon-image"
                  src={pokemon.sprites.other.dream_world.front_default}
                  width="100px"
                  height="100px"
                  alt={`${pokemon.name} image`}
                />
              </div>

              <h2 className="pokemon-number">
                #{pokemon.id.toString().padStart(4, "0")}
              </h2>

              <h2 className="pokemon-name">{pokemon.name}</h2>

              <div className="pokemon-types">
                {pokemon.types.map((type) => (
                  <p
                    key={type.type.name}
                    className={`pokemon-type type-${type.type.name}`}
                  >
                    Type: {type.type.name}
                  </p>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;

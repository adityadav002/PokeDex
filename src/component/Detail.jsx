import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PokeBallLoader from "../component/PokeBallLoader.jsx";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [evolutions, setEvolutions] = useState({ prev: null, next: null });
  const [loading, setLoading] = useState(true);

  const convertHeight = (decimeters) => {
    const inches = decimeters * 3.937;
    const feet = Math.floor(inches / 12);
    const inch = Math.round(inches % 12);
    return `${feet}' ${inch}"`;
  };

  const convertWeight = (hectograms) => {
    const lbs = hectograms * 0.2205;
    return `${lbs.toFixed(1)} lbs`;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data1 = await res1.json();
        const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const data2 = await res2.json();

        setPokemon(data1);
        setSpecies(data2);

        const typeNames = data1.types.map((t) => t.type.name);
        const typeData = await Promise.all(
          typeNames.map((typeName) =>
            fetch(`https://pokeapi.co/api/v2/type/${typeName}`).then((res) => res.json())
          )
        );

        const doubleDamage = new Set();
        typeData.forEach((type) => {
          type.damage_relations.double_damage_from.forEach((weak) =>
            doubleDamage.add(weak.name)
          );
        });
        setWeaknesses([...doubleDamage]);

        const evoRes = await fetch(data2.evolution_chain.url);
        const evoData = await evoRes.json();

        const evolutionChain = [];
        let current = evoData.chain;
        do {
          evolutionChain.push(current.species.name);
          current = current.evolves_to[0];
        } while (current && current.hasOwnProperty("species"));

        const currentIndex = evolutionChain.findIndex((name) => name === data1.name);
        const prevName = evolutionChain[currentIndex - 1] || null;
        const nextName = evolutionChain[currentIndex + 1] || null;

        let prev = null, next = null;
        if (prevName) {
          const resPrev = await fetch(`https://pokeapi.co/api/v2/pokemon/${prevName}`);
          prev = await resPrev.json();
        }
        if (nextName) {
          const resNext = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextName}`);
          next = await resNext.json();
        }

        setEvolutions({ prev, next });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchDetails();
  }, [id]);

  const handleBack = () => navigate("/");

  if (loading || !pokemon || !species) {
    return <PokeBallLoader />;
  }

  const flavor = species.flavor_text_entries.find((entry) => entry.language.name === "en");
  const category = species.genera.find((g) => g.language.name === "en");
  const genderRate = species.gender_rate;
  const genderInfo = genderRate === -1 ? "Genderless" : "Male / Female";

  return (
   <div className="detail-container">
  <h2 className="detail-title">
    #{pokemon.id.toString().padStart(4, "0")} - {pokemon.name}
  </h2>

  {/* Pokemon Image */}
  <div className="detail-image">
    <img
      src={pokemon.sprites.other.dream_world.front_default}
      alt={pokemon.name}
    />
  </div>

  {/* Flavor Text */}
  {flavor && (
    <p className="detail-flavor">
      {flavor.flavor_text.replace(/\f/g, " ")}
    </p>
  )}

  {/* Info Card */}
  <div className="detail-info-card">
    <p><strong>Category:</strong> {category?.genus?.replace(" Pokémon", "")}</p>
    <p><strong>Gender:</strong> {genderInfo}</p>
    <p><strong>Height:</strong> {convertHeight(pokemon.height)}</p>
    <p><strong>Weight:</strong> {convertWeight(pokemon.weight)}</p>
    <p><strong>Abilities:</strong></p>
    <div className="detail-abilities">
      {pokemon.abilities.map((ability) => (
        <span key={ability.ability.name} className="ability-tag">
          {ability.ability.name}
        </span>
      ))}
    </div>
  </div>

  {/* Types */}
  <div className="detail-types">
    <p><strong>Type:</strong></p>
    {pokemon.types.map((type) => (
      <span key={type.type.name} className={`type-badge type-${type.type.name}`}>
        {type.type.name}
      </span>
    ))}
  </div>

  {/* Weaknesses */}
  <div className="detail-weaknesses">
    <p><strong>Weaknesses:</strong></p>
    {weaknesses.map((type) => (
      <span key={type} className={`type-badge type-${type}`}>
        {type}
      </span>
    ))}
  </div>

  {/* Stats */}
  <div className="detail-stats">
    <h3>Stats</h3>
    {pokemon.stats.map((stat) => (
      <div key={stat.stat.name} className="stat-row">
        <span className="stat-name">{stat.stat.name.toUpperCase()}</span>
        <div className="stat-bar">
          <div className="stat-fill" style={{ width: `${stat.base_stat / 2}%` }}></div>
        </div>
        <span className="stat-value">{stat.base_stat}</span>
      </div>
    ))}
  </div>

  {/* Evolutions */}
  {(evolutions.prev || evolutions.next) && (
    <div className="detail-evolutions">
      <h3>Evolutions</h3>
      <div className="evolution-chain">
        {evolutions.prev && (
          <Link to={`/detail/${evolutions.prev.id}`} className="evo-card">
            <img src={evolutions.prev.sprites.other.dream_world.front_default} alt={evolutions.prev.name} />
            <p>{evolutions.prev.name}</p>
          </Link>
        )}
        <div className="evo-card current">
          <img src={pokemon.sprites.other.dream_world.front_default} alt={pokemon.name} />
          <p>{pokemon.name}</p>
        </div>
        {evolutions.next && (
          <Link to={`/detail/${evolutions.next.id}`} className="evo-card">
            <img src={evolutions.next.sprites.other.dream_world.front_default} alt={evolutions.next.name} />
            <p>{evolutions.next.name}</p>
          </Link>
        )}
      </div>
    </div>
  )}

  {/* Back Button */}
  <div className="detail-back">
    <button className="back-btn" onClick={handleBack}>Back</button>
  </div>
</div>

  );
}

export default Detail;
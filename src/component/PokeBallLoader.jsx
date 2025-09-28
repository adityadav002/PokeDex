
const PokeBallLoader = () => {
  return (
    <div className="loader-container">
      <div className="circle">
        <div className="inner-circle"></div>
      </div>
      <div className="line"></div>
      <div className="top-half"></div>
      <div className="bottom-half">
      </div>
      <div className="pokeball"></div>
      <p>Loading your Pokémon...</p>
    </div>
  );
};

export default PokeBallLoader;

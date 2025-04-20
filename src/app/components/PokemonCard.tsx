import { Pokemon } from '../types';
import '../styles/components/PokemonCard.scss';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  
  return (
    <div className="pokemon-card">
      <div className="pokemon-card__header">
        <span className="pokemon-card__header-name">{pokemon.name}</span>
        <span className="pokemon-card__header-id">{formattedId}</span>
      </div>
      <div className="pokemon-card__image-container">
        <img 
          src={pokemon.sprites?.front_default || `/images/pokemon-placeholder.png`} 
          alt={pokemon.name} 
        />
      </div>
      <div className="pokemon-card__content ">
        <div className="pokemon-card__types justify-content-between">
          {pokemon.types?.map((type, index) => (
            <span key={index} className={`pokemon-card__types-type type--${type.type.name}`}>
              {type.type.name}
            </span>
          ))}
        </div>
        
        {pokemon.stats && (
          <div className="pokemon-card__stats">
            {pokemon.stats.slice(0, 3).map((stat, index) => (
              <div key={index} className="pokemon-card__stats-row">
                <span className="pokemon-card__stats-label">
                  {stat.stat.name.replace('-', ' ')}:
                </span>
                <span className="pokemon-card__stats-value">{stat.base_stat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
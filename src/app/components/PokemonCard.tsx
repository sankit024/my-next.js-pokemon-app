import { Card } from 'react-bootstrap';
import { Pokemon } from '../types';
import '../styles/components/PokemonCard.scss';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <Card className="pokemon-card">
      <Card.Img 
        variant="top" 
        src={pokemon.sprites?.front_default || `/images/pokemon-placeholder.png`} 
        alt={pokemon.name} 
      />
      <Card.Body>
        <Card.Title>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Card.Title>
        <div className="pokemon-types">
          {pokemon.types?.map((type, index) => (
            <span key={index} className={`type-badge type-${type.type.name}`}>
              {type.type.name}
            </span>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default PokemonCard;
import { ListGroup } from 'react-bootstrap';
import { Pokemon } from '../types';
import '../styles/components/PokemonList.scss';

interface PokemonListProps {
  pokemon: Pokemon[];
  loading: boolean;
}

const PokemonList = ({ pokemon, loading }: PokemonListProps) => {
  if (loading) {
    return <div className="loading-spinner">Loading Pokemon...</div>;
  }
  
  if (pokemon.length === 0) {
    return <div className="no-results">No Pokemon found</div>;
  }
  
  return (
    <ListGroup className="pokemon-list">
      {pokemon.map((p) => (
        <ListGroup.Item key={p.id} className="pokemon-list-item">
          <div className="pokemon-image">
            <img 
              src={p.sprites?.front_default || `/images/pokemon-placeholder.png`} 
              alt={p.name} 
            />
          </div>
          <div className="pokemon-info">
            <h5>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h5>
            <div className="pokemon-types">
              {p.types?.map((type, index) => (
                <span key={index} className={`type-badge type-${type.type.name}`}>
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PokemonList;
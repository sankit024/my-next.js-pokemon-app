import { Row, Col } from 'react-bootstrap';
import PokemonCard from './PokemonCard';
import { Pokemon } from '../types';
import '../styles/components/PokemonGrid.scss';

interface PokemonGridProps {
  pokemon: Pokemon[];
  loading: boolean;
}

const PokemonGrid = ({ pokemon, loading }: PokemonGridProps) => {
  if (loading) {
    return <div className="loading-spinner">Loading Pokemon...</div>;
  }
  
  if (pokemon.length === 0) {
    return <div className="no-results">No Pokemon found</div>;
  }
  
  return (
    <Row className="pokemon-grid">
      {pokemon.map((p) => (
        <Col key={p.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
          <PokemonCard pokemon={p} />
        </Col>
      ))}
    </Row>
  );
};

export default PokemonGrid;
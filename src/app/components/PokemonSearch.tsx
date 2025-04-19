import { FormEvent, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { searchPokemonByName, setSearchQuery } from '../redux/pokemonSlice';
import { AppDispatch } from '../redux/store';
import '../styles/components/PokemonSearch.scss';

const PokemonSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setSearchQuery(searchTerm));
      dispatch(searchPokemonByName(searchTerm));
    }
  };
  
  return (
    <Form className="pokemon-search" onSubmit={handleSearch}>
      <Form.Group className="d-flex">
        <Form.Control
          type="text"
          placeholder="Search Pokemon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" type="submit" className="ms-2">
          Search
        </Button>
      </Form.Group>
    </Form>
  );
};

export default PokemonSearch;
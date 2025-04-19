import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import { fetchTypes, setActiveType } from '../redux/typeSlice';
import { fetchAllPokemon, fetchPokemonOfType } from '../redux/pokemonSlice';
import { AppDispatch, RootState } from '../redux/store';
import '../styles/components/NavBar.scss';

const NavBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { types, activeType, loading } = useSelector((state: RootState) => state.types);
  
  useEffect(() => {
    dispatch(fetchTypes());
  }, [dispatch]);
  
  const handleTypeClick = (type: string) => {
    dispatch(setActiveType(type));
    
    if (type === 'all') {
      dispatch(fetchAllPokemon({ limit: 20, offset: 0 }));
    } else {
      dispatch(fetchPokemonOfType(type));
    }
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading types...</div>;
  }
  
  return (
    <div className="pokemon-navbar">
      <h4>Pokemon Types</h4>
      <Nav className="flex-column">
        <Nav.Link 
          className={activeType === 'all' ? 'active' : ''}
          onClick={() => handleTypeClick('all')}
        >
          All
        </Nav.Link>
        
        {types.map((type) => (
          <Nav.Link
            key={type.name}
            className={activeType === type.name ? 'active' : ''}
            onClick={() => handleTypeClick(type.name)}
          >
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default NavBar;
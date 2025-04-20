import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import { fetchTypes, setActiveType } from '../redux/typeSlice';
import { fetchAllPokemon, fetchPokemonOfType } from '../redux/pokemonSlice';
import { AppDispatch, RootState } from '../redux/store';
import { notifyInfo } from '../utils/notificationServies';
import LoadingSpinner from './LoaddingSpinner';
import '../styles/components/NavBar.scss';

const NavBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { types, activeType, loading } = useSelector((state: RootState) => state.types);
  const { loading: pokemonLoading } = useSelector((state: RootState) => state.pokemon);

  useEffect(() => {
    dispatch(fetchTypes());
  }, [dispatch]);
  
  const handleTypeClick = (type: string) => {
    if (pokemonLoading || activeType === type) {
      return; 
    }
    dispatch(setActiveType(type));
    
    if (type === 'all') {
      notifyInfo('Loading all Pokemon');
      dispatch(fetchAllPokemon({ limit: 20, offset: 0 }));
    } else {
      notifyInfo(`Loading ${type} type Pokemon`);
      dispatch(fetchPokemonOfType(type));
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading types..." />;
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





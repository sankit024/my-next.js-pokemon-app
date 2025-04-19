'use client';

import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch, RootState } from './redux/store';
import { fetchAllPokemon } from './redux/pokemonSlice';
import NavBar from'./components/NavBar';
import PokemonGrid from './components/PokemonGrid';
import PokemonList from './components/PokemonList';
import PokemonSearch from './components/PokemonSearch';
import ViewToggle from './components/ToggleView';
import Pagination from './components/Pagination';
import './styles/globals.scss';

// Wrapper component to use Redux hooks
const PokemonApp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredPokemon, loading, viewMode } = useSelector((state: RootState) => state.pokemon);
  
  useEffect(() => {
    dispatch(fetchAllPokemon({ limit: 20, offset: 0 }));
  }, [dispatch]);
  
  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="sidebar">
          <NavBar />
        </Col>
        <Col md={9} lg={10} className="main-content">
          <div className="content-header">
            <h1>Pokemon Explorer</h1>
            <div className="controls">
              <PokemonSearch />
              <ViewToggle />
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <PokemonGrid pokemon={filteredPokemon} loading={loading} />
          ) : (
            <PokemonList pokemon={filteredPokemon} loading={loading} />
          )}
          
          <Pagination />
        </Col>
      </Row>
    </Container>
  );
};

// Main component that provides Redux store
export default function Home() {
  return (
    <Provider store={store}>
      <PokemonApp />
    </Provider>
  );
}
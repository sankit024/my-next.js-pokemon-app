"use client";

import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store, AppDispatch, RootState } from "./redux/store";
import { fetchAllPokemon } from "./redux/pokemonSlice";
import NavBar from "./components/NavBar";
import PokemonGrid from "./components/PokemonGrid";
import PokemonList from "./components/PokemonList";
import PokemonSearch from "./components/PokemonSearch";
import ViewToggle from "./components/ToggleView";
import Pagination from "./components/Pagination";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.scss";

const PokemonApp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredPokemon, loading, viewMode } = useSelector(
    (state: RootState) => state.pokemon
  );

  useEffect(() => {
    dispatch(fetchAllPokemon({ limit: 20, offset: 0 }));
  }, [dispatch]);

  return (
    <Container fluid className="full-height-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Row className="full-height-row">
        <Col md={3} lg={2} className="sidebar">
          <NavBar />
        </Col>

        <Col md={9} lg={10} className="main-content">
          <div className="main-scroll-area">
            <div className="content-header">
              <div className="controls">
                <div className="view-toggle">
                  <ViewToggle />
                </div>
                <div className="search-bar">
                  <PokemonSearch />
                </div>
              </div>
            </div>

            <div className="pokemon-view">
              {viewMode === "grid" ? (
                <PokemonGrid pokemon={filteredPokemon} loading={loading} />
              ) : (
                <PokemonList pokemon={filteredPokemon} loading={loading} />
              )}
            </div>

            <div className="pagination-area">
              <Pagination />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default function Home() {
  return (
    <Provider store={store}>
      <PokemonApp />
    </Provider>
  );
}


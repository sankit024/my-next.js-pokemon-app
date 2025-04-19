import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Pokemon, PokemonListResponse } from '../types';
import { fetchPokemonList, fetchPokemonByType, searchPokemon } from '../utils/api';

interface PokemonState {
  allPokemon: Pokemon[];
  filteredPokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  viewMode: 'grid' | 'list';
  searchQuery: string;
}

const initialState: PokemonState = {
  allPokemon: [],
  filteredPokemon: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  viewMode: 'grid',
  searchQuery: ''
};

export const fetchAllPokemon = createAsyncThunk(
  'pokemon/fetchAll',
  async (params: { limit: number; offset: number }) => {
    const response = await fetchPokemonList(params.limit, params.offset);
    return response;
  }
);

export const fetchPokemonOfType = createAsyncThunk(
  'pokemon/fetchByType',
  async (type: string) => {
    const pokemon = await fetchPokemonByType(type);
    return pokemon;
  }
);

export const searchPokemonByName = createAsyncThunk(
  'pokemon/search',
  async (query: string) => {
    const pokemon = await searchPokemon(query);
    return pokemon;
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPokemon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPokemon.fulfilled, (state, action: PayloadAction<PokemonListResponse>) => {
        state.loading = false;
        state.allPokemon = action.payload.results;
        state.filteredPokemon = action.payload.results;
        state.totalPages = Math.ceil(action.payload.count / 20);
      })
      .addCase(fetchAllPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Pokemon';
      })
      .addCase(fetchPokemonOfType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonOfType.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredPokemon = action.payload || [];
      })
      .addCase(fetchPokemonOfType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Pokemon by type';
      })
      .addCase(searchPokemonByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPokemonByName.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredPokemon = action.payload || [];
      })
      .addCase(searchPokemonByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search Pokemon';
      });
  }
});

export const { setViewMode, setSearchQuery, setCurrentPage } = pokemonSlice.actions;
export default pokemonSlice.reducer;
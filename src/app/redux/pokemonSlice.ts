import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPokemonList, fetchPokemonByType, searchPokemon } from '../utils/api';
import { notifyError, notifySuccess } from '../utils/notificationServies';
interface PokemonSprites {
  front_default: string;
  back_default: string;
  front_shiny?: string;
  back_shiny?: string;
  other?: {
    'official-artwork'?: {
      front_default?: string;
    };
  };
}
interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}
interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites: PokemonSprites;
  types: PokemonType[];
}
interface PokemonListResponseWithDetails {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}
interface PokemonState {
  allPokemon: Pokemon[];
  filteredPokemon: Pokemon[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  viewMode: 'grid' | 'list';
  searchQuery: string;
}

const initialState: PokemonState = {
  allPokemon: [],
  filteredPokemon: [],
  loading: false,
  currentPage: 1,
  totalPages: 0,
  viewMode: 'grid',
  searchQuery: ''
};
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const fetchAllPokemon = createAsyncThunk<
  PokemonListResponseWithDetails | undefined,
  { limit: number; offset: number }
>(
  'pokemon/fetchAll',
  async (params: { limit: number; offset: number }, { rejectWithValue }) => {
    try {
      const response = await fetchPokemonList(params.limit, params.offset);
      return response;
    } catch (error) {
      const typedError = error as Error | ApiError;
      const errorMessage = 'response' in typedError && typedError.response?.data?.message
        ? typedError.response.data.message
        : typedError.message || 'Failed to fetch Pokemon. Please try again.';
      notifyError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPokemonOfType = createAsyncThunk<
  Pokemon[] | undefined,
  string
>(
  'pokemon/fetchByType',
  async (type: string, { rejectWithValue }) => {
    try {
      const pokemon = await fetchPokemonByType(type);
      if (pokemon && pokemon.length > 0) {
        notifySuccess(`Loaded ${pokemon.length} ${type} type Pokemon`);
      }
      return pokemon;
    } catch (error) {
      const typedError = error as Error | ApiError;
      const errorMessage = 'response' in typedError && typedError.response?.data?.message
        ? typedError.response.data.message
        : typedError.message || `Failed to fetch ${type} Pokemon. Please try again.`;
      notifyError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchPokemonByName = createAsyncThunk<
  Pokemon[] | undefined,
  string
>(
  'pokemon/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const pokemon = await searchPokemon(query);
      if (pokemon && pokemon.length > 0) {
        notifySuccess(`Found ${pokemon.length} Pokemon matching "${query}"`);
      } else {
        notifyError(`No Pokemon found matching "${query}"`);
      }
      return pokemon;
    } catch (error) {
      const typedError = error as Error | ApiError;
      const errorMessage = 'response' in typedError && typedError.response?.data?.message
        ? typedError.response.data.message
        : typedError.message || `Failed to search for "${query}". Please try again.`;
      notifyError(errorMessage);
      return rejectWithValue(errorMessage);
    }
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
      })
      .addCase(fetchAllPokemon.fulfilled, (state, action: PayloadAction<PokemonListResponseWithDetails | undefined>) => {
        state.loading = false;
        if (action.payload) {
          state.allPokemon = action.payload.results;
          state.filteredPokemon = action.payload.results;
          state.totalPages = Math.ceil(action.payload.count / 20);
        }
      })
      .addCase(fetchAllPokemon.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchPokemonOfType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPokemonOfType.fulfilled, (state, action: PayloadAction<Pokemon[] | undefined>) => {
        state.loading = false;
        state.filteredPokemon = action.payload || [];
      })
      .addCase(fetchPokemonOfType.rejected, (state) => {
        state.loading = false;
      })
      .addCase(searchPokemonByName.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchPokemonByName.fulfilled, (state, action: PayloadAction<Pokemon[] | undefined>) => {
        state.loading = false;
        state.filteredPokemon = action.payload || [];
      })
      .addCase(searchPokemonByName.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { setViewMode, setSearchQuery, setCurrentPage } = pokemonSlice.actions;
export default pokemonSlice.reducer;
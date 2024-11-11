// categorySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import { RootState } from '../store/store';
import { Category } from '../store/types';
import Cookies from 'js-cookie';

// interface Category {
//   id: number;
//   name: string;
// }

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetchCategories', 
  async (_, { rejectWithValue }) => {
    try {
      const token=Cookies.get('access')
      const response = await axios.get<Category[]>('http://127.0.0.1:8000/api/categories/',{
        headers:{
          Authorization: `Bearer ${token}`
        },
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch categories';
        return rejectWithValue(errorMsg);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });
  },
});

// export const selectCategories = (state: { categories: CategoryState }) => state.categories.categories;

export const selectCategoryById = (state:RootState, categoryId: number) => {
  return state.category.categories.find(category => category.id === categoryId);
};

export const selectCategories = (state: RootState) => state.category.categories;

export default categorySlice.reducer;

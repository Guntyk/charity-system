import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from 'api';
import { getToken } from 'services/tokenService';

export const getTransactions = createAsyncThunk('transactions/getTransactions', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/transactions');

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Getting transactions data failed');
  }
});

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await api.post('/transactions', transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Creating transaction failed');
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.error = action.payload || 'Error getting transactions';
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions = [action.payload, ...state.transactions];
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.error = action.payload || 'Error creating transaction';
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export default transactionsSlice.reducer;

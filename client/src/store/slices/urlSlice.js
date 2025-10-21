import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

// Async thunks
export const createShortUrl = createAsyncThunk(
  'url/create',
  async (longUrl, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/urls/create', 
        { longUrl }
      )
      
      return {
        longUrl,
        shortUrl: response.data.shortUrl,
        message: response.data.message
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create short URL'
      )
    }
  }
)

export const fetchUserUrls = createAsyncThunk(
  'url/fetchUserUrls',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/urls/user/urls')
      
      return response.data.urls
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch URLs'
      )
    }
  }
)

const initialState = {
  urls: [],
  currentUrl: null,
  loading: false,
  fetchLoading: false,
  error: null,
  success: null
}

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = null
    },
    clearCurrentUrl: (state) => {
      state.currentUrl = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Create URL
      .addCase(createShortUrl.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.loading = false
        state.currentUrl = action.payload
        state.urls.unshift(action.payload)
        state.success = action.payload.message
        state.error = null
      })
      .addCase(createShortUrl.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = null
      })
      // Fetch user URLs
      .addCase(fetchUserUrls.pending, (state) => {
        state.fetchLoading = true
        state.error = null
      })
      .addCase(fetchUserUrls.fulfilled, (state, action) => {
        state.fetchLoading = false
        state.urls = action.payload
        state.error = null
      })
      .addCase(fetchUserUrls.rejected, (state, action) => {
        state.fetchLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearSuccess, clearCurrentUrl } = urlSlice.actions
export default urlSlice.reducer
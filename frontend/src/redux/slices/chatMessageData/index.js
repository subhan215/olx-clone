import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks
export const getAllChats = createAsyncThunk('chats/getAllChats', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/v1/chats');
    return response.data.chats;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getChatMessages = createAsyncThunk('chats/getChatMessages', async (chatId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/v1/chats/${chatId}/messages`);
    return response.data.messages;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const sendMessage = createAsyncThunk('chats/sendMessage', async ({ chatId, message }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/api/v1/chats/${chatId}/messages`, message);
    return response.data.chat;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const chatSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(...action.payload.messages);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;

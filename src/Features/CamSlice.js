import { createSlice } from "@reduxjs/toolkit";

const STATUS = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
});

const initialState = {
  current_view: "",
  uploaded_index: [],
  status: STATUS.IDLE,
  error: null,
};

const camSlice = createSlice({
  name: "cam",
  initialState,
  reducers: {
    setCurrentView(state, action) {
      state.current_view = action.payload;
    },

    setUploadedIndexs(state, action) {
      state.uploaded_index.push(action.payload);
    },

    setStatus(state, action) {
      state.status = action.payload;
    },

    setError(state, action) {
      console.log(action.payload, "this i");
      state.error = "This is an error";
    },

    clearError(state, action) {
      state.error = null;
    },
  },
});

export const { setUploadedIndexs, setCurrentView, setError, clearError } =
  camSlice.actions;

export default camSlice;

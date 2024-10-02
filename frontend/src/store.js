import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import customizeReducer from "./slices/customizeSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        customize: customizeReducer,
    },
    devTools: true,
});

export default store;
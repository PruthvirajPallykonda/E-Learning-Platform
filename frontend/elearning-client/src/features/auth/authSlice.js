import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../../api/authApi";

const savedUser = JSON.parse(localStorage.getItem("user"));

const getErrorMessage = (error, fallback) => {
    const message = error.response?.data;

    if (typeof message === "string") {
        return message;
    }

    if (message?.title) {
        return message.title;
    }

    if (message?.message) {
        return message.message;
    }

    if (error.message === "Network Error") {
        return "Cannot reach the server. Check that the backend is running and CORS is configured.";
    }

    return fallback;
};

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const response = await loginApi(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Login failed"));
    }
});

export const register = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    try {
        const response = await registerApi(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Registration failed"));
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: savedUser || null,
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

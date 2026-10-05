import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getQuizzesByCourseApi,
    getQuizByIdApi,
    getMyQuizResultApi,
    submitQuizApi
} from "../../api/quizApi";

export const fetchQuizzesByCourse = createAsyncThunk(
    "quizzes/fetchQuizzesByCourse",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await getQuizzesByCourseApi(courseId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to load quizzes."
            );
        }
    }
);

export const fetchQuizById = createAsyncThunk(
    "quizzes/fetchQuizById",
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await getQuizByIdApi(quizId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to load quiz."
            );
        }
    }
);

export const submitQuiz = createAsyncThunk(
    "quizzes/submitQuiz",
    async ({ quizId, answers }, { rejectWithValue }) => {
        try {
            const response = await submitQuizApi(quizId, { answers });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to submit quiz."
            );
        }
    }
);

export const fetchMyQuizResults = createAsyncThunk(
    "quizzes/fetchMyQuizResults",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMyQuizResultApi();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to load quiz results."
            );
        }
    }
);

const quizSlice = createSlice({
    name: "quizzes",

    initialState: {
        quizzes: [],
        selectedQuiz: null,
        latestResult: null,
        myResults: [],
        loading: false,
        error: null,
    },

    reducers: {
        clearLatestResult: (state) => {
            state.latestResult = null;
        },

        clearQuizzes: (state) => {
            state.quizzes = [];
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // Get quizzes for a course
            .addCase(fetchQuizzesByCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.quizzes = [];
            })

            .addCase(fetchQuizzesByCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload;
            })

            .addCase(fetchQuizzesByCourse.rejected, (state, action) => {
                state.loading = false;
                state.quizzes = [];
                state.error =
                    action.payload || "Failed to load quizzes.";
            })

            // Get single quiz
            .addCase(fetchQuizById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedQuiz = null;
            })

            .addCase(fetchQuizById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedQuiz = action.payload;
            })

            .addCase(fetchQuizById.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to load quiz.";
            })

            // Submit quiz
            .addCase(submitQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(submitQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.latestResult = action.payload;
            })

            .addCase(submitQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to submit quiz.";
            })

            // Get my quiz results
            .addCase(fetchMyQuizResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchMyQuizResults.fulfilled, (state, action) => {
                state.loading = false;
                state.myResults = action.payload;
            })

            .addCase(fetchMyQuizResults.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to load quiz results.";
            });
    },
});

export const {
    clearLatestResult,
    clearQuizzes
} = quizSlice.actions;

export default quizSlice.reducer;
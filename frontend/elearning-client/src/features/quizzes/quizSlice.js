import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getQuizzesByCourseApi,getQuizByIdApi, getMyQuizResultApi, submitQuizApi } from "../../api/quizApi";

export const fetchQuizzesByCourse = createAsyncThunk(
    "quizzes/fetchQuizzesByCourse",
    async (courseId) => {
        const response = await getQuizzesByCourseApi(courseId);
        return response.data;
    }
);

export const fetchQuizById = createAsyncThunk(
    "quizzes/fetchQuizById",
    async (quizId) => {
        const response = await getQuizByIdApi(quizId);
        return response.data;
    }
);

export const submitQuiz = createAsyncThunk(
    "quizzes/submitQuiz",
    async ({ quizId, answers }) => {
        const response = await submitQuizApi(quizId, {answers});
        return response.data
    }
);

export const fetchMyQuizResults = createAsyncThunk(
    "quizzes/fetchMyQuizResults",
    async () => {
        const response = await getMyQuizResultApi();
        return response.data;
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
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizzesByCourse.fulfilled, (state, action) => {
                state.quizzes = action.payload;
            })
            .addCase(fetchQuizById.fulfilled, (state, action) => {
                state.selectedQuiz = action.payload;
            })
            .addCase(submitQuiz.fulfilled, (state, action) => {
                state.latestResult = action.payload;
            })
            .addCase(fetchMyQuizResults.fulfilled, (state, action) => {
                state.myResults = action.payload;
            });
    },
});

export const { clearLatestResult } = quizSlice.actions;
export default quizSlice.reducer;

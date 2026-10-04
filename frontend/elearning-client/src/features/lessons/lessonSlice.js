import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLessonByIdApi } from "../../api/lessonApi";

const getLessonErrorMessage = (error) => {
    if (error.response?.status === 403) {
        return "You need to enroll in this course before opening its lessons.";
    }

    if (error.response?.status === 401) {
        return "Please login as a student to open lessons.";
    }

    const message = error.response?.data;

    if (typeof message === "string") {
        return message;
    }

    return "Failed to load lesson";
};

export const fetchLessonById = createAsyncThunk(
    "lessons/fetchLessonById",
    async (lessonId, { rejectWithValue }) => {
        try {
            const response = await getLessonByIdApi(lessonId);
            return response.data;
        } catch (error) {
            return rejectWithValue(getLessonErrorMessage(error));
        }
    }
);

const lessonSlice = createSlice({
    name: "lessons",
    initialState: {
        selectedLesson: null,
        loading: false,
        error: null
    },
    reducers: {
        markSelectedLessonCompleted: (state) => {
            if (state.selectedLesson) {
                state.selectedLesson.isCompleted = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessonById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedLesson = null;
            })
            .addCase(fetchLessonById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedLesson = action.payload;
            })
            .addCase(fetchLessonById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load lesson";
            });
    },
});

export const { markSelectedLessonCompleted } = lessonSlice.actions;
export default lessonSlice.reducer;

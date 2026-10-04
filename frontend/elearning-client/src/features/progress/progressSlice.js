import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    completeLessonApi,
    getCourseProgressApi,
} from "../../api/progressApi";

export const fetchCourseProgress = createAsyncThunk("progress/fetchCourseProgress", async (courseId) => {
    const response = await getCourseProgressApi(courseId);
    return response.data;
});

export const completeLesson = createAsyncThunk("progress/completeLesson", async (lessonId) => {
    const response = await completeLessonApi(lessonId);
    return response.data;
});

const progressSlice = createSlice({
    name: "Progress",
    initialState: {
        currentProgress: null,
    },
    reducers: {
        progressUpdated: (state, action) => {
            state.currentProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCourseProgress.fulfilled, (state, action) => {
            state.currentProgress = action.payload;
        })
        .addCase(completeLesson.fulfilled, (state, action) => {
            state.currentProgress = action.payload;
        });
    },
});

export const { progressUpdated } = progressSlice.actions;
export default progressSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import courseReducer from "../features/courses/courseSlice";
import lessonReducer from "../features/lessons/lessonSlice";
import progressReducer from "../features/progress/progressSlice";
import quizReducer from "../features/quizzes/quizSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: courseReducer,
        lessons: lessonReducer,
        progress: progressReducer,
        quizzes: quizReducer,
    }
});
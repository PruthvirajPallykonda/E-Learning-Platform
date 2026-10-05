import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
    getCoursesApi,
    getCourseByIdApi,
    createCourseApi,
    enrollCourseApi,
    getMyCoursesApi,
    getMyInstructorCoursesApi
} from "../../api/courseApi";

const getErrorMessage = (error, fallback) => {
    const message = error.response?.data;

    if (typeof message === "string") {
        return message;
    }

    if (message?.title) {
        return message.title;
    }

    return fallback;
};

export const fetchCourses = createAsyncThunk("courses/fetchAll", async () => {
    const response = await getCoursesApi();
    return response.data;
});

export const fetchCourseById = createAsyncThunk("courses/fetchById", async (id) => {
    const response = await getCourseByIdApi(id);
    return response.data;
});

export const createCourse = createAsyncThunk("courses/create", async (data, { rejectWithValue }) => {
    try {
        const response = await createCourseApi(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Failed to create course."));
    }
});

export const enrollCourse = createAsyncThunk("courses/enroll", async (courseId, { rejectWithValue }) => {
    try {
        const response = await enrollCourseApi(courseId);
        return { courseId: Number(courseId), message: response.data };
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Enrollment failed"));
    }
});

export const fetchMyCourses = createAsyncThunk("courses/mycourses", async () => {
    const response = await getMyCoursesApi();
    return response.data;
});

const courseSlice = createSlice({
    name: "courses",
    initialState: {
        items: [],
        selectedCourse: null,
        myCourses: [],
        instructorCourses: [],
        loading: false,
        enrolling: false,
        enrollmentMessage: null,
        error: null,
    },
    reducers: {
        clearEnrollmentMessage: (state) => {
            state.enrollmentMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCourses.fulfilled, (state, action) => {
            state.items = action.payload;
        })
        .addCase(fetchCourseById.fulfilled, (state, action) => {
            state.selectedCourse = action.payload;
        })
        .addCase(fetchMyCourses.fulfilled, (state, action) => {
            state.myCourses = action.payload;
        })
        .addCase(fetchMyInstructorCourses.fulfilled, (state, action) => {
        state.instructorCourses = action.payload;
        })
        .addCase(enrollCourse.pending, (state) => {
            state.enrolling = true;
            state.error = null;
            state.enrollmentMessage = null;
        })
        .addCase(enrollCourse.fulfilled, (state, action) => {
            state.enrolling = false;
            state.enrollmentMessage = action.payload.message || "Enrolled successfully.";
        })
        .addCase(enrollCourse.rejected, (state, action) => {
            state.enrolling = false;
            state.error = action.payload || "Enrollment failed";
        });
    },
});

export const fetchMyInstructorCourses = createAsyncThunk(
    "courses/fetchMyInstructorCourses",
    async () => {
        const response = await getMyInstructorCoursesApi();
        return response.data;
    }
);

export const { clearEnrollmentMessage } = courseSlice.actions;
export default courseSlice.reducer;

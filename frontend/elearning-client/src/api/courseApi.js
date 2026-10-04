import axiosClient from "./axiosClient";

export const getCoursesApi = () => {
    return axiosClient.get("/courses");
}

export const getCourseByIdApi = (id) => {
    return axiosClient.get(`/courses/${id}`);
}

export const createCourseApi = (data) => {
    return axiosClient.post("/courses", data);
}

export const updateCourseApi = (id, data) => {
    return axiosClient.put(`/courses/${id}`, data);
}

export const deleteCourseApi = (id) => {
    return axiosClient.delete(`/courses/${id}`);
}

export const enrollCourseApi = (courseId) => {
    return axiosClient.post(`/enrollments/${courseId}`);
}

export const getMyCoursesApi = () => {
    return axiosClient.get("/enrollments/my-courses");
}

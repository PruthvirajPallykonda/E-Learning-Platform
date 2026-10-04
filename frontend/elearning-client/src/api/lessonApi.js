import axiosClient from "./axiosClient";

export const getLessonByCourseApi = (courseId) => {
    return axiosClient.get(`/lesson/course/${courseId}`);
}

export const getLessonByIdApi = (lessonId) => {
    return axiosClient.get(`/lesson/${lessonId}`);
}

export const createLessonApi = (data) => {
    return axiosClient.post("/lesson", data);
}

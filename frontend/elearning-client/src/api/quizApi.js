import axiosClient from "./axiosClient";

export const createQuizApi = (data) => {
    return axiosClient.post("/quizzes", data);
}

export const getQuizzesByCourseApi = (courseId) => {
    return axiosClient.get(`/quizzes/course/${courseId}`);
}

export const getQuizByIdApi = (quizId) => {
    return axiosClient.get(`/quizzes/${quizId}`);
}

export const submitQuizApi = (quizId, data) => {
    return axiosClient.post(`/quizzes/${quizId}/submit`, data);
}

export const getMyQuizResultApi = () => {
    return axiosClient.get("/quizzes/results/my-results");
}
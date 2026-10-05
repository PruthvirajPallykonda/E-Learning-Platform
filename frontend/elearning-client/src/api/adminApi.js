import axiosClient from "./axiosClient";

export const getAdminCoursesApi = () => {
    return axiosClient.get("/admin/courses");
};

export const getAdminUsersApi = () => {
    return axiosClient.get("/admin/users");
};

export const deleteAdminCourseApi = (courseId) => {
    return axiosClient.delete(`/admin/courses/${courseId}`);
};

export const deleteAdminLessonApi = (lessonId) => {
    return axiosClient.delete(`/admin/lessons/${lessonId}`);
};

export const deleteAdminQuizApi = (quizId) => {
    return axiosClient.delete(`/admin/quizzes/${quizId}`);
};

export const deleteAdminUserApi = (userId) => {
    return axiosClient.delete(`/admin/users/${userId}`);
};

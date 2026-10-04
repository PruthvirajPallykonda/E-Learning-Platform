import axiosClient from "./axiosClient";

export const completeLessonApi = (lessonId) => {
  return axiosClient.post(`/progress/complete-lesson/${lessonId}`);
};

export const getCourseProgressApi = (courseId) => {
  return axiosClient.get(`/progress/course/${courseId}`);
};

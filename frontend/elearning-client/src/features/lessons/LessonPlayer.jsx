import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchLessonById,
  markSelectedLessonCompleted,
} from "./lessonSlice";

import {
  completeLesson,
  fetchCourseProgress,
  progressUpdated,
} from "../progress/progressSlice";

import { getLessonByCourseApi } from "../../api/lessonApi";

import ProgressBar from "../progress/ProgressBar";
import { createProgressConnection } from "../../signalr/progressConnection";
import BackButton from "../../components/BackButton";

function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const connectionRef = useRef(null);

  const [courseLessons, setCourseLessons] = useState([]);

  const { user } = useSelector((state) => state.auth);

  const { selectedLesson, loading, error } = useSelector(
    (state) => state.lessons
  );

  const { currentProgress } = useSelector(
    (state) => state.progress
  );

  // --------------------------------------------------
  // Fetch current lesson
  // --------------------------------------------------
  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonById(lessonId));
    }
  }, [dispatch, lessonId]);

  // --------------------------------------------------
  // Fetch all lessons of the current course
  // --------------------------------------------------
  useEffect(() => {
    const loadCourseLessons = async () => {
      if (!selectedLesson?.courseId) {
        return;
      }

      try {
        const response = await getLessonByCourseApi(
          selectedLesson.courseId
        );

        const lessons = Array.isArray(response.data)
          ? response.data
          : [];

        const sortedLessons = [...lessons].sort(
          (a, b) =>
            Number(a.orderNumber) -
            Number(b.orderNumber)
        );

        setCourseLessons(sortedLessons);
      } catch (error) {
        console.error(
          "Failed to load course lessons:",
          error
        );

        setCourseLessons([]);
      }

      dispatch(
        fetchCourseProgress(selectedLesson.courseId)
      );
    };

    loadCourseLessons();
  }, [dispatch, selectedLesson?.courseId]);

  // --------------------------------------------------
  // SignalR progress connection
  // --------------------------------------------------
  useEffect(() => {
    if (
      !user?.token ||
      !selectedLesson?.courseId
    ) {
      return;
    }

    let isMounted = true;

    const connection = createProgressConnection(
      user.token
    );

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        await connection.start();

        if (!isMounted) {
          return;
        }

        await connection.invoke(
          "JoinCourseGroup",
          selectedLesson.courseId
        );
      } catch (error) {
        console.error(
          "SignalR connection failed:",
          error
        );
      }
    };

    connection.on(
      "ProgressUpdated",
      (data) => {
        dispatch(progressUpdated(data));
      }
    );

    startConnection();

    return () => {
      isMounted = false;

      connection.off("ProgressUpdated");

      if (connection.state === "Connected") {
        connection
          .invoke(
            "LeaveCourseGroup",
            selectedLesson.courseId
          )
          .catch(() => {})
          .finally(() => connection.stop());
      } else {
        connection.stop();
      }
    };
  }, [
    dispatch,
    user?.token,
    selectedLesson?.courseId,
  ]);

  // --------------------------------------------------
  // Complete current lesson
  // --------------------------------------------------
  const handleCompleteLesson = async () => {
    const result = await dispatch(
      completeLesson(lessonId)
    );

    if (completeLesson.fulfilled.match(result)) {
      dispatch(markSelectedLessonCompleted());
    }
  };

  // --------------------------------------------------
  // Loading / error states
  // --------------------------------------------------
  if (loading) {
    return (
      <p className="container mt-4">
        Loading lesson...
      </p>
    );
  }

  if (error) {
    return (
      <p className="container mt-4 text-danger">
        {error}
      </p>
    );
  }

  if (!selectedLesson) {
    return null;
  }

  // --------------------------------------------------
  // Find current lesson
  // --------------------------------------------------
  const currentIndex = courseLessons.findIndex(
    (lesson) =>
      String(lesson.id) === String(lessonId)
  );

  const orderedLessons =
    currentIndex >= 0
      ? courseLessons
      : [...courseLessons, selectedLesson].sort(
          (a, b) =>
            Number(a.orderNumber) -
            Number(b.orderNumber)
        );

  const resolvedIndex = orderedLessons.findIndex(
    (lesson) =>
      String(lesson.id) === String(lessonId)
  );

  const isFirstLesson =
    resolvedIndex <= 0;

  const isLastLesson =
    resolvedIndex !== -1 &&
    resolvedIndex === orderedLessons.length - 1;

  const previousLesson =
    resolvedIndex > 0
      ? orderedLessons[resolvedIndex - 1]
      : null;

  const nextLesson =
    resolvedIndex >= 0 &&
    resolvedIndex <
      orderedLessons.length - 1
      ? orderedLessons[resolvedIndex + 1]
      : null;

  // --------------------------------------------------
  // Previous lesson
  // --------------------------------------------------
  const handlePrevious = () => {
    if (!previousLesson) {
      return;
    }

    navigate(
      `/lessons/${previousLesson.id}`
    );
  };

  // --------------------------------------------------
  // Next lesson
  // --------------------------------------------------
  const handleNext = () => {
    if (!nextLesson) {
      return;
    }

    navigate(
      `/lessons/${nextLesson.id}`
    );
  };

  // --------------------------------------------------
  // Finish course
  // --------------------------------------------------
  const handleFinish = () => {
    navigate("/student/dashboard");
  };

  return (
    <div className="container mt-4">
      <BackButton fallback={`/courses/${selectedLesson.courseId}`} />

      <h2>{selectedLesson.title}</h2>

      <p>
        Course: {selectedLesson.courseTitle}
      </p>

      <ProgressBar
        progress={currentProgress}
      />

      <div className="ratio ratio-16x9 mb-3">
        {selectedLesson.videoUrl ? (
          <iframe
            src={selectedLesson.videoUrl}
            title={selectedLesson.title}
            allowFullScreen
          />
        ) : (
          <div className="border d-flex align-items-center justify-content-center">
            No video available
          </div>
        )}
      </div>

      {/* Complete button */}
      <button
        type="button"
        className="btn btn-success me-2"
        onClick={handleCompleteLesson}
        disabled={selectedLesson.isCompleted}
      >
        {selectedLesson.isCompleted
          ? "Completed"
          : "Mark as Completed"}
      </button>

      {/* Navigation buttons */}
      <div className="d-flex justify-content-between mt-4">

        {/* Previous Lesson */}
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handlePrevious}
          disabled={isFirstLesson}
        >
          ← Previous Lesson
        </button>

        {/* Next Lesson */}
        {!isLastLesson ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
            disabled={
              !selectedLesson.isCompleted ||
              !nextLesson
            }
          >
            Next Lesson →
          </button>
        ) : (
          /* Finish Course */
          <button
            type="button"
            className="btn btn-success"
            onClick={handleFinish}
            disabled={
              !selectedLesson.isCompleted
            }
          >
            Finish Course ✓
          </button>
        )}

      </div>
    </div>
  );
}

export default LessonPlayer;

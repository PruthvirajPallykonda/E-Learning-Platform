import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchLessonById, markSelectedLessonCompleted } from "./lessonSlice";
import {
  completeLesson,
  fetchCourseProgress,
  progressUpdated,
} from "../progress/progressSlice";
import ProgressBar from "../progress/ProgressBar";
import { createProgressConnection } from "../../signalr/progressConnection";

function LessonPlayer() {
  const { lessonId } = useParams();
  const dispatch = useDispatch();
  const connectionRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { selectedLesson, loading, error } = useSelector(
    (state) => state.lessons
  );
  const { currentProgress } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchLessonById(lessonId));
  }, [dispatch, lessonId]);

  useEffect(() => {
    if (selectedLesson?.courseId) {
      dispatch(fetchCourseProgress(selectedLesson.courseId));
    }
  }, [dispatch, selectedLesson]);

  useEffect(() => {
  if (!user?.token || !selectedLesson?.courseId) return;

  let isMounted = true;

  const connection = createProgressConnection(user.token);
  connectionRef.current = connection;

  const startConnection = async () => {
    try {
      await connection.start();

      if (!isMounted) return;

      await connection.invoke("JoinCourseGroup", selectedLesson.courseId);
    } catch (error) {
      console.error("SignalR connection failed:", error);
    }
  };

  connection.on("ProgressUpdated", (data) => {
    dispatch(progressUpdated(data));
  });

  startConnection();

  return () => {
    isMounted = false;

    connection.off("ProgressUpdated");

    if (connection.state === "Connected") {
      connection
        .invoke("LeaveCourseGroup", selectedLesson.courseId)
        .catch(() => {})
        .finally(() => connection.stop());
    } else {
      connection.stop();
    }
  };
}, [dispatch, user?.token, selectedLesson?.courseId]);

  const handleCompleteLesson = async () => {
    const result = await dispatch(completeLesson(lessonId));

    if (completeLesson.fulfilled.match(result)) {
      dispatch(markSelectedLessonCompleted());
    }
  };

  if (loading) return <p className="container mt-4">Loading lesson...</p>;

  if (error) return <p className="container mt-4 text-danger">{error}</p>;

  if (!selectedLesson) return null;

  return (
    <div className="container mt-4">
      <h2>{selectedLesson.title}</h2>
      <p>Course: {selectedLesson.courseTitle}</p>

      <ProgressBar progress={currentProgress} />

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

      <button
        className="btn btn-success"
        onClick={handleCompleteLesson}
        disabled={selectedLesson.isCompleted}
      >
        {selectedLesson.isCompleted ? "Completed" : "Mark as Completed"}
      </button>
    </div>
  );
}

export default LessonPlayer;

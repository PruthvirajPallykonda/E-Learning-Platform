import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import CourseList from "./features/courses/CourseList";
import CourseDetails from "./features/courses/CourseDetails";
import CreateCourse from "./features/courses/CreateCourse";
import LessonPlayer from "./features/lessons/LessonPlayer";
import QuizPage from "./features/quizzes/QuizPage";
import CreateLesson from "./features/lessons/CreateLesson";
import CreateQuiz from "./features/quizzes/CreateQuiz";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetails />} />

        <Route
          path="/student/dashboard"
          element={
            <RoleBasedRoute roles={["Student"]}>
              <StudentDashboard />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <RoleBasedRoute roles={["Admin"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/instructor/dashboard"
          element={
            <RoleBasedRoute roles={["Instructor", "Admin"]}>
              <InstructorDashboard />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/instructor/courses/create"
          element={
            <RoleBasedRoute roles={["Instructor", "Admin"]}>
              <CreateCourse />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/instructor/lessons/create"
          element={
            <RoleBasedRoute roles={["Instructor", "Admin"]}>
              <CreateLesson />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/instructor/quizzes/create"
          element={
            <RoleBasedRoute roles={["Instructor", "Admin"]}>
              <CreateQuiz />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPlayer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/:quizId"
          element={
            <RoleBasedRoute roles={["Student"]}>
              <QuizPage />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

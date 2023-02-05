import Header from './components/Header';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home';
import Profile from './pages/Profile';
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails';
import CourseAssignments from './pages/CourseAssignments';
import CourseMembers from './pages/CourseMembers';
import './App.css';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: "/courses",
    element: <ProtectedRoute><Courses /></ProtectedRoute>,
  },
  {
    path: "/courses/:course_id/details",
    element: <ProtectedRoute><CourseDetails /></ProtectedRoute>
  },
  {
    path: "/courses/:course_id/assignments",
    element: <ProtectedRoute><CourseAssignments /></ProtectedRoute>
  },
  {
    path: "/courses/:course_id/members",
    element: <ProtectedRoute><CourseMembers /></ProtectedRoute>
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

function App() {
  return (
    <div className="App">
      <Header />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

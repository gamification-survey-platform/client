import Header from './components/Header';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Landing from './pages/Landing';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails';
import CourseAssignments from './pages/CourseAssignments';
import CourseMembers from './pages/CourseMembers';
import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/courses/:course_id/details",
    element: <CourseDetails />
  },
  {
    path: "/courses/:course_id/assignments",
    element: <CourseAssignments />
  },
  {
    path: "/courses/:course_id/members",
    element: <CourseMembers />
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

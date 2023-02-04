import Header from './components/Header';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Landing from './pages/Landing';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CourseDetails from './pages/CourseDetails';
import CourseAssignments from './pages/CourseAssignments';
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
    path: "/course/:course_id/view",
    element: <CourseDetails />
  },
  {
    path: "/course/:course_id/assignments",
    element: <CourseAssignments />
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

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Courses from './pages/courses/Courses'
import CourseDetails from './pages/courses/CourseDetails'
import CourseAssignments from './pages/courses/CourseAssignments'
import CourseMembers from './pages/courses/CourseMembers'
import AddCourse from './pages/courses/AddCourse'
import AssignmentDetails from './pages/assignments/AssignmentDetails'
import AssignmentSurvey from './pages/assignments/AssignmentSurvey'
import AssignmentReports from './pages/assignments/AssignmentReports'
import AddAssignment from './pages/assignments/AddAssignment'
import AddSurvey from './pages/survey/AddSurvey'
import NotFoundPage from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses',
    element: (
      <ProtectedRoute>
        <Courses />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/details',
    element: (
      <ProtectedRoute>
        <CourseDetails />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/assignments',
    element: (
      <ProtectedRoute>
        <CourseAssignments />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/members',
    element: (
      <ProtectedRoute>
        <CourseMembers />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/add',
    element: (
      <ProtectedRoute>
        <AddCourse />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/edit',
    element: (
      <ProtectedRoute>
        <AddCourse />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/assignments/add',
    element: (
      <ProtectedRoute>
        <AddAssignment />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/assignments/:assignment_id/view',
    element: (
      <ProtectedRoute>
        <AssignmentDetails />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/assignments/:assignment_id/survey',
    element: (
      <ProtectedRoute>
        <AssignmentSurvey />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/assignments/:assignment_id/reports',
    element: (
      <ProtectedRoute>
        <AssignmentReports />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/assignments/:assignment_id/edit',
    element: (
      <ProtectedRoute>
        <AddAssignment />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/assignments/:assignment_id/survey/add',
    element: (
      <ProtectedRoute>
        <AddSurvey />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App

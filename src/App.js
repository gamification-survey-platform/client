import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import CourseAssignments from './pages/CourseAssignments'
import CourseMembers from './pages/CourseMembers'
import AssignmentDetails from './pages/AssignmentDetails'
import AssignmentSurvey from './pages/AssignmentSurvey'
import AssignmentReports from './pages/AssignmentReports'
import AssignmentEdit from './pages/AssignmentEdit'
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
        <AssignmentEdit />
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
    <div className="text-center">
      <RouterProvider router={router} />
    </div>
  )
}

export default App

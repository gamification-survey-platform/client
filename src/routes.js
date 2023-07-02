import Landing from './pages/Landing'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Courses from './pages/courses/Courses'
import CourseDetails from './pages/courses/CourseDetails'
import CourseAssignments from './pages/courses/CourseAssignments'
import CourseMembers from './pages/courses/CourseMembers'
import AssignmentDetails from './pages/assignments/AssignmentDetails'
import AssignmentSurvey from './pages/assignments/AssignmentSurvey'
import AssignmentReports from './pages/reports/AssignmentReports'
import StudentReport from './pages/reports/StudentReport'
import AddAssignment from './pages/assignments/AssignmentForm'
import AddSurvey from './pages/survey/AddSurvey'
import NotFoundPage from './pages/NotFoundPage'
import AssignmentReview from './pages/assignments/AssignmentReview'
import AssignmentForm from './pages/assignments/AssignmentForm'
import CourseForm from './pages/courses/CourseForm'
import Store from './pages/store/Store'
import Purchases from './pages/store/Purchases'
import CourseRewards from './pages/courses/CourseRewards'
import Theme from './pages/theme/Theme'
import Guide from './pages/Guide'
import Leaderboard from './pages/Leaderboard'

const routes = [
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
    path: '/guide',
    element: (
      <ProtectedRoute>
        <Guide />
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
    path: '/courses/:course_id/rewards',
    element: (
      <ProtectedRoute>
        <CourseRewards />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/add',
    element: (
      <ProtectedRoute>
        <CourseForm />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/edit',
    element: (
      <ProtectedRoute>
        <CourseForm />
      </ProtectedRoute>
    )
  },
  {
    path: '/courses/:course_id/assignments/add',
    element: (
      <ProtectedRoute>
        <AssignmentForm />
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
    path: '/courses/:course_id/assignments/:assignment_id/reviews/:review_id',
    element: (
      <ProtectedRoute>
        <AssignmentReview />
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
    path: '/courses/:course_id/assignments/:assignment_id/artifacts/:artifact_id/reports',
    element: (
      <ProtectedRoute>
        <StudentReport />
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
    path: '/courses/:course_id/leaderboard',
    element: (
      <ProtectedRoute>
        <Leaderboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/store/',
    element: (
      <ProtectedRoute>
        <Store />
      </ProtectedRoute>
    )
  },
  {
    path: '/theme/',
    element: (
      <ProtectedRoute>
        <Theme />
      </ProtectedRoute>
    )
  },
  {
    path: '/purchases/',
    element: (
      <ProtectedRoute>
        <Purchases />
      </ProtectedRoute>
    )
  },
  {
    path: '/leaderboard/',
    element: (
      <ProtectedRoute>
        <Leaderboard />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]

export default routes

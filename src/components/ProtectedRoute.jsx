import { Navigate } from 'react-router-dom'
import Header from './Header'
import { useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'

const ProtectedRoute = ({ redirectPath = '/', children }) => {
  const loggedInUser = useSelector(userSelector)

  if (!loggedInUser) {
    return <Navigate to={redirectPath} />
  }
  return (
    <>
      <Header>{children}</Header>
    </>
  )
}

export default ProtectedRoute

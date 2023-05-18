import { Navigate } from 'react-router-dom'
import Header from './Header'
import { useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import themeSelector from '../store/theme/selectors'
import { ConfigProvider } from 'antd'

const ProtectedRoute = ({ redirectPath = '/', children }) => {
  const loggedInUser = useSelector(userSelector)
  const theme = useSelector(themeSelector)

  if (!loggedInUser) {
    return <Navigate to={redirectPath} />
  }
  return (
    <ConfigProvider
      theme={{
        token: theme
      }}>
      <Header>{children}</Header>
    </ConfigProvider>
  )
}

export default ProtectedRoute

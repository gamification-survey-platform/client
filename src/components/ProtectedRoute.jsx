import { Navigate } from 'react-router-dom'
import Header from './Header'
import { useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import themeSelector from '../store/theme/selectors'
import { ConfigProvider } from 'antd'
import CursorStyles from '../styles/Cursor.module.css'

const ProtectedRoute = ({ redirectPath = '/', children }) => {
  const loggedInUser = useSelector(userSelector)
  const { color: colorTheme, cursor } = useSelector(themeSelector)

  if (!loggedInUser) {
    return <Navigate to={redirectPath} />
  }

  return (
    <div className={CursorStyles[`${cursor}`]}>
      <ConfigProvider
        theme={{
          token: colorTheme
        }}>
        <Header>{children}</Header>
      </ConfigProvider>
    </div>
  )
}

export default ProtectedRoute

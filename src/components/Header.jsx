import { LinkContainer } from 'react-router-bootstrap'
import Logo from '../assets/cmu-logo.svg'
import { useDispatch, useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import { persistor } from '../store/store'
import { logout } from '../store/user/userSlice'
import { Layout, Menu, Image, Typography } from 'antd'
import { UserOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { GiShoppingCart } from 'react-icons/gi'
import ChartWrapper from './visualization/ChartWrapper'

let items = [
  {
    key: '1',
    icon: <UserOutlined />,
    label: 'Profile'
  },
  {
    key: '2',
    icon: <BookOutlined />,
    label: 'Courses'
  },
  {
    key: '3',
    icon: <GiShoppingCart />,
    label: 'Store'
  }
]

const AppHeader = ({ children }) => {
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (user && user.is_staff) {
    items = items.filter((item) => item.key !== '3')
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await persistor.pause()
    await persistor.flush()
    await persistor.purge()
    dispatch(logout())
  }

  const handleClick = (e) => {
    const { key } = e
    switch (key) {
      case '1':
        navigate('/profile')
        break
      case '2':
        navigate('/courses')
        break
      case '3':
        navigate('/store')
        break
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider collapsible>
        <Menu theme="dark" mode="inline" items={items} onClick={handleClick} />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: 10,
            zIndex: 1,
            height: '60vh',
            width: 180
          }}>
          <ChartWrapper type="progressTriangle" data={{ pct: 0 }} />
        </div>
      </Layout.Sider>
      <Layout className="site-layout">
        <Layout.Header
          style={{
            paddingLeft: 10,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <LinkContainer to="/dashboard" style={{ cursor: 'pointer', paddingLeft: 10 }}>
            <Image src={Logo} preview={false} width={300} />
          </LinkContainer>
          <LinkContainer to="/" onClick={handleLogout}>
            <Typography.Text role="button">Logout</Typography.Text>
          </LinkContainer>
        </Layout.Header>
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    </Layout>
  )
}
export default AppHeader

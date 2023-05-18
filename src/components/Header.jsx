import { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Logo from '../assets/cmu-logo.svg'
import { useDispatch, useSelector } from 'react-redux'
import userSelector from '../store/user/selectors'
import { persistor } from '../store/store'
import { logout } from '../store/user/userSlice'
import { Layout, Menu, Image, Typography } from 'antd'
import { UserOutlined, BookOutlined, AntDesignOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { GiShoppingCart } from 'react-icons/gi'
import ChartWrapper from './visualization/ChartWrapper'
import Bronze from '../assets/bronze.png'
import Silver from '../assets/silver.png'
import Gold from '../assets/gold.png'
import Diamond from '../assets/diamond.png'
import Master from '../assets/master.png'
import Grandmaster from '../assets/grandmaster.png'

const rankings = [
  { title: 'Bronze', image: Bronze },
  { title: 'Silver', image: Silver },
  { title: 'Gold', image: Gold },
  { title: 'Diamond', image: Diamond },
  { title: 'Master', image: Master },
  { title: 'Grandmaster', image: Grandmaster }
]

const initialItems = [
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
  },
  {
    key: '4',
    icon: <AntDesignOutlined />,
    label: 'Theme'
  }
]

const AppHeader = ({ children }) => {
  const user = useSelector(userSelector)
  const [collapsed, setCollapsed] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [items, setItems] = useState(initialItems)

  useEffect(() => {
    console.log(user)
    if (user && user.is_staff) {
      setItems(items.filter((item) => item.key !== '3' && item.key !== '4'))
    } else if (user && user.level < 0) {
      setItems(items.filter((item) => item.key !== '4'))
    }
  }, [user])

  const handleLogout = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await persistor.pause()
    await persistor.flush()
    await persistor.purge()
    dispatch(logout())
    navigate('/')
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
      case '4':
        navigate('/theme')
        break
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider collapsible onCollapse={(collapsed) => setCollapsed(collapsed)}>
        <Menu theme="dark" mode="inline" items={items} onClick={handleClick} />
        {collapsed || user.is_staff ? null : (
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: 10,
              zIndex: 1,
              height: '30vh',
              width: 180
            }}>
            <div className="text-center text-white">
              <Image width={100} src={rankings[user.level].image} />
              <p>Ranking: {rankings[user.level].title}</p>
              <p>
                {user.exp} / {user.next_level_exp}
              </p>
            </div>
            <ChartWrapper type="progressTriangle" data={{ pct: user.exp / user.next_level_exp }} />
          </div>
        )}
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
